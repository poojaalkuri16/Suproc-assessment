from typing import Dict, Any, List


def generate_recommendations(
    validated_suppliers: List[Dict[str, Any]],
    requirements: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Recommendation Engine

    Selects the best validated suppliers and
    produces transparent, explainable recommendations.

    Future versions may enhance the explanation
    using an LLM while preserving the structured
    decision factors generated here.
    """

    requested_count = requirements.get("supplier_count", 3)

    recommended_suppliers = []

    for rank, supplier in enumerate(
        validated_suppliers[:requested_count],
        start=1
    ):

        decision_factors = []

        # -------------------------
        # Material
        # -------------------------

        if requirements["material"] in supplier.get("materials", []):
            decision_factors.append(
                f"Supplies {requirements['material']}"
            )

        # -------------------------
        # Location
        # -------------------------

        decision_factors.append(
            f"Located in {supplier['location']}"
        )

        # -------------------------
        # Capacity
        # -------------------------

        decision_factors.append(
            f"Production capacity of "
            f"{supplier['production_capacity']:,} units"
        )

        # -------------------------
        # Availability
        # -------------------------

        if supplier["availability"] == "Available":
            decision_factors.append(
                "Currently available for procurement"
            )

        # -------------------------
        # Certifications
        # -------------------------

        if supplier.get("certifications"):

            decision_factors.append(
                "Certified: "
                + ", ".join(
                    supplier["certifications"]
                )
            )

        # -------------------------
        # Rating
        # -------------------------

        decision_factors.append(
            f"Supplier rating {supplier['rating']}/5"
        )

        # -------------------------
        # Confidence
        # -------------------------

        score = supplier["match_score"]

        if score >= 90:
            confidence = "High"

        elif score >= 75:
            confidence = "Medium"

        else:
            confidence = "Low"

        recommendation_reason = (
            f"Selected because the supplier satisfies the "
            f"required material, location and production "
            f"constraints while achieving a match score "
            f"of {score}/100."
        )

        recommended_suppliers.append(
            {

                "rank": rank,

                "supplier_id": supplier["id"],

                "company_name": supplier["company_name"],

                "match_score": score,

                "confidence": confidence,

                "recommendation_reason":
                    recommendation_reason,

                "decision_factors":
                    decision_factors,

                "score_breakdown":
                    supplier["score_breakdown"],

                "evidence":
                    supplier["evidence"],

                "supplier_details":
                    supplier

            }
        )

    activity = {

        "title": "Recommendation Engine",

        "status": "Completed",

        "summary": (
            f"Selected {len(recommended_suppliers)} "
            f"recommended supplier(s)."
        ),

        "details": {

            "requested_suppliers":
                requested_count,

            "recommended_suppliers":
                len(recommended_suppliers),

            "remaining_valid_suppliers":
                max(
                    len(validated_suppliers)
                    - len(recommended_suppliers),
                    0
                )

        }
    }

    return {

        "recommended_suppliers":
            recommended_suppliers,

        "recommendation_summary": {

            "requested_suppliers":
                requested_count,

            "recommended_suppliers":
                len(recommended_suppliers),

            "remaining_valid_suppliers":
                max(
                    len(validated_suppliers)
                    - len(recommended_suppliers),
                    0
                )

        },

        "activity":
            activity

    }