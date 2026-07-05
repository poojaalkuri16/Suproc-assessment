from typing import Dict, Any

from services.dataset import search_entities


def search_suppliers(requirements: Dict[str, Any]) -> Dict[str, Any]:
    """
    Search Engine

    Purpose:
    Uses the search_entities() tool to retrieve candidate suppliers
    from the local dataset.

    This module is responsible for orchestrating the search,
    not reading the dataset directly.
    """

    candidates = search_entities(
        requirements["entity_type"]
    )

    activity = {
        "title": "Search Engine",
        "status": "Completed",
        "summary": f"Retrieved {len(candidates)} candidate supplier(s) using the search_entities tool.",
        "details": {
            "tool_used": "search_entities",
            "searched_entity": requirements["entity_type"],
            "candidate_count": len(candidates),
            "dataset": "businesses.json"
        }
    }

    return {
        "candidates": candidates,
        "activity": activity
    }