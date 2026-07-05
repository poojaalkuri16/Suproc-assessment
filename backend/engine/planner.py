from typing import Dict, Any


def create_execution_plan(requirements: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates the execution strategy for the AI agent.

    This module decides HOW the agent will solve the request.
    It does not execute any searches or ranking.
    """

    plan = {
        "execution_strategy": [
            "Search supplier dataset",
            "Apply hard constraints",
            "Rank matching suppliers",
            "Validate recommendations",
            "Generate outreach draft",
            "Await human approval"
        ],
        "estimated_steps": 6,
        "entity": requirements["entity_type"],
        "objective": requirements["objective"]
    }

    activity = {
        "title": "Planning Engine",
        "status": "Completed",
        "summary": "Generated an execution strategy for fulfilling the request.",
        "details": {
            "objective": plan["objective"],
            "entity": plan["entity"],
            "execution_strategy": plan["execution_strategy"],
            "estimated_steps": plan["estimated_steps"]
        }
    }

    return {
        "plan": plan,
        "activity": activity
    }