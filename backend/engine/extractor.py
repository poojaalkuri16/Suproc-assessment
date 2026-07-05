import re
from typing import Dict, Any

from services.llm import extract_requirements_llm

USE_LLM = True


def deterministic_extract(query: str):
    """
    Deterministic extractor.

    Used whenever the LLM times out or fails.

    This extractor intentionally supports only
    rule-based extraction and never invents values.
    """

    requirements = {
        "original_query": query,

        "objective": "Find Suppliers",

        "entity_type": "Supplier",

        "supplier_count": None,

        "location": None,

        "material": None,

        "required_quantity": None,

        "deadline": None,

        # NEW OPTIONAL FIELDS
        "required_certification": None,

        "minimum_capacity": None,

        "delivery_days": None,

        "hard_constraints": [],

        "optional_preferences": []
    }

    # -------------------------
    # Supplier Count
    # -------------------------

    supplier_count_match = re.search(
        r"(\d[\d,]*)\s+(?:\w+(?:-\w+)?\s+)*suppliers?",
        query,
        re.IGNORECASE,
    )

    if supplier_count_match:
        supplier_count = int(
            supplier_count_match.group(1).replace(",", "")
        )

        requirements["supplier_count"] = supplier_count

        requirements["hard_constraints"].append(
            f"Supplier Count: {supplier_count}"
        )

    # -------------------------
    # Quantity
    # -------------------------

    quantity_match = re.search(
        r"(\d[\d,]*)\s*units?",
        query,
        re.IGNORECASE,
    )

    if quantity_match:

        quantity = int(
            quantity_match.group(1).replace(",", "")
        )

        requirements["required_quantity"] = quantity

        requirements["hard_constraints"].append(
            f"Required Quantity: {quantity}"
        )

    # -------------------------
    # Deadline
    # -------------------------

    deadline_match = re.search(
        r"Q[1-4]\s*\d{4}",
        query,
        re.IGNORECASE
    )

    if deadline_match:

        deadline = deadline_match.group(0)

        requirements["deadline"] = deadline

        requirements["hard_constraints"].append(
            f"Delivery Deadline: {deadline}"
        )

    # -------------------------
    # Location
    # -------------------------

    cities = [
        "Bengaluru",
        "Mumbai",
        "Delhi",
        "Chennai",
        "Hyderabad",
        "Pune"
    ]

    for city in cities:

        if city.lower() in query.lower():

            requirements["location"] = city

            requirements["hard_constraints"].append(
                f"Location: {city}"
            )

            break

    # -------------------------
    # Material
    # -------------------------

    materials = [
        "food-grade plastic",
        "plastic",
        "steel",
        "aluminium",
        "electronics"
    ]

    for material in materials:

        if material.lower() in query.lower():

            requirements["material"] = material

            requirements["hard_constraints"].append(
                f"Material: {material}"
            )

            break

        # -------------------------
    # Entity Type
    # -------------------------

    q = query.lower()

    if any(word in q for word in [
        "consultant",
        "professional",
        "buyer",
        "manager",
        "engineer",
        "procurement consultant"
    ]):

        requirements["entity_type"] = "Professional"
        requirements["objective"] = "Find Professionals"

    elif any(word in q for word in [
        "business",
        "company",
        "organisation",
        "organization",
        "enterprise"
    ]):

        requirements["entity_type"] = "Business"
        requirements["objective"] = "Find Businesses"

    elif any(word in q for word in [
        "opportunity",
        "tender",
        "rfp",
        "contract"
    ]):

        requirements["entity_type"] = "Opportunity"
        requirements["objective"] = "Find Opportunities"

    else:

        requirements["entity_type"] = "Supplier"
        requirements["objective"] = "Find Suppliers"

    # -------------------------
    # Certification
    # -------------------------

    certifications = [
        "ISO 9001",
        "ISO 14001",
        "GMP",
        "FDA",
        "CE"
    ]

    for cert in certifications:

        if cert.lower() in q:

            requirements["required_certification"] = cert

            requirements["hard_constraints"].append(
                f"Certification: {cert}"
            )

            break

    # -------------------------
    # Minimum Capacity
    # -------------------------

    capacity_match = re.search(
        r"(\\d[\\d,]*)\\+?\\s*(?:unit\\s*)?capacity",
        query,
        re.IGNORECASE,
    )

    if capacity_match:

        capacity = int(
            capacity_match.group(1).replace(",", "")
        )

        requirements["minimum_capacity"] = capacity

        requirements["hard_constraints"].append(
            f"Minimum Capacity: {capacity}"
        )

    # -------------------------
    # Delivery Days
    # -------------------------

    delivery_match = re.search(
        r"(?:within|in)?\\s*(\\d+)\\s*-?\\s*day",
        query,
        re.IGNORECASE,
    )

    if delivery_match:

        days = int(delivery_match.group(1))

        requirements["delivery_days"] = days

        requirements["hard_constraints"].append(
            f"Delivery: {days} days"
        )
        
    return requirements


def build_activity(requirements: Dict[str, Any]) -> Dict[str, Any]:

    return {
        "title": "Requirement Extraction",
        "status": "Completed",
        "summary": (
            "Converted the natural language request "
            "into structured business requirements."
        ),
        "details": {
            "objective": requirements["objective"],
            "entity_type": requirements["entity_type"],
            "location": requirements["location"],
            "supplier_count": requirements["supplier_count"],
            "required_quantity": requirements["required_quantity"],
            "material": requirements["material"],
            "deadline": requirements["deadline"],

            "required_certification":
                requirements.get("required_certification"),

            "minimum_capacity":
                requirements.get("minimum_capacity"),

            "delivery_days":
                requirements.get("delivery_days"),

            "hard_constraints": requirements["hard_constraints"],
            "optional_preferences": requirements["optional_preferences"]
        }
    }


def extract_requirements(query: str) -> Dict[str, Any]:
    """
    Primary extraction method.

    1. Try Qwen3.
    2. If anything fails,
       use deterministic extraction.
    """

    # -------------------------
    # LLM FIRST
    # -------------------------

    if USE_LLM:

        try:

            llm_output = extract_requirements_llm(query)

            requirements = {
                "original_query": query,
                "objective": llm_output.get(
                    "objective",
                    "Find Suppliers"
                ),
                "entity_type": llm_output.get(
                    "entity_type",
                    "Supplier"
                ),
                "supplier_count": llm_output.get(
                    "supplier_count"
                ),
                "location": llm_output.get(
                    "location"
                ),
                "material": llm_output.get(
                    "material"
                ),
                "required_quantity": llm_output.get(
                    "required_quantity"
                ),

                "deadline": llm_output.get(
                    "deadline"
                ),

                "required_certification": llm_output.get(
                    "required_certification"
                ),

                "minimum_capacity": llm_output.get(
                    "minimum_capacity"
                ),

                "delivery_days": llm_output.get(
                    "delivery_days"
                ),
                "hard_constraints": [],
                "optional_preferences": llm_output.get(
                    "optional_preferences",
                    []
                )
            }

            # Rebuild hard constraints

            if requirements["supplier_count"]:
                requirements["hard_constraints"].append(
                    f"Supplier Count: {requirements['supplier_count']}"
                )

            if requirements["required_quantity"]:
                requirements["hard_constraints"].append(
                    f"Required Quantity: {requirements['required_quantity']}"
                )

            if requirements["location"]:
                requirements["hard_constraints"].append(
                    f"Location: {requirements['location']}"
                )

            if requirements["material"]:
                requirements["hard_constraints"].append(
                    f"Material: {requirements['material']}"
                )

            if requirements["deadline"]:
                requirements["hard_constraints"].append(
                    f"Delivery Deadline: {requirements['deadline']}"
                )
            if requirements.get("required_certification"):

                requirements["hard_constraints"].append(
                    f"Certification: {requirements['required_certification']}"
                )

            if requirements.get("minimum_capacity"):

                requirements["hard_constraints"].append(
                    f"Minimum Capacity: {requirements['minimum_capacity']}"
                )

            if requirements.get("delivery_days"):

                requirements["hard_constraints"].append(
                    f"Delivery: {requirements['delivery_days']} days"
                )
            return {
                "requirements": requirements,
                "activity": build_activity(requirements),
                "extraction_metadata": {
                    "method": "LLM",
                    "model": "qwen3:4b"
                }
            }

        except Exception as e:

            requirements = deterministic_extract(query)

            return {
                "requirements": requirements,
                "activity": build_activity(requirements),
                "extraction_metadata": {
                    "method": "Deterministic Fallback",
                    "reason": str(e)
                }
            }

    # -------------------------
    # Deterministic Only
    # -------------------------

    requirements = deterministic_extract(query)

    return {
        "requirements": requirements,
        "activity": build_activity(requirements),
        "extraction_metadata": {
            "method": "Deterministic"
        }
    }