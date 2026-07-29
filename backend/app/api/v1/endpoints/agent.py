from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.curriculum import Topic
from app.models.progress import TopicMastery
from app.schemas.agent import AgentChatRequest, AgentChatResponse
from app.api.v1.endpoints.auth import get_current_user
from app.agents.tutor_agent import tutor_agent
from app.agents.tools import explain_wrong_answer

router = APIRouter(prefix="/agent", tags=["AI Tutor Agent"])


@router.post("/chat", response_model=AgentChatResponse)
async def chat_with_tutor(
    req: AgentChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    student_prof = current_user.student_profile

    # Build defaults – works for any role (teacher/parent demos too)
    student_id = student_prof.id if student_prof else current_user.id
    grade = student_prof.grade if student_prof else 10
    lang = req.language_preference or (student_prof.language_preference if student_prof else "en")
    speed = student_prof.learning_speed if student_prof else "moderate"

    topic_title = "Wave Motion & Energy"
    topic_mastery = 0.5

    if req.topic_id:
        topic_obj = (await db.execute(select(Topic).where(Topic.id == req.topic_id))).scalars().first()
        if topic_obj:
            topic_title = topic_obj.title
            if student_prof:
                mastery_obj = (await db.execute(
                    select(TopicMastery).where(
                        TopicMastery.student_id == student_prof.id,
                        TopicMastery.topic_id == req.topic_id,
                    )
                )).scalars().first()
                if mastery_obj:
                    topic_mastery = mastery_obj.mastery_score

    initial_state = {
        "student_id": student_id,
        "grade": grade,
        "board": "SCERT_KERALA",
        "language_preference": lang,
        "topic_id": req.topic_id,
        "topic_title": topic_title,
        "topic_mastery": topic_mastery,
        "learning_speed": speed,
        "weak_topics": [],
        "user_message": req.message,
        "retrieved_context": "",
        "agent_response": "",
        "strategy_used": "standard",
        "last_misconception": None,
        "suggested_quiz": False,
    }

    final_state = await tutor_agent.run(initial_state)

    followups = (
        [
            "ഇത് കൂടുതൽ ലളിതമായി വിശദീകരിക്കാമോ?",
            "ഇതിന്റെ സൂത്രവാക്യം എന്താണ്?",
            "എന്നെ ഒരു ക്വിസ് പരീക്ഷിക്കാമോ?",
        ]
        if lang == "ml"
        else [
            "Can you explain this with a real-life Kerala example?",
            "What is the mathematical formula for this?",
            "Can you test me with a 2-minute quiz?",
        ]
    )

    return AgentChatResponse(
        response=final_state.get("agent_response", "Let's explore this topic together!"),
        strategy_used=final_state.get("strategy_used", "standard"),
        suggested_followups=followups,
        recommended_quiz=final_state.get("suggested_quiz", False),
    )


@router.post("/explain-misconception")
async def explain_misconception(
    question_text: str,
    student_answer: str,
    correct_answer: str,
    _: User = Depends(get_current_user),   # auth-gated
):
    explanation = await explain_wrong_answer(question_text, student_answer, correct_answer)
    return {"misconception_analysis": explanation}
