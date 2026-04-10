import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_explanation_groq(code: str, issue: str, language: str = "python") -> str:
    if not client.api_key:
        return "Error: GROQ_API_KEY environment variable is not configured."

    prompt = f"""You are a senior software engineer reviewing {language} code.
Review this code:
```
{code}
```
Detected issue: {issue}

Provide exactly using markdown formatting:
1. **What's Wrong**:
2. **Why It Matters**:
3. **Suggested Fix**:
4. **Best Practice**:
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI code reviewer that provides concise, high-quality technical feedback.",
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Groq API Error: {str(e)}"

def evaluate_code_groq(code: str, language: str = "python"):
    """
    Evaluates code correctness, usefulness, and critical misses.
    Returns a dictionary with flags.
    """
    if not client.api_key:
        return {"is_correct": False, "is_useful": False, "missed_critical": True, "error": "No API Key"}

    prompt = f"""Evaluate this {language} code for correctness and quality.
```
{code}
```
Return a JSON object with strictly these keys:
- is_correct (boolean): True if syntax is correct and logic seems sound for a basic snippet.
- is_useful (boolean): True if the code follows basic good practices.
- missed_critical (boolean): True if there is a security flaw, crash potential, or major bug.
- detected_issue (string): A short label for the main issue (e.g., "Syntax Error", "Logic Bug", "Optimization Needed", "None").

Return ONLY the JSON object.
"""
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a code evaluation engine. Output JSON only."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {"is_correct": False, "is_useful": False, "missed_critical": True, "error": str(e)}
