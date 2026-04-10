# Stage 1: Build Frontend
FROM node:20 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Backend & Frontend
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies for torch if needed
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend /app/backend
# Copy built frontend
COPY --from=build-stage /app/dist /app/dist

# Expose port 7860 (Hugging Face default)
EXPOSE 7860

# Run the application
# We use python -m uvicorn to ensure it's in the path
CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
