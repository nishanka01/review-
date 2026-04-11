import random
from typing import Tuple, Dict, Any, Optional
from models import Observation, Action, Reward, State
from tasks.registry import TASKS, get_task_by_id
from tasks.graders import get_grader

class CodeReviewEnv:
    def __init__(self):
        self.current_task_idx = 0
        self.state: Optional[State] = None
        self.step_count = 0
        self.max_steps = 5

    def reset(self, task_id: Optional[str] = None) -> Observation:
        """Initializes a new episode with a specific task or the next sequential one."""
        if task_id:
            task = get_task_by_id(task_id)
        else:
            task = TASKS[self.current_task_idx % len(TASKS)]
            self.current_task_idx += 1

        self.state = State(
            task_id=task["id"],
            original_code=task["initial_code"],
            current_code=task["initial_code"],
            history=[],
            is_completed=False
        )
        self.step_count = 0
        
        return self._get_observation()

    def step(self, action: Action) -> Tuple[Observation, Reward, bool, Dict[str, Any]]:
        """Applies an action to the code and returns the result."""
        if not self.state:
            raise ValueError("Environment must be reset before calling step()")

        self.step_count += 1
        
        # Action logic
        if action.action_type == "suggest_fix":
            # In this simulation, we assume the agent provides the NEW version of the code
            self.state.current_code = action.content
        
        # Calculate Reward using the grader
        task_info = get_task_by_id(self.state.task_id)
        grader = get_grader(task_info["grader_id"])
        
        current_score = grader(self.state.current_code)
        
        # Meaningful Reward Logic
        # - Gain relative to previous step or baseline
        # - Terminal reward for completion
        reward_value = current_score
        is_done = (current_score >= 1.0) or (self.step_count >= self.max_steps)
        
        if action.action_type == "submit":
            is_done = True
            
        reward = Reward(
            value=reward_value,
            reason=f"Current code score: {current_score:.2f} based on objective: {task_info['objective']}",
            done=is_done
        )
        
        # Transition state
        self.state.is_completed = is_done
        self.state.history.append({"action": action.dict(), "reward": reward.dict()})
        
        return self._get_observation(), reward, is_done, {"score": current_score}

    def state_export(self) -> State:
        """Returns the full internal state (OpenEnv requirement)"""
        return self.state

    def _get_observation(self) -> Observation:
        task_info = get_task_by_id(self.state.task_id)
        return Observation(
            code=self.state.current_code,
            language=task_info.get("language", "python"),
            diagnostics=self._run_mock_diagnostics(self.state.current_code),
            task_id=self.state.task_id,
            step_count=self.step_count,
            max_steps=self.max_steps
        )

    def _run_mock_diagnostics(self, code: str) -> list:
        """Simple mock diagnostics to simulate tool outputs"""
        diags = []
        if "eval(" in code:
            diags.append("Security Warning: use of eval() is dangerous.")
        if len(code) > 1000:
            diags.append("Linter: function too long.")
        return diags
