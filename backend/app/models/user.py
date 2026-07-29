from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from app.db.base import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    student_profile: Mapped[Optional["StudentProfile"]] = relationship("StudentProfile", foreign_keys="[StudentProfile.user_id]", back_populates="user", uselist=False, cascade="all, delete-orphan")
    teacher_profile: Mapped[Optional["TeacherProfile"]] = relationship("TeacherProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    parent_profile: Mapped[Optional["ParentProfile"]] = relationship("ParentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    grade: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id", ondelete="SET NULL"), nullable=True)
    language_preference: Mapped[str] = mapped_column(String, default="en", nullable=False)  # "en" or "ml"
    learning_speed: Mapped[str] = mapped_column(String, default="moderate", nullable=False)  # "slow", "moderate", "fast"
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    user: Mapped["User"] = relationship("User", foreign_keys=[user_id], back_populates="student_profile")
    board: Mapped[Optional["Board"]] = relationship("Board", back_populates="students")
    topic_masteries: Mapped[List["TopicMastery"]] = relationship("TopicMastery", back_populates="student", cascade="all, delete-orphan")
    quiz_attempts: Mapped[List["QuizAttempt"]] = relationship("QuizAttempt", back_populates="student", cascade="all, delete-orphan")
    study_plans: Mapped[List["StudyPlan"]] = relationship("StudyPlan", back_populates="student", cascade="all, delete-orphan")


class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    school_name: Mapped[str] = mapped_column(String, default="SCERT Kerala High School", nullable=False)
    assigned_grade: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    subject_specialization: Mapped[str] = mapped_column(String, default="Physics & Mathematics", nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="teacher_profile")


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="parent_profile")
