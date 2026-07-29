import json
import logging
from typing import Optional, Dict, Any, List
from app.core.config import settings

logger = logging.getLogger("padanam_ai.llm")


class LLMProvider:
    def __init__(self):
        self.provider_type = settings.LLM_PROVIDER.lower()
        logger.info(f"Initialized LLMProvider with mode: '{self.provider_type}'")

    async def generate_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        lang: str = "en"
    ) -> str:
        if self.provider_type == "openai" and settings.OPENAI_API_KEY:
            try:
                import httpx
                async with httpx.AsyncClient(timeout=30.0) as client:
                    headers = {
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    }
                    messages = []
                    if system_prompt:
                        messages.append({"role": "system", "content": system_prompt})
                    messages.append({"role": "user", "content": prompt})

                    payload = {
                        "model": "gpt-4o-mini",
                        "messages": messages,
                        "temperature": 0.7
                    }
                    resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["choices"][0]["message"]["content"].strip()
            except Exception as e:
                logger.warning(f"OpenAI call failed ({e}), falling back to local engine.")

        elif self.provider_type == "gemini" and settings.GEMINI_API_KEY:
            try:
                import httpx
                async with httpx.AsyncClient(timeout=30.0) as client:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                    contents = []
                    if system_prompt:
                        contents.append({"role": "user", "parts": [{"text": f"System Instruction: {system_prompt}"}]})
                    contents.append({"role": "user", "parts": [{"text": prompt}]})

                    payload = {"contents": contents}
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
            except Exception as e:
                logger.warning(f"Gemini call failed ({e}), falling back to local engine.")

        # Local Rule-Based Fallback Engine (Guarantees zero-downtime demo/viva without API keys)
        return self._local_heuristic_response(prompt, system_prompt, lang)

    def _local_heuristic_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        lang: str = "en"
    ) -> str:
        lower_prompt = prompt.lower()
        is_ml = (lang == "ml") or ("malayalam" in lower_prompt) or ("മലയാളം" in lower_prompt) or ("ml" in (system_prompt or "").lower())
        
        if is_ml:
            if "wave" in lower_prompt or " sound" in lower_prompt or "തരംഗ" in lower_prompt:
                return (
                    "**തരംഗ ചലനം (Wave Motion - SCERT 10 Physics)**:\n\n"
                    "ഊർജ്ജം ഒരു സ്ഥലത്തുനിന്ന് മറ്റൊരു സ്ഥലത്തേക്ക് മാധ്യമത്തിന്റെ കണികകളുടെ യഥാർത്ഥ വ്യതിയാനം കൂടാതെ സംക്രമിക്കുന്ന പ്രക്രിയയാണ് തരംഗ ചലനം.\n\n"
                    "1. **അനുപ്രസ്ഥ തരംഗങ്ങൾ (Transverse Waves)**: മാധ്യമത്തിന്റെ കണികകൾ തരംഗ ചലന ദിശയ്ക്ക് ലംബമായി കമ്പനം ചെയ്യുന്നു (ഉദാഹരണം: ജല തരംഗങ്ങൾ).\n"
                    "2. **അനുദൈർഘ്യ തരംഗങ്ങൾ (Longitudinal Waves)**: മാധ്യമത്തിന്റെ കണികകൾ തരംഗ ചലന ദിശയ്ക്ക് സമാന്തരമായി കമ്പനം ചെയ്യുന്നു (ഉദാഹരണം: ശബ്ദ തരംഗങ്ങൾ).\n\n"
                    "പ്രധാന സൂത്രവാക്യം: തരംഗ വേഗം $v = f \\times \\lambda$ (ഇവിടെ $f$ തരംഗ ആവൃത്തിയും, $\\lambda$ തരംഗദൈർഘ്യവുമാണ്)."
                )
            elif "light" in lower_prompt or "reflection" in lower_prompt or "refraction" in lower_prompt or "പ്രകാശം" in lower_prompt:
                return (
                    "**പ്രകാശ പ്രതിഫലനം (Reflection & Refraction of Light)**:\n\n"
                    "ഒരു പ്രകാശരശ്മി മിനുസമാർന്ന പ്രതലത്തിൽ തട്ടി തിരിച്ചുവരുന്ന പ്രക്രിയയാണ് പ്രകാശ പ്രതിഫലനം.\n\n"
                    "• **പ്രതിഫലന നിയമങ്ങൾ**:\n"
                    "  1. പതനകോണും (Angle of Incidence, $i$) പ്രതിഫലനകോണും (Angle of Reflection, $r$) തുല്യമായിരിക്കും ($i = r$).\n"
                    "  2. പതനരശ്മി, പ്രതിഫലനരശ്മി, പതനബിന്ദുവിലെ ലംബം എന്നിവ ഒരേ തലത്തിലായിരിക്കും."
                )
            elif "arithmetic" in lower_prompt or "sequence" in lower_prompt or "math" in lower_prompt or "ശ്രേണി" in lower_prompt:
                return (
                    "**സമാന്തര ശ്രേണി (Arithmetic Sequences - SCERT 10 Mathematics)**:\n\n"
                    "ഒരു പദത്തോടൊപ്പം ഒരു നിശ്ചിത സംഖ്യ (പൊതുവ്യത്യാസം, $d$) കൂട്ടി അടുത്ത പദം കണ്ടെത്തുന്ന സംഖ്യാ ശ്രേണിയാണ് സമാന്തര ശ്രേണി.\n\n"
                    "• $n$-ാം പദം ($n$-th term): $x_n = a + (n - 1)d$\n"
                    "• ആദ്യ $n$ പദങ്ങളുടെ തുക: $S_n = \\frac{n}{2} [2a + (n - 1)d]$"
                )
            else:
                return (
                    "**പഠനം എ.ഐ പഠന സഹായി (Padanam AI Tutor)**:\n\n"
                    "നിങ്ങൾ ചോദിച്ച വിഷയത്തെക്കുറിച്ചുള്ള ലളിതമായ വിശദീകരണം:\n"
                    "എസ്.സി.ഇ.ആർ.ടി സിലബസ് അനുസരിച്ച് അടിസ്ഥാന ആശയങ്ങൾ കൃത്യമായി മനസ്സിലാക്കി പഠിക്കുന്നത് പരീക്ഷകളിൽ മികച്ച വിജയം നേടാൻ സഹായിക്കും."
                )

        # Default English explanations if language preference is 'en'
        if "misconception" in lower_prompt or "explain_wrong" in lower_prompt:
            return (
                "**Misconception Diagnosis**:\n\n"
                "It looks like you selected a common trap answer! Remember that transverse wave particles vibrate *perpendicular* to the direction of wave propagation, whereas longitudinal wave particles vibrate *parallel* to it. Do not confuse particle vibration direction with wave propagation direction."
            )

        if "wave" in lower_prompt or "sound" in lower_prompt:
            return (
                "**Wave Motion & Sound (SCERT Class 10 Physics)**:\n\n"
                "Wave motion transfers energy through a medium without transferring physical matter.\n\n"
                "1. **Transverse Waves**: Particle vibration is perpendicular to wave motion (e.g., ripples on water).\n"
                "2. **Longitudinal Waves**: Particle vibration is parallel to wave motion (e.g., Sound waves in air).\n\n"
                "Key Formula: Velocity $v = f \\times \\lambda$ (where $f$ is frequency and $\\lambda$ is wavelength)."
            )
        elif "light" in lower_prompt or "reflection" in lower_prompt or "refraction" in lower_prompt:
            return (
                "**Reflection and Refraction of Light (SCERT Class 10 Physics)**:\n\n"
                "Light travels in straight lines. When light encounters a boundary between two optical media:\n"
                "• **Laws of Reflection**: Angle of incidence equals angle of reflection ($i = r$).\n"
                "• **Refraction**: Bending of light when entering a medium with a different optical density, governed by Snell's Law ($n_1 \\sin i = n_2 \\sin r$)."
            )
        elif "arithmetic" in lower_prompt or "sequence" in lower_prompt or "math" in lower_prompt:
            return (
                "**Arithmetic Sequences (SCERT Class 10 Mathematics)**:\n\n"
                "An arithmetic sequence is a sequence of numbers where the difference between consecutive terms remains constant ($d$).\n\n"
                "• $n$-th Term Formula: $a_n = a + (n - 1)d$\n"
                "• Sum of first $n$ terms: $S_n = \\frac{n}{2} (a + a_n)$"
            )

        return (
            "Padanam AI Learning Assistant: I am tracking your SCERT Kerala State Board curriculum progress. "
            "Mastering this concept requires breaking it down into fundamental principles, applying real-world analogies, "
            "and taking targeted quick quizzes to test your understanding."
        )


llm_provider = LLMProvider()
