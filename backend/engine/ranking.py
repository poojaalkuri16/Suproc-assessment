from typing import Dict, Any, List


def rank_suppliers(
    candidates: List[Dict[str, Any]],
    requirements: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Ranking Engine

    Scores every supplier using deterministic business rules.

    The score is transparent and fully explainable.

    Total Score = 100

        Material Match      -> 30
        Location Match      -> 20
        Capacity Match      -> 20
        Availability        -> 10
        Certifications      -> 10
        Supplier Rating     -> 10

    Future versions may replace or augment this
    scoring with an LLM-based reasoning model,
    while keeping this interface unchanged.
    """

    ranked_suppliers = []

    for supplier in candidates:

        score = 0
        breakdown = {}
        evidence = []

        # -----------------------------------
        # Material Match (30)
        # -----------------------------------

        material_score = 0

        if requirements.get("material"):

            supplier_materials = supplier.get("materials", [])

            if requirements["material"] in supplier_materials:
                material_score = 30
                evidence.append(
                    f"Supplies {requirements['material']}"
                )

        score += material_score
        breakdown["material"] = material_score

        # -----------------------------------
        # Location Match (20)
        # -----------------------------------

        location_score = 0

        if (
            requirements.get("location")
            and supplier.get("location") == requirements["location"]
        ):
            location_score = 20
            evidence.append(
                f"Located in {supplier['location']}"
            )

        score += location_score
        breakdown["location"] = location_score

        # -----------------------------------
        # Capacity Match (20)
        # -----------------------------------

        capacity_score = 0

        required_qty = requirements.get("required_quantity")
        supplier_capacity = supplier.get("production_capacity")

        if (
            required_qty
            and supplier_capacity
            and supplier_capacity >= required_qty
        ):
            capacity_score = 20
            evidence.append(
                f"Capacity: {supplier_capacity:,} units"
            )

        score += capacity_score
        breakdown["capacity"] = capacity_score

        # -----------------------------------
        # Availability (10)
        # -----------------------------------

        availability_score = 0

        if supplier.get("availability") == "Available":
            availability_score = 10
            evidence.append(
                "Currently available"
            )

        score += availability_score
        breakdown["availability"] = availability_score

        # -----------------------------------
        # Certifications (10)
        # -----------------------------------

        certification_score = 0

        certifications = supplier.get("certifications", [])

        if certifications:

            if "ISO 22000" in certifications:
                certification_score = 10

            elif "ISO 9001" in certifications:
                certification_score = 7

            evidence.append(
                f"Certifications: {', '.join(certifications)}"
            )

        score += certification_score
        breakdown["certifications"] = certification_score

        # -----------------------------------
        # Supplier Rating (10)
        # -----------------------------------

        rating_score = 0

        rating = supplier.get("rating", 0)

        if rating >= 4.8:
            rating_score = 10

        elif rating >= 4.5:
            rating_score = 8

        elif rating >= 4.0:
            rating_score = 6

        elif rating >= 3.5:
            rating_score = 4

        score += rating_score
        breakdown["rating"] = rating_score

        # -----------------------------------
        # Final ranked supplier
        # -----------------------------------

        ranked_suppliers.append(
            {
                **supplier,
                "match_score": score,
                "score_breakdown": breakdown,
                "evidence": evidence
            }
        )

    # -----------------------------------
    # Sort highest score first
    # -----------------------------------

    ranked_suppliers.sort(
        key=lambda supplier: supplier["match_score"],
        reverse=True
    )

    activity = {
        "title": "Ranking Engine",
        "status": "Completed",
        "summary": (
            f"Ranked {len(ranked_suppliers)} supplier(s) "
            "using deterministic scoring."
        ),
        "details": {
            "ranking_method": "Weighted Rule-Based Scoring",
            "maximum_score": 100,
            "criteria": {
                "material": 30,
                "location": 20,
                "capacity": 20,
                "availability": 10,
                "certifications": 10,
                "rating": 10
            }
        }
    }

    return {
        "ranked_suppliers": ranked_suppliers,
        "activity": activity
    }