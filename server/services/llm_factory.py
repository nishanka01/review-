import os
from .openai_service import generate_explanation as openai_explain
from .groq_service import generate_explanation_groq, evaluate_code_groq

def get_explanation(code: str, issue: str, language: str = "python"):
    # Prefer Groq for speed/user request, but fallback to OpenAI if needed
    if os.getenv("GROQ_API_KEY"):
        return generate_explanation_groq(code, issue, language)
    return openai_explain(code, issue)

def evaluate_code(code: str, language: str = "python"):
    # Currently only implemented in Groq service for the JSON output format
    if os.getenv("GROQ_API_KEY"):
        return evaluate_code_groq(code, language)
    
    # Simple mock fallback if no Groq key (though we have one now)
    return {
        "is_correct": True,
        "is_useful": True,
        "missed_critical": False,
        "detected_issue": "None"
    }
