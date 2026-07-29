import logging
from typing import Dict, Any, List
from app.services.rag_service import rag_service
from app.services.llm_provider import llm_provider

logger = logging.getLogger("padanam_ai.tools")


async def retrieve_curriculum_content(topic: str, grade: int = 10, board: str = "SCERT_KERALA", language: str = "en") -> str:
    """Tool 1: RAG lookup against vector database."""
    chunks = rag_service.retrieve_context(query=topic, grade=grade, board=board, language=language)
    return "\n\n".join([c["content"] for c in chunks])


async def explain_concept(topic: str, student_state: Dict[str, Any], strategy: str = "standard") -> str:
    """
    Tool 2: Generates explanation adjusting register/complexity/language.
    Strategies: 'standard', 'analogy', 'simplified', 'bilingual_malayalam'
    """
    lang = student_state.get("language_preference", "en")
    mastery = student_state.get("topic_mastery", 0.5)

    if lang == "ml":
        system_instruction = (
            "You are Padanam AI, an encouraging Kerala SCERT tutor. "
            "STRICT LANGUAGE RULE: The user has chosen Malayalam (മലയാളം) as their AI Tutor teaching language. "
            "Regardless of whether the user asked their question in English or Malayalam, your response MUST BE ENTIRELY IN MALAYALAM (മലയാളത്തിൽ ആയിരിക്കണം)."
        )
    else:
        system_instruction = (
            "You are Padanam AI, an encouraging Kerala SCERT tutor. "
            "STRICT LANGUAGE RULE: The user has chosen English as their AI Tutor teaching language. "
            "Regardless of whether the user asked their question in English or Malayalam, your response MUST BE ENTIRELY IN ENGLISH."
        )

    prompt = (
        f"Topic: {topic}\n"
        f"Strategy: {strategy}\n"
        f"Selected Teaching Language: {lang}\n"
        f"Student Mastery Score: {mastery}\n\n"
        f"User Query: {student_state.get('user_message', '')}\n\n"
        f"Provide a clear, engaging explanation tailored for a SCERT Class 10 student adhering strictly to the Selected Teaching Language rule."
    )
    return await llm_provider.generate_response(prompt=prompt, system_prompt=system_instruction, lang=lang)


async def assess_understanding(student_state: Dict[str, Any]) -> Dict[str, Any]:
    """Tool 3: Decides whether to move on, slow down, or re-teach."""
    mastery = student_state.get("topic_mastery", 0.5)
    speed = student_state.get("learning_speed", "moderate")
    
    if mastery < 0.4:
        decision = "re_teach_analogy"
    elif mastery < 0.7:
        decision = "practice_guided"
    else:
        decision = "ready_for_quiz"

    return {
        "mastery_score": mastery,
        "decision": decision,
        "recommendation": f"Student state evaluated with speed '{speed}'. Decision: {decision}"
    }


async def generate_quiz(topic: str, difficulty: str = "medium", num_questions: int = 3) -> List[Dict[str, Any]]:
    """Tool 4: Generates grounded quiz items at appropriate difficulty."""
    if "wave" in topic.lower() or "sound" in topic.lower():
        return [
            {
                "id": 1,
                "question_text": "In a transverse wave, in which direction do the particles of the medium vibrate relative to the direction of wave motion?",
                "options": [
                    {"key": "A", "text": "Parallel to wave motion"},
                    {"key": "B", "text": "Perpendicular to wave motion"},
                    {"key": "C", "text": "In circular motion"},
                    {"key": "D", "text": "Particles do not vibrate"}
                ],
                "correct_answer": "B",
                "explanation": "Transverse wave particles vibrate perpendicular to the direction of wave propagation."
            },
            {
                "id": 2,
                "question_text": "Which of the following is an example of an electromagnetic wave?",
                "options": [
                    {"key": "A", "text": "Sound wave"},
                    {"key": "B", "text": "Water surface wave"},
                    {"key": "C", "text": "Light wave"},
                    {"key": "D", "text": "Ultrasonic wave"}
                ],
                "correct_answer": "C",
                "explanation": "Light waves are electromagnetic waves and do not require a material medium to propagate."
            },
            {
                "id": 3,
                "question_text": "What is the relationship between wave velocity (v), frequency (f), and wavelength (λ)?",
                "options": [
                    {"key": "A", "text": "v = f × λ"},
                    {"key": "B", "text": "v = f / λ"},
                    {"key": "C", "text": "v = λ / f"},
                    {"key": "D", "text": "v = f + λ"}
                ],
                "correct_answer": "A",
                "explanation": "Wave velocity equals frequency multiplied by wavelength (v = f × λ)."
            }
        ]
    elif "light" in topic.lower() or "reflection" in topic.lower():
        return [
            {
                "id": 101,
                "question_text": "According to the Law of Reflection, if the angle of incidence is 35°, what is the angle of reflection?",
                "options": [
                    {"key": "A", "text": "55°"},
                    {"key": "B", "text": "35°"},
                    {"key": "C", "text": "70°"},
                    {"key": "D", "text": "90°"}
                ],
                "correct_answer": "B",
                "explanation": "The Law of Reflection states that the angle of incidence equals the angle of reflection (i = r)."
            },
            {
                "id": 102,
                "question_text": "When light travels from air into glass, why does it bend towards the normal line?",
                "options": [
                    {"key": "A", "text": "Glass has lower optical density than air"},
                    {"key": "B", "text": "Glass has higher optical density and slows down the light"},
                    {"key": "C", "text": "Light speeds up in glass"},
                    {"key": "D", "text": "The frequency of light increases in glass"}
                ],
                "correct_answer": "B",
                "explanation": "Glass is optically denser than air, causing light to slow down and bend towards the normal."
            }
        ]
    else:
        return [
            {
                "id": 201,
                "question_text": "What is the common difference (d) of the arithmetic sequence: 4, 7, 10, 13, ...?",
                "options": [
                    {"key": "A", "text": "2"},
                    {"key": "B", "text": "3"},
                    {"key": "C", "text": "4"},
                    {"key": "D", "text": "7"}
                ],
                "correct_answer": "B",
                "explanation": "Common difference d = 7 - 4 = 3."
            },
            {
                "id": 202,
                "question_text": "What is the 10th term of an arithmetic sequence with first term a = 2 and common difference d = 5?",
                "options": [
                    {"key": "A", "text": "47"},
                    {"key": "B", "text": "50"},
                    {"key": "C", "text": "52"},
                    {"key": "D", "text": "45"}
                ],
                "correct_answer": "A",
                "explanation": "10th term a_10 = a + (10-1)d = 2 + 9(5) = 47."
            }
        ]


async def explain_wrong_answer(question: str, student_answer: str, correct_answer: str) -> str:
    """Tool 5: Diagnostic explanation of the misconception."""
    prompt = (
        f"Question: {question}\n"
        f"Student Chosen Answer: {student_answer}\n"
        f"Correct Answer: {correct_answer}\n\n"
        f"Diagnose the student's underlying misconception. Explain WHY their chosen answer was incorrect "
        f"and clarify the fundamental concept so they don't repeat the mistake."
    )
    return await llm_provider.generate_response(prompt=prompt, system_prompt="You are an expert SCERT diagnostic educator.")


async def recommend_next_lesson(student_state: Dict[str, Any]) -> Dict[str, Any]:
    """Tool 6: Decides next topic using mastery scores + weak topics."""
    weak = student_state.get("weak_topics", [])
    if weak:
        next_topic = weak[0]
        reason = f"Remediation recommended for weak topic: {next_topic}"
    else:
        next_topic = "Reflection & Refraction of Light"
        reason = "Prerequisite mastered! Progressing to next SCERT Class 10 chapter."

    return {
        "recommended_topic": next_topic,
        "reason": reason
    }


async def generate_study_plan(student_state: Dict[str, Any], timeframe: str = "7_days") -> Dict[str, Any]:
    """Tool 7: Produces a structured, prioritized study plan."""
    grade = student_state.get("grade", 10)
    weak_topics = student_state.get("weak_topics", ["Wave Motion"])

    return {
        "timeframe": timeframe,
        "title": f"SCERT Grade {grade} Tailored {timeframe} Study Roadmap",
        "daily_schedule": [
            {"day": 1, "focus": f"Review & Remediation: {weak_topics[0] if weak_topics else 'Wave Motion'}", "duration": "45 mins"},
            {"day": 2, "focus": "Practice Quiz & Misconception Review: Wave Formulae (v = fλ)", "duration": "30 mins"},
            {"day": 3, "focus": "New Topic: Laws of Reflection & Ray Diagrams", "duration": "60 mins"},
            {"day": 4, "focus": "Malayalam/English Concept Breakdown & Formulas", "duration": "45 mins"},
            {"day": 5, "focus": "Mathematics: Arithmetic Sequences (Common Difference d)", "duration": "60 mins"},
            {"day": 6, "focus": "Full Topic Mastery Quiz & Performance Heatmap Check", "duration": "45 mins"},
            {"day": 7, "focus": "Weekly Spaced Repetition Review & Parent Progress Sync", "duration": "30 mins"}
        ]
    }


async def give_motivational_feedback(student_state: Dict[str, Any]) -> str:
    """Tool 8: Contextual encouragement."""
    mastery = student_state.get("topic_mastery", 0.5)
    lang = student_state.get("language_preference", "en")

    if lang == "ml":
        if mastery >= 0.8:
            return "ഉജ്ജ്വലമായ മുന്നേറ്റം! നിങ്ങൾ ഈ വിഷയം മികച്ച രീതിയിൽ സ്വായത്തമാക്കിയിരിക്കുന്നു. 🌟"
        return "നല്ല ശ്രമം! സ്ഥിരമായ പരിശ്രമത്തിലൂടെ നിങ്ങൾക്ക് ഈ വിഷയം കൂടുതൽ എളുപ്പത്തിൽ മനസ്സിലാക്കാം. 🚀"
    else:
        if mastery >= 0.8:
            return "Outstanding progress! You have demonstrated high mastery in this SCERT topic. Keep shining! 🌟"
        return "Great effort! Consistency is key to mastering Kerala State Board concepts. Let's practice a bit more! 🚀"
