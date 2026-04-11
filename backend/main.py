import os
import sys

# Ensure root (where models.py is now located) is in path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from env.code_review_env import CodeReviewEnv
from models import Action, Observation, Reward, State
from tasks.registry import TASKS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenEnv compliant environment
env = CodeReviewEnv()

@app.post("/reset", response_model=Observation)
async def reset_env(task_id: str = None):
    try:
        obs = env.reset(task_id=task_id)
        return obs
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/step", response_model=Observation)
async def step_env(action: Action):
    try:
        obs, reward, done, info = env.step(action)
        return obs
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/tasks")
async def get_available_tasks():
    return TASKS

@app.get("/state", response_model=State)
async def get_current_state():
    state = env.state_export()
    if not state:
        raise HTTPException(status_code=404, detail="Environment not initialized")
    return state

# Serve Static Files (Modern OpenEnv Dashboard)
static_path = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_path):
    app.mount("/static", StaticFiles(directory=static_path), name="static")

    @app.get("/")
    async def serve_dashboard():
        index_path = os.path.join(static_path, "index.html")
        return FileResponse(index_path)

    @app.get("/guide")
    async def serve_printable_guide():
        guide_path = os.path.join(static_path, "guide.html")
        return FileResponse(guide_path)

# Fallback for old Assets (if any)
dist_path = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

# Legacy review endpoint for compatibility (if needed)
@app.post("/review")
async def legacy_review(req: dict):
    # Map legacy request to OpenEnv step
    obs = env.reset()
    action = Action(action_type="suggest_fix", content=req.get("code", ""))
    obs, reward, done, info = env.step(action)
    return {
        "detected_issue": "Evaluation Complete",
        "reward_score": reward.value,
        "explanation": reward.reason,
        "is_done": done
    }
