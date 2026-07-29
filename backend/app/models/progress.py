from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class TopicMastery(Base):
    __tablename__ = "topic_masteries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    mastery_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)  # 0.0 to 1.0
    attempts_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_weak_topic: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_studied_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    student: Mapped["StudentProfile"] = relationship("StudentProfile", back_populates="topic_masteries")
    topic: Mapped["Topic"] = relationship("Topic", back_populates="masteries")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    score_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    correct_count: Mapped[int] = mapped_column(Integer, nullable=False)
    time_taken_seconds: Mapped[int] = mapped_column(Integer, default=120)
    completed_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    student: Mapped["StudentProfile"] = relationship("StudentProfile", back_populates="quiz_attempts")
    topic: Mapped["Topic"] = relationship("Topic", back_populates="quiz_attempts")
    question_attempts: Mapped[List["QuizQuestionAttempt"]] = relationship("QuizQuestionAttempt", back_populates="quiz_attempt", cascade="all, delete-orphan")


class QuizQuestionAttempt(Base):
    __tablename__ = "quiz_question_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    quiz_attempt_id: Mapped[int] = mapped_column(ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    student_answer: Mapped[str] = mapped_column(String, nullable=False)
    correct_answer: Mapped[str] = mapped_column(String, nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    misconception_analysis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    quiz_attempt: Mapped["QuizAttempt"] = relationship("QuizAttempt", back_populates="question_attempts")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String, default="info")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="notifications")
