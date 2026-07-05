from typing import Dict, Any, List


def validate_suppliers(
    ranked_suppliers: List[Dict[str, Any]],
    requirements: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Validation Engine

    Verifies that ranked suppliers satisfy all
    business constraints before recommendation.

    Future versions may include LLM-assisted
    fact verification and retry logic.
    """

    validated = []
    issues = []

    seen_supplier_ids = set()

    for supplier in ranked_suppliers:

        supplier_issues = []

        supplier_id = supplier.get("id")

        # ---------------------------------
        # Duplicate detection
        # ---------------------------------

        if supplier_id in seen_supplier_ids:
            supplier_issues.append("Duplicate supplier detected.")
        else:
            seen_supplier_ids.add(supplier_id)

        # ---------------------------------
        # Location
        # ---------------------------------

        if (
            requirements.get("location")
            and supplier.get("location") != requirements["location"]
        ):
            supplier_issues.append(
                "Location does not satisfy requirement."
            )

        # ---------------------------------
        # Material
        # ---------------------------------

        materials = supplier.get("materials", [])

        if (
            requirements.get("material")
            and requirements["material"] not in materials
        ):
            supplier_issues.append(
                "Requested material not supplied."
            )

        # ---------------------------------
        # Capacity
        # ---------------------------------

        required_quantity = requirements.get(
            "required_quantity"
        )

        capacity = supplier.get("production_capacity")

        if (
            required_quantity
            and (
                capacity is None
                or capacity < required_quantity
            )
        ):
            supplier_issues.append(
                "Insufficient production capacity."
            )

        # ---------------------------------
        # Availability
        # ---------------------------------

        if supplier.get("availability") != "Available":
            supplier_issues.append(
                "Supplier is currently unavailable."
            )

        # ---------------------------------
        # Required fields
        # ---------------------------------

        if supplier.get("location") is None:
            supplier_issues.append(
                "Missing location."
            )

        if supplier.get("production_capacity") is None:
            supplier_issues.append(
                "Missing production capacity."
            )

        if not supplier.get("materials"):
            supplier_issues.append(
                "Missing materials."
            )

        # ---------------------------------
        # Validation result
        # ---------------------------------

        if supplier_issues:

            issues.append({
                "supplier_id": supplier_id,
                "issues": supplier_issues
            })

        else:

            validated.append(supplier)

    activity = {

        "title": "Validation Engine",

        "status": "Completed",

        "summary": (
            f"Validated {len(validated)} supplier(s). "
            f"{len(issues)} supplier(s) failed validation."
        ),

        "details": {

            "validated_suppliers": len(validated),

            "failed_suppliers": len(issues),

            "checks": [

                "Duplicate Detection",

                "Location",

                "Material",

                "Capacity",

                "Availability",

                "Required Fields"

            ]
        }
    }

    return {

        "validated_suppliers": validated,

        "issues": issues,

        "validation_passed": len(validated) > 0,

        "activity": activity

    }