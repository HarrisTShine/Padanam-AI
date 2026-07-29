import logging
from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.progress import QuizAttempt, TopicMastery
from app.models.user import StudentProfile

logger = logging.getLogger("padanam_ai.mastery")


class MasteryService:
    def update_mastery_ema(
        self,
        current_mastery: float,
        quiz_score_pct: float,
        alpha: float = 0.4
    ) -> Tuple[float, bool]:
        """
        Exponential Moving Average (EMA) update for mastery score:
        new_mastery = alpha * (quiz_score_pct / 100) + (1 - alpha) * current_mastery
        """
        score_decimal = quiz_score_pct / 100.0
        new_mastery = (alpha * score_decimal) + ((1.0 - alpha) * current_mastery)
        new_mastery = max(0.0, min(1.0, round(new_mastery, 3)))
        
        is_weak = new_mastery < 0.60
        return new_mastery, is_weak

    async def auto_classify_learning_style(
        self,
        student_prof: StudentProfile,
        db: AsyncSession
    ) -> str:
        """
        Automatically infers and updates the student's learning style/speed based on 
        recent quiz activity, response speed per question, and overall mastery accuracy.
        """
        # Fetch last 5 quiz attempts for this student
        result = await db.execute(
            select(QuizAttempt)
            .where(QuizAttempt.student_id == student_prof.id)
            .order_by(QuizAttempt.completed_at.desc())
            .limit(5)
        )
        attempts = result.scalars().all()

        if not attempts:
            return student_prof.learning_speed or "balanced_interactive"

        total_questions = sum(a.total_questions for a in attempts)
        total_time = sum(a.time_taken_seconds for a in attempts)
        avg_score = sum(a.score_percentage for a in attempts) / len(attempts)
        
        avg_time_per_q = (total_time / total_questions) if total_questions > 0 else 30.0

        # Algorithmic classification:
        if avg_time_per_q < 25.0 and avg_score >= 80.0:
            inferred_style = "fast_paced"
        elif avg_score < 60.0 or avg_time_per_q > 55.0:
            inferred_style = "guided_step_by_step"
        else:
            inferred_style = "balanced_interactive"

        # Update profile if changed
        if student_prof.learning_speed != inferred_style:
            student_prof.learning_speed = inferred_style
            await db.commit()
            logger.info(f"Auto-classified student {student_prof.id} learning style to: {inferred_style}")

        return inferred_style


mastery_service = MasteryService()
