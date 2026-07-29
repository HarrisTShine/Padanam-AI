from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.user import User, StudentProfile
from app.models.curriculum import Topic, Subject, Chapter
from app.models.progress import TopicMastery, QuizAttempt
from app.models.study_plan import StudyPlan
from app.schemas.analytics import StudentProgressSummary, TopicMasteryItem
from app.api.v1.endpoints.auth import get_current_user
from app.agents.tools import generate_study_plan
from app.services.mastery_service import mastery_service

router = APIRouter(prefix="/student", tags=["Student Endpoints"])


# ---------------------------------------------------------------------------
# GET /student/summary
# ---------------------------------------------------------------------------

@router.get("/summary", response_model=StudentProgressSummary)
async def get_student_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_prof = current_user.student_profile

    # Fallback for non-student users or missing profile
    if not student_prof:
        return StudentProgressSummary(
            overall_mastery=0.75,
            total_quizzes_taken=4,
            weak_topics_count=1,
            strong_topics_count=3,
            learning_speed="balanced_interactive",
            recommended_next_topic_id=1,
            recommended_next_topic_title="Wave Motion and Sound",
            weak_topics=[
                TopicMasteryItem(
                    topic_id=1,
                    topic_title="Transverse vs Longitudinal Waves",
                    subject_name="Physics",
                    mastery_score=0.45,
                    attempts_count=2,
                    is_weak_topic=True,
                )
            ],
            topic_masteries=[
                TopicMasteryItem(topic_id=1, topic_title="Transverse vs Longitudinal Waves",
                                 subject_name="Physics", mastery_score=0.45, attempts_count=2, is_weak_topic=True),
                TopicMasteryItem(topic_id=2, topic_title="Reflection of Light & Mirrors",
                                 subject_name="Physics", mastery_score=0.88, attempts_count=4, is_weak_topic=False),
                TopicMasteryItem(topic_id=3, topic_title="Arithmetic Sequences & nth term",
                                 subject_name="Mathematics", mastery_score=0.92, attempts_count=3, is_weak_topic=False),
            ],
        )

    # Auto-classify learning style based on quiz attempts & response speed
    current_style = await mastery_service.auto_classify_learning_style(student_prof, db)

    # Proper join chain: TopicMastery → Topic → Chapter → Subject
    rows = (await db.execute(
        select(TopicMastery, Topic, Subject)
        .join(Topic, TopicMastery.topic_id == Topic.id)
        .join(Chapter, Topic.chapter_id == Chapter.id)
        .join(Subject, Chapter.subject_id == Subject.id)
        .where(TopicMastery.student_id == student_prof.id)
    )).all()

    mastery_items, weak_items, total_mastery = [], [], 0.0
    for tm, top, subj in rows:
        item = TopicMasteryItem(
            topic_id=top.id,
            topic_title=top.title,
            subject_name=subj.name,
            mastery_score=tm.mastery_score,
            attempts_count=tm.attempts_count,
            is_weak_topic=tm.is_weak_topic,
        )
        mastery_items.append(item)
        total_mastery += tm.mastery_score
        if tm.is_weak_topic:
            weak_items.append(item)

    total_quizzes = (await db.execute(
        select(func.count(QuizAttempt.id)).where(QuizAttempt.student_id == student_prof.id)
    )).scalar() or 0

    avg_mastery = round(total_mastery / len(mastery_items), 2) if mastery_items else 0.70

    return StudentProgressSummary(
        overall_mastery=avg_mastery,
        total_quizzes_taken=total_quizzes,
        weak_topics_count=len(weak_items),
        strong_topics_count=max(0, len(mastery_items) - len(weak_items)),
        learning_speed=current_style,
        recommended_next_topic_id=weak_items[0].topic_id if weak_items else 1,
        recommended_next_topic_title=weak_items[0].topic_title if weak_items else "Reflection of Light",
        weak_topics=weak_items,
        topic_masteries=mastery_items,
    )


# ---------------------------------------------------------------------------
# POST /student/study-plan/generate
# ---------------------------------------------------------------------------

@router.post("/study-plan/generate")
async def generate_plan(
    timeframe: str = "7_days",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_prof = current_user.student_profile
    grade = student_prof.grade if student_prof else 10

    plan_dict = await generate_study_plan(
        student_state={"grade": grade, "weak_topics": ["Wave Motion & Sound"]},
        timeframe=timeframe,
    )

    if student_prof:
        db.add(StudyPlan(
            student_id=student_prof.id,
            timeframe=timeframe,
            title=plan_dict["title"],
            plan_data=plan_dict,
        ))
        await db.commit()

    return plan_dict


# ---------------------------------------------------------------------------
# GET /student/study-plan/current
# ---------------------------------------------------------------------------

@router.get("/study-plan/current")
async def get_current_plan(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_prof = current_user.student_profile
    if student_prof:
        plan = (await db.execute(
            select(StudyPlan)
            .where(StudyPlan.student_id == student_prof.id, StudyPlan.is_active == True)  # noqa: E712
            .order_by(StudyPlan.created_at.desc())
        )).scalars().first()
        if plan:
            return plan.plan_data

    # Generate a default plan if none saved yet
    return await generate_study_plan(
        student_state={"grade": 10, "weak_topics": ["Transverse Waves"]},
        timeframe="7_days",
    )
