import os
import sys

# Ensure project root is in path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from backend.main import app

# This is the entry point for Vercel Serverless Functions
# It exports the FastAPI 'app' instance
