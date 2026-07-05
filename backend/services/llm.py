import json
from typing import Dict, Any

import requests

MODEL = "qwen3:4b"

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

# Wait up to 15 seconds before falling back
REQUEST_TIMEOUT = 15


SYSTEM_PROMPT = """
You are an AI Procurement Agent.

Your job is to understand procurement requests and convert them into structured JSON.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT explain your reasoning.

Do NOT include any extra text.

Use EXACTLY this schema:

{
    "objective": "",
    "entity_type": "",
    "supplier_count": 0,
    "location": "",
    "material": "",
    "required_quantity": 0,
    "deadline": "",
    "required_certification": "",
    "minimum_capacity": 0,
    "delivery_days": 0,
    "optional_preferences": []
}

Rules:

objective:
A short procurement objective.

Examples:
"Find Suppliers"
"Find Businesses"
"Find Professionals"
"Find Opportunities"

entity_type MUST be exactly ONE of:

Supplier
Business
Professional
Opportunity

Map user intent:

supplier
vendor
manufacturer
factory
producer

-> Supplier

business
company
organization
enterprise

-> Business

consultant
professional
manager
engineer
buyer
procurement consultant

-> Professional

opportunity
tender
rfp
contract

-> Opportunity

supplier_count:
Return integer.

If missing:
0

location:
Return only the requested city/location.

material:
Return only the requested product/service.

Examples:

food-grade plastic

electronics

steel

pharmaceutical packaging

logistics

required_quantity:
Return integer only.

If missing:
0

deadline:

Examples:

Q4 2024

Next Quarter

March 2026

delivery_days:

Extract values like

30-day delivery

within 15 days

deliver in 45 days

Return only the number.

required_certification:

Examples:

ISO 9001

ISO 14001

GMP

FDA

CE

minimum_capacity:

Extract phrases like

5000+ unit capacity

minimum capacity 10000

capacity above 25000

Return only the number.

optional_preferences:

Always an array.

Never invent values.

If information is absent:

Return:

0

or

""

or

[]

Return ONLY JSON.
"""


def extract_requirements_llm(
    query: str
) -> Dict[str, Any]:

    print("=" * 60)
    print("Attempting Qwen3 requirement extraction...")
    print("=" * 60)

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "stream": False,
            "messages": [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": query,
                },
            ],
        },
        timeout=REQUEST_TIMEOUT,
    )

    response.raise_for_status()

    content = response.json()["message"]["content"].strip()

    if content.startswith("```"):

        lines = content.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]

        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]

        content = "\n".join(lines).strip()

    print("Qwen extraction successful.")

    parsed = json.loads(content)

    parsed.setdefault("objective", "Find Suppliers")
    parsed.setdefault("entity_type", "Supplier")
    parsed.setdefault("supplier_count", 0)
    parsed.setdefault("location", "")
    parsed.setdefault("material", "")
    parsed.setdefault("required_quantity", 0)
    parsed.setdefault("deadline", "")
    parsed.setdefault("required_certification", "")
    parsed.setdefault("minimum_capacity", 0)
    parsed.setdefault("delivery_days", 0)
    parsed.setdefault("optional_preferences", [])

    return parsed