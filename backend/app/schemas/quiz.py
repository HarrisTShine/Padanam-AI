from typing import List, Optional
from pydantic import BaseModel


class QuestionOption(BaseModel):
    key: str  # "A", "B", "C", "D"
    text: str


class QuizQuestion(BaseModel):
    id: int
    question_text: str
    options: List[QuestionOption]
    correct_answer: str
    explanation: Optional[str] = None


class QuizGenerateRequest(BaseModel):
    topic_id: int
    num_questions: int = 4
    difficulty: str = "medium"  # "easy", "medium", "hard"


class SingleAnswerSubmission(BaseModel):
    question_id: int
    question_text: str
    student_answer: str
    correct_answer: str


class QuizSubmissionRequest(BaseModel):
    topic_id: int
    time_taken_seconds: int = 120
    answers: List[SingleAnswerSubmission]


class DiagnosticItem(BaseModel):
    question_text: str
    student_answer: str
    correct_answer: str
    is_correct: bool
    misconception_analysis: str  # Diagnostic explanation of WHY it was wrong


class QuizSubmissionResult(BaseModel):
    quiz_attempt_id: int
    topic_id: int
    score_percentage: float
    total_questions: int
    correct_count: int
    new_mastery_score: float
    is_weak_topic: bool
    diagnostics: List[DiagnosticItem]
    motivational_feedback: str
