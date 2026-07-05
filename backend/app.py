from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from pathlib import Path

from engine.orchestrator import run_agent


app = FastAPI(
    title="Suproc AI Business Agent",
    version="1.0.0",
    description="Backend API for the Suproc AI Supplier Recommendation Agent",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data directory
DATA_DIR = Path(__file__).parent / "data"


@app.get("/")
def home():
    return {
        "message": "Suproc AI Backend is running 🚀",
        "status": "success",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


class ExecuteRequest(BaseModel):
    query: str


@app.post("/execute")
def execute(request: ExecuteRequest):
    print("=" * 60)
    print("POST /execute received")
    print("Query:", request.query)
    print("Calling run_agent()...")

    result = run_agent(request.query)

    print("run_agent() finished")
    print("=" * 60)

    return result


# Dataset endpoints (read-only)
@app.get("/datasets/businesses")
def get_businesses():
    with open(DATA_DIR / "businesses.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/datasets/professionals")
def get_professionals():
    with open(DATA_DIR / "professionals.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/datasets/suppliers")
def get_suppliers():
    # Suppliers are stored in businesses.json (as per dataset.py mapping)
    with open(DATA_DIR / "businesses.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/datasets/opportunities")
def get_opportunities():
    with open(DATA_DIR / "opportunities.json", "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/datasets/interactions")
def get_interactions():
    with open(DATA_DIR / "interactions.json", "r", encoding="utf-8") as f:
        return json.load(f)