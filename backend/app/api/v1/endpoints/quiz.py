from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User, StudentProfile
from app.models.curriculum import Topic
from app.models.progress import TopicMastery, QuizAttempt, QuizQuestionAttempt
from app.schemas.quiz import (
    QuizGenerateRequest, QuizSubmissionRequest,
    QuizSubmissionResult, DiagnosticItem,
)
from app.api.v1.endpoints.auth import get_current_user
from app.agents.tools import generate_quiz, explain_wrong_answer, give_motivational_feedback
from app.services.mastery_service import mastery_service

router = APIRouter(prefix="/quiz", tags=["Quiz Engine"])


# ---------------------------------------------------------------------------
# POST /quiz/generate  – returns AI-generated quiz questions
# ---------------------------------------------------------------------------

@router.post("/generate")
async def generate_quiz_endpoint(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    topic = (await db.execute(select(Topic).where(Topic.id == req.topic_id))).scalars().first()
    topic_title = topic.title if topic else "General Science"

    questions = await generate_quiz(
        topic=topic_title,
        difficulty=req.difficulty,
        num_questions=req.num_questions,
    )
    return {
        "topic_id": req.topic_id,
        "topic_title": topic_title,
        "difficulty": req.difficulty,
        "questions": questions,
    }


# ---------------------------------------------------------------------------
# POST /quiz/submit  – scores answers, runs misconception AI, updates mastery & AI learning style
# ---------------------------------------------------------------------------

@router.post("/submit", response_model=QuizSubmissionResult)
async def submit_quiz_endpoint(
    req: QuizSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_prof = current_user.student_profile

    # Auto-create a minimal student profile for teacher/admin doing a demo quiz
    if not student_prof:
        student_prof = StudentProfile(
            user_id=current_user.id,
            grade=10,
            language_preference="en",
            learning_speed="moderate",
        )
        db.add(student_prof)
        await db.flush()

    total_q = len(req.answers)
    correct_cnt = 0
    diagnostics: list[DiagnosticItem] = []

    for ans in req.answers:
        is_correct = ans.student_answer.strip().upper() == ans.correct_answer.strip().upper()
        if is_correct:
            correct_cnt += 1
            misconception = "Correct! Solid understanding of the core principle."
        else:
            misconception = await explain_wrong_answer(
                question=ans.question_text,
                student_answer=ans.student_answer,
                correct_answer=ans.correct_answer,
            )

        diagnostics.append(DiagnosticItem(
            question_text=ans.question_text,
            student_answer=ans.student_answer,
            correct_answer=ans.correct_answer,
            is_correct=is_correct,
            misconception_analysis=misconception,
        ))

    score_pct = (correct_cnt / total_q * 100.0) if total_q > 0 else 0.0

    # Update EMA mastery score
    mastery_obj = (await db.execute(
        select(TopicMastery).where(
            TopicMastery.student_id == student_prof.id,
            TopicMastery.topic_id == req.topic_id,
        )
    )).scalars().first()

    curr_mastery = mastery_obj.mastery_score if mastery_obj else 0.5
    new_mastery, is_weak = mastery_service.update_mastery_ema(
        current_mastery=curr_mastery,
        quiz_score_pct=score_pct,
    )

    if mastery_obj:
        mastery_obj.mastery_score = new_mastery
        mastery_obj.attempts_count += 1
        mastery_obj.is_weak_topic = is_weak
    else:
        mastery_obj = TopicMastery(
            student_id=student_prof.id,
            topic_id=req.topic_id,
            mastery_score=new_mastery,
            attempts_count=1,
            is_weak_topic=is_weak,
        )
        db.add(mastery_obj)

    # Persist quiz attempt record
    quiz_attempt = QuizAttempt(
        student_id=student_prof.id,
        topic_id=req.topic_id,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_cnt,
        time_taken_seconds=req.time_taken_seconds,
    )
    db.add(quiz_attempt)
    await db.flush()

    for diag in diagnostics:
        db.add(QuizQuestionAttempt(
            quiz_attempt_id=quiz_attempt.id,
            question_text=diag.question_text,
            student_answer=diag.student_answer,
            correct_answer=diag.correct_answer,
            is_correct=diag.is_correct,
            misconception_analysis=diag.misconception_analysis,
        ))

    await db.commit()

    # Automatically infer and update learning style based on quiz speed & performance
    await mastery_service.auto_classify_learning_style(student_prof, db)

    motivational = await give_motivational_feedback({
        "topic_mastery": new_mastery,
        "language_preference": student_prof.language_preference,
    })

    return QuizSubmissionResult(
        quiz_attempt_id=quiz_attempt.id,
        topic_id=req.topic_id,
        score_percentage=score_pct,
        total_questions=total_q,
        correct_count=correct_cnt,
        new_mastery_score=new_mastery,
        is_weak_topic=is_weak,
        diagnostics=diagnostics,
        motivational_feedback=motivational,
    )
