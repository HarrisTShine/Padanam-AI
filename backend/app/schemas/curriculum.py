from typing import Optional, List
from pydantic import BaseModel


class LearningOutcomeOut(BaseModel):
    id: int
    code: str
    description: str

    class Config:
        from_attributes = True


class TopicOut(BaseModel):
    id: int
    chapter_id: int
    topic_order: int
    title: str
    title_ml: Optional[str] = None
    content_summary: str
    content_summary_ml: Optional[str] = None
    learning_outcomes: List[LearningOutcomeOut] = []

    class Config:
        from_attributes = True


class ChapterOut(BaseModel):
    id: int
    subject_id: int
    chapter_number: int
    title: str
    title_ml: Optional[str] = None
    description: Optional[str] = None
    topics: List[TopicOut] = []

    class Config:
        from_attributes = True


class SubjectOut(BaseModel):
    id: int
    board_id: int
    grade: int
    name: str
    name_ml: Optional[str] = None
    code: str
    icon_name: str
    chapters: List[ChapterOut] = []

    class Config:
        from_attributes = True


class BoardOut(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    subjects: List[SubjectOut] = []

    class Config:
        from_attributes = True
