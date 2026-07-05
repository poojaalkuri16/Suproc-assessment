# 🏗 Suproc AI Business Agent - System Architecture

## Overview

The Suproc AI Business Agent is a modular AI-powered procurement assistant designed to automate supplier discovery while maintaining explainability and human oversight.

The system follows an agentic workflow where each stage performs a dedicated responsibility before handing control to the next stage.

---

# High-Level Architecture

```
                ┌──────────────────────┐
                │      User Query      │
                └──────────┬───────────┘
                           │
                           ▼
                  Next.js Frontend
                           │
                           ▼
                     FastAPI Backend
                           │
                           ▼
                 AI Agent Orchestrator
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
 Requirement          Planning Engine      Search Engine
 Extraction
        │
        ▼
 Constraint Filtering
        │
        ▼
 Ranking Engine
        │
        ▼
 Validation Engine
        │
        ▼
 Retry Evaluation
        │
        ▼
 Recommendation Engine
        │
        ▼
 Outreach Draft Generation
        │
        ▼
 Human Approval
```

---

# Frontend Architecture

The frontend is developed using:

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui

Responsibilities include:

- Accepting procurement queries
- Displaying live execution progress
- Showing tool activity logs
- Displaying recommendations
- Displaying outreach drafts
- Waiting for user approval

---

# Backend Architecture

The backend is implemented using FastAPI.

Responsibilities include:

- Requirement extraction
- Planning
- Dataset search
- Constraint verification
- Ranking
- Validation
- Recommendation generation
- Outreach preparation
- Human approval

---

# AI Layer

The project integrates Qwen3 through Ollama.

Workflow:

1. User query is sent to Qwen3
2. Structured requirements are extracted
3. If Qwen3 fails or times out,
   deterministic extraction is used.

This ensures reliability while benefiting from LLM understanding.

---

# Dataset Layer

The system operates completely offline using local JSON datasets.

Datasets include:

- businesses.json
- suppliers.json
- professionals.json
- opportunities.json
- interactions.json

The search tool retrieves records from the appropriate dataset depending on the extracted entity type.

---

# Human-in-the-loop

The system never performs external communication automatically.

Instead it:

- Generates outreach drafts
- Waits for approval
- Displays pending actions
- Requires human confirmation before execution

This ensures safe deployment in enterprise procurement environments.