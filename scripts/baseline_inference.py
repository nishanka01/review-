import os
import sys
import json
from openai import OpenAI
from dotenv import load_dotenv

# Add backend to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from env.code_review_env import CodeReviewEnv
from models import Action

load_dotenv()

def run_baseline():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    env = CodeReviewEnv()
    
    results = []
    
    tasks = ["task_1", "task_2", "task_3"]
    
    print("🚀 Starting OpenEnv Baseline Inference...\n")
    
    for task_id in tasks:
        print(f"📋 Evaluating {task_id}...")
        obs = env.reset(task_id=task_id)
        
        prompt = f"""
        You are an expert code reviewer.
        Your task is: {task_id}
        
        Current Code:
        {obs.code}
        
        Diagnostics:
        {", ".join(obs.diagnostics) if obs.diagnostics else "None"}
        
        Please provide the FULL corrected code. Do not include any explanation, just the code.
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", # Default baseline
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            
            fixed_code = response.choices[0].message.content.strip()
            # Remove markdown code blocks if present
            if fixed_code.startswith("```"):
                lines = fixed_code.splitlines()
                fixed_code = "\n".join(lines[1:-1])
            
            action = Action(action_type="suggest_fix", content=fixed_code)
            next_obs, reward, done, info = env.step(action)
            
            print(f"✅ Reward: {reward.value} | Reason: {reward.reason}")
            results.append({
                "task": task_id,
                "score": reward.value,
                "status": "Success" if reward.value >= 0.8 else "Partial/Fail"
            })
            
        except Exception as e:
            print(f"❌ Error during inference: {e}")
            results.append({"task": task_id, "score": 0.0, "status": f"Error: {str(e)}"})

    print("\n📊 final results:")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    if not os.getenv("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY not found in environment.")
        sys.exit(1)
    run_baseline()
