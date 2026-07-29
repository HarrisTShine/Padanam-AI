import pytest
from app.agents.tools import (
    retrieve_curriculum_content,
    assess_understanding,
    explain_wrong_answer,
    give_motivational_feedback
)
from app.services.mastery_service import mastery_service


@pytest.mark.asyncio
async def test_agent_tools_execution():
    # Test 1: RAG retrieval
    content = await retrieve_curriculum_content(topic="Wave Motion", grade=10)
    assert content is not None
    assert len(content) > 0

    # Test 2: Assess understanding logic
    assessment = await assess_understanding(student_state={"topic_mastery": 0.8, "learning_speed": "moderate"})
    assert assessment["decision"] == "ready_for_quiz"

    # Test 3: Misconception explanation
    misconception = await explain_wrong_answer(
        question="In which direction do transverse wave particles vibrate?",
        student_answer="Parallel to wave motion",
        correct_answer="Perpendicular to wave motion"
    )
    assert misconception is not None
    assert len(misconception) > 0


def test_mastery_ema_calculation():
    # Test Exponential Moving Average calculation
    initial_mastery = 0.50
    quiz_score_pct = 100.0  # 100%
    alpha = 0.4
    
    new_mastery, is_weak = mastery_service.update_mastery_ema(initial_mastery, quiz_score_pct, alpha)
    # Expected: 0.4 * 1.0 + 0.6 * 0.5 = 0.4 + 0.3 = 0.70
    assert new_mastery == 0.70
    assert is_weak is False
