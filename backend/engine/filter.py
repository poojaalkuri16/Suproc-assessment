from typing import Dict, Any


def filter_suppliers(
    candidates: list,
    requirements: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Apply deterministic business constraints.

    Version 1:
    Simple rule-based filtering.

    Future:
    This module will become the Explainable Constraint Engine
    powered by the LLM.
    """

    filtered = []

    for supplier in candidates:

        # -------------------------
        # Location
        # -------------------------

        if (
            requirements["location"]
            and supplier.get("location") != requirements["location"]
        ):
            continue

        # -------------------------
        # Material
        # -------------------------

        if requirements["material"]:
            supplier_materials = supplier.get("materials", [])

            if requirements["material"] not in supplier_materials:
                continue

        # -------------------------
        # Production Capacity
        # -------------------------

        if (
            requirements["required_quantity"]
            and supplier.get("production_capacity", 0)
            < requirements["required_quantity"]
        ):
            continue

        filtered.append(supplier)

    activity = {
        "title": "Constraint Filtering",
        "status": "Completed",
        "summary": (
            f"Filtered {len(candidates)} suppliers down to "
            f"{len(filtered)} matching candidates."
        ),
        "details": {
            "initial_candidates": len(candidates),
            "remaining_candidates": len(filtered),
            "applied_constraints": requirements["hard_constraints"]
        }
    }

    return {
        "filtered_suppliers": filtered,
        "activity": activity
    }