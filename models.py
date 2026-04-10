from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import sys

# Ensure backend is in path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

# --- Mandatory Pydantic Models ---

class Observation(BaseModel):
    code: str = Field(..., description="The current state of the code being reviewed")
    language: str = Field(default="python", description="The programming language of the code")
    diagnostics: List[str] = Field(default_factory=list, description="List of warnings or errors")
    task_id: str = Field(..., description="Unique identifier for the current task")
    step_count: int = Field(default=0, description="Steps taken")
    max_steps: int = Field(default=5, description="Max allowed steps")

class Action(BaseModel):
    action_type: str = Field(..., description="Action: 'suggest_fix', 'analyze', or 'submit'")
    content: str = Field(..., description="The content of the action")

class Reward(BaseModel):
    value: float = Field(..., description="Numerical reward between -1.0 and 1.0")
    reason: str = Field(..., description="Explanation")
    done: bool = Field(default=False)

class State(BaseModel):
    task_id: str
    original_code: str
    current_code: str
    history: List[Dict[str, Any]]
    is_completed: bool

# --- Lazy Env Loader ---
_env = None

def get_env():
    global _env
    if _env is None:
        # Avoid circular import at top level
        from env.code_review_env import CodeReviewEnv
        _env = CodeReviewEnv()
    return _env

# --- Mandatory Functions ---

def reset(task_id: Optional[str] = None) -> Observation:
    """Mandatory reset function for OpenEnv."""
    env = get_env()
    obs_data = env.reset(task_id)
    return Observation(**obs_data.dict())

def step(action: Action) -> Dict[str, Any]:
    """Mandatory step function for OpenEnv."""
    env = get_env()
    obs, reward, done, info = env.step(action)
    return {
        "observation": Observation(**obs.dict()),
        "reward": reward.value,
        "done": done,
        "info": info
    }

def get_state() -> State:
    """Mandatory state function for OpenEnv."""
    env = get_env()
    state_data = env.state_export()
    return State(**state_data.dict())
