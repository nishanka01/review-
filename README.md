
# 🧠 CodeReview-Simulation (OpenEnv)

CodeReview-Simulation is a high-performance, OpenEnv-compliant simulation environment for AI-driven code auditing. It provides a structured interface for agents to perform real-world code review tasks, featuring programmatic grading and multi-step interactions.

## 🚀 Key Features

- **OpenEnv Spec Compliant**: Implements the full OpenEnv interface with typed Pydantic models for Observations, Actions, and Rewards.
- **3-Tier Task System**:
  - **Easy (Variable Rename)**: Descriptive naming audit.
  - **Medium (O(n) Optimization)**: Algorithmic efficiency audit.
  - **Hard (SQL Injection)**: Security vulnerability mitigation.
- **Programmatic Graders**: Deterministic scoring (0.0 - 1.0) for every task.
- **Baseline Evaluation**: Reproducible inference scripts for testing models against the environment.
- **Premium UI**: Integrated dashboard for real-time visualization of agent progress and rewards.

## 🛠️ OpenEnv Interface

### Observation Space
```json
{
  "code": "string",
  "diagnostics": ["string"],
  "task_id": "string",
  "step_count": 0,
  "max_steps": 5
}
```

### Action Space
```json
{
  "action_type": "suggest_fix | analyze | submit",
  "content": "string"
}
```

## 📦 Setup & Usage

1. **Environment Setup**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Run Baseline Inference**:
   Requires `OPENAI_API_KEY` in your environment.
   ```bash
   python scripts/baseline_inference.py
   ```

3. **Start the API Server**:
   ```bash
   python -m uvicorn backend.main:app --port 8000
   ```

## 🐳 Docker Deployment

The environment is containerized and ready for Hugging Face Spaces:
```bash
docker build -t openenv-codereview .
docker run -p 7860:7860 --env-file .env openenv-codereview
```

---
Built compliant with the OpenEnv Spec by [Gaurav Deori](https://github.com/Gauravdeori)
