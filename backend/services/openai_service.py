import os
import openai
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")
client = openai.OpenAI(api_key=os.getenv("VITE_OPENAI_API_KEY"))

def generate_explanation(code: str, issue: str) -> str:
    if not client.api_key:
        return "Error: VITE_OPENAI_API_KEY environment variable is not configured."

    prompt = f"""You are a senior software engineer.
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
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI code reviewer."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"OpenAI API Error: {str(e)}"
