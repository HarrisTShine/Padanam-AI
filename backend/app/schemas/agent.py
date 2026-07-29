from typing import List, Optional
from pydantic import BaseModel


class AgentChatMessage(BaseModel):
    sender: str  # "user" or "assistant"
    message: str


class AgentChatRequest(BaseModel):
    message: str
    topic_id: Optional[int] = None
    language_preference: Optional[str] = "en"  # "en" or "ml"


class AgentChatResponse(BaseModel):
    response: str
    strategy_used: str  # e.g., "analogy", "step_by_step", "bilingual_explanation"
    suggested_followups: List[str] = []
    recommended_quiz: bool = False
