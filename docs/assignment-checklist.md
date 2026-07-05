# 🔄 AI Agent Workflow

## Overview

The agent executes a structured pipeline consisting of multiple reasoning stages.

Each stage produces explainable outputs before moving to the next stage.

---

# Workflow

```
User Request
      │
      ▼
Requirement Extraction
      │
      ▼
Planning Engine
      │
      ▼
Search Engine
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

# Stage 1 – Requirement Extraction

Purpose:

Convert natural language into structured procurement requirements.

Outputs:

- Entity Type
- Location
- Material
- Quantity
- Deadline
- Constraints

---

# Stage 2 – Planning

The planner determines:

- which dataset to search
- search strategy
- execution order

---

# Stage 3 – Search

The Search Engine retrieves matching entities from local datasets.

Supported datasets include:

- Businesses
- Suppliers
- Professionals
- Opportunities

---

# Stage 4 – Constraint Filtering

Hard constraints are applied including:

- Location
- Material
- Certifications
- Capacity
- Delivery timeline

---

# Stage 5 – Ranking

Candidate entities are ranked using multiple business attributes including:

- Product relevance
- Capacity
- Certifications
- Location match
- Reputation

---

# Stage 6 – Validation

The Validation Engine verifies:

- Recommendation quality
- Constraint satisfaction
- Completeness

---

# Stage 7 – Retry Evaluation

If recommendations do not satisfy minimum criteria, the Retry Engine determines whether another search attempt should be made.

---

# Stage 8 – Recommendation

The Recommendation Engine prepares:

- Ranked candidates
- Match scores
- Summary

---

# Stage 9 – Outreach Draft

The Outreach Engine generates procurement enquiry drafts for shortlisted candidates.

No messages are automatically sent.

---

# Stage 10 – Human Approval

Before any external communication:

- User reviews recommendations
- User reviews outreach draft
- User approves

Only after approval can outreach proceed.

---

# Explainability

Every stage records:

- Tool used
- Runtime
- Input
- Output
- Status

These logs are displayed in the Agent Execution page.