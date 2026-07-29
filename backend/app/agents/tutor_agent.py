import logging
from typing import Dict, Any
from app.agents.state import AgentState
from app.agents.tools import (
    retrieve_curriculum_content,
    explain_concept,
    assess_understanding,
    give_motivational_feedback
)

logger = logging.getLogger("padanam_ai.agent")


class LangGraphTutorAgent:
    """
    Explicit LangGraph StateGraph agent for Padanam AI.
    Executes an inspectable state machine loop for SCERT student tutoring.
    """

    def __init__(self):
        self._build_graph()

    def _build_graph(self):
        try:
            from langgraph.graph import StateGraph, END
            
            workflow = StateGraph(AgentState)

            workflow.add_node("retrieve_context", self._node_retrieve)
            workflow.add_node("determine_pedagogy", self._node_pedagogy)
            workflow.add_node("generate_explanation", self._node_explain)
            workflow.add_node("assess_understanding", self._node_assess)

            workflow.set_entry_point("retrieve_context")
            workflow.add_edge("retrieve_context", "determine_pedagogy")
            workflow.add_edge("determine_pedagogy", "generate_explanation")
            workflow.add_edge("generate_explanation", "assess_understanding")
            workflow.add_edge("assess_understanding", END)

            self.graph = workflow.compile()
            logger.info("LangGraph Tutor Agent compiled successfully.")
        except Exception as e:
            logger.warning(f"Could not compile LangGraph ({e}). Using direct orchestrator runner.")
            self.graph = None

    async def _node_retrieve(self, state: AgentState) -> Dict[str, Any]:
        topic = state.get("topic_title", "Wave Motion")
        grade = state.get("grade", 10)
        board = state.get("board", "SCERT_KERALA")
        lang = state.get("language_preference", "en")

        retrieved = await retrieve_curriculum_content(topic=topic, grade=grade, board=board, language=lang)
        return {"retrieved_context": retrieved}

    async def _node_pedagogy(self, state: AgentState) -> Dict[str, Any]:
        mastery = state.get("topic_mastery", 0.5)
        lang = state.get("language_preference", "en")
        msg = state.get("user_message", "").lower()

        if lang == "ml" or "മലയാളം" in msg or "malayalam" in msg:
            strategy = "bilingual_malayalam"
        elif mastery < 0.45 or "confused" in msg or "don't understand" in msg or "again" in msg:
            strategy = "analogy"
        else:
            strategy = "standard"

        return {"strategy_used": strategy}

    async def _node_explain(self, state: AgentState) -> Dict[str, Any]:
        topic = state.get("topic_title", "Wave Motion")
        strategy = state.get("strategy_used", "standard")
        explanation = await explain_concept(topic=topic, student_state=state, strategy=strategy)
        return {"agent_response": explanation}

    async def _node_assess(self, state: AgentState) -> Dict[str, Any]:
        assessment = await assess_understanding(student_state=state)
        suggest_quiz = assessment.get("decision") == "ready_for_quiz"
        return {"suggested_quiz": suggest_quiz}

    async def run(self, initial_state: AgentState) -> AgentState:
        if self.graph:
            try:
                final_state = await self.graph.ainvoke(initial_state)
                return final_state
            except Exception as e:
                logger.warning(f"LangGraph execution error ({e}), running fallback flow.")

        # Sequential fallback execution matching the exact state machine
        s1 = await self._node_retrieve(initial_state)
        initial_state.update(s1)
        
        s2 = await self._node_pedagogy(initial_state)
        initial_state.update(s2)
        
        s3 = await self._node_explain(initial_state)
        initial_state.update(s3)
        
        s4 = await self._node_assess(initial_state)
        initial_state.update(s4)

        return initial_state


tutor_agent = LangGraphTutorAgent()
