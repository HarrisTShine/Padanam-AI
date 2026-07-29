from typing import List, Optional
from pydantic import BaseModel


class TopicMasteryItem(BaseModel):
    topic_id: int
    topic_title: str
    subject_name: str
    mastery_score: float
    attempts_count: int
    is_weak_topic: bool


class StudentProgressSummary(BaseModel):
    overall_mastery: float
    total_quizzes_taken: int
    weak_topics_count: int
    strong_topics_count: int
    learning_speed: str
    recommended_next_topic_id: Optional[int] = None
    recommended_next_topic_title: Optional[str] = None
    weak_topics: List[TopicMasteryItem] = []
    topic_masteries: List[TopicMasteryItem] = []


class ClassStudentAnalytics(BaseModel):
    student_id: int
    full_name: str
    grade: int
    overall_mastery: float
    weak_topics_count: int
    recent_quiz_score: float


class ParentChildReport(BaseModel):
    child_name: str
    grade: int
    board: str
    overall_progress_percent: float
    recent_activity: str
    strengths: List[str]
    areas_for_growth: List[str]
    encouragement_note: str
