from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union

class Observation(BaseModel):
    code: str = Field(..., description="The current state of the code being reviewed")
    language: str = Field(default="python", description="The programming language of the code (e.g., 'python', 'javascript')")
    diagnostics: List[str] = Field(default_factory=list, description="List of warnings or errors found in the current code")
    task_id: str = Field(..., description="Unique identifier for the current task")
    step_count: int = Field(default=0, description="Number of steps taken in the current episode")
    max_steps: int = Field(default=5, description="Maximum allowed steps for this task")

class Action(BaseModel):
    action_type: str = Field(..., description="The type of action: 'suggest_fix', 'analyze', or 'submit'")
    content: str = Field(..., description="The content of the action (e.g., the code fix or analysis query)")

class Reward(BaseModel):
    value: float = Field(..., description="Numerical reward between -1.0 and 1.0 (or 0.0-1.0 for terminal)")
    reason: str = Field(..., description="Human-readable explanation for the reward")
    done: bool = Field(default=False, description="Whether the episode has terminated")

class State(BaseModel):
    """Internal state model for the simulation"""
    task_id: str
    original_code: str
    current_code: str
    history: List[Dict[str, Any]]
    is_completed: bool
