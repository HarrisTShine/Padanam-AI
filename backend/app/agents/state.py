from typing import TypedDict, List, Dict, Any, Optional


class AgentState(TypedDict):
    student_id: int
    grade: int
    board: str
    language_preference: str  # "en" or "ml"
    topic_id: Optional[int]
    topic_title: str
    topic_mastery: float
    learning_speed: str
    weak_topics: List[str]
    user_message: str
    retrieved_context: str
    agent_response: str
    strategy_used: str
    last_misconception: Optional[str]
    suggested_quiz: bool
