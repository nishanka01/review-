import sys
import os

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from env.code_review_env import CodeReviewEnv
from models import Action

def test_flow():
    env = CodeReviewEnv()
    
    # Test Reset
    print("Testing Reset...")
    obs = env.reset(task_id="task_1")
    print(f"Initial Code: {obs.code}")
    
    # Test Step
    print("\nTesting Step (suggest_fix)...")
    fixed_code = "def calculate_area(length, width):\n    area = length * width\n    return area"
    action = Action(action_type="suggest_fix", content=fixed_code)
    
    next_obs, reward, done, info = env.step(action)
    print(f"Reward: {reward.value}")
    print(f"Reason: {reward.reason}")
    print(f"Done: {done}")
    
    # Test State
    print("\nTesting State Export...")
    state = env.state_export()
    print(f"State Task ID: {state.task_id}")
    print(f"State Completed: {state.is_completed}")

if __name__ == "__main__":
    try:
        test_flow()
        print("\n[SUCCESS] Verification Successful!")
    except Exception as e:
        print(f"\n[FAILURE] Verification Failed: {e}")
