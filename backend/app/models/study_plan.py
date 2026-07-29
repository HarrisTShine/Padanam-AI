from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    timeframe: Mapped[str] = mapped_column(String, default="7_days")
    title: Mapped[str] = mapped_column(String, nullable=False, default="SCERT Kerala Study Roadmap")
    plan_data: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    student: Mapped["StudentProfile"] = relationship("StudentProfile", back_populates="study_plans")
