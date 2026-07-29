from typing import Optional, List
from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)  # "SCERT_KERALA", "CBSE", "ICSE"
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    subjects: Mapped[List["Subject"]] = relationship("Subject", back_populates="board", cascade="all, delete-orphan")
    students: Mapped[List["StudentProfile"]] = relationship("StudentProfile", back_populates="board")


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    board_id: Mapped[int] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)
    grade: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    name: Mapped[str] = mapped_column(String, nullable=False)  # e.g., "Physics"
    name_ml: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # e.g., "ഭൗതികശാസ്ത്രം"
    code: Mapped[str] = mapped_column(String, nullable=False)  # e.g., "PHY10"
    icon_name: Mapped[str] = mapped_column(String, default="Atom", nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="subjects")
    chapters: Mapped[List["Chapter"]] = relationship("Chapter", back_populates="subject", cascade="all, delete-orphan")


class Chapter(Base):
    __tablename__ = "chapters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    chapter_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    title_ml: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    subject: Mapped["Subject"] = relationship("Subject", back_populates="chapters")
    topics: Mapped[List["Topic"]] = relationship("Topic", back_populates="chapter", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    topic_order: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    title: Mapped[str] = mapped_column(String, nullable=False)
    title_ml: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    content_summary: Mapped[str] = mapped_column(Text, nullable=False)
    content_summary_ml: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    chapter: Mapped["Chapter"] = relationship("Chapter", back_populates="topics")
    learning_outcomes: Mapped[List["LearningOutcome"]] = relationship("LearningOutcome", back_populates="topic", cascade="all, delete-orphan")
    masteries: Mapped[List["TopicMastery"]] = relationship("TopicMastery", back_populates="topic", cascade="all, delete-orphan")
    quiz_attempts: Mapped[List["QuizAttempt"]] = relationship("QuizAttempt", back_populates="topic", cascade="all, delete-orphan")


class LearningOutcome(Base):
    __tablename__ = "learning_outcomes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    topic_id: Mapped[int] = mapped_column(ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    code: Mapped[str] = mapped_column(String, nullable=False)  # e.g., "LO-PHY10-1.1"
    description: Mapped[str] = mapped_column(Text, nullable=False)

    topic: Mapped["Topic"] = relationship("Topic", back_populates="learning_outcomes")
