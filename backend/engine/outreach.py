from typing import Dict, Any, List


def generate_outreach(
    recommended_suppliers: List[Dict[str, Any]],
    requirements: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Outreach Engine

    Generates outreach drafts only.
    Nothing is sent automatically.
    Human approval is always required.
    """

    material = requirements.get("material") or "your products/services"
    quantity = requirements.get("required_quantity")
    deadline = requirements.get("deadline")
    location = requirements.get("location")

    drafts = []

    for supplier in recommended_suppliers:

        details = supplier["supplier_details"]

        subject = f"Procurement Enquiry - {material}"

        body = []

        body.append(f"Dear {details['company_name']} Team,")
        body.append("")
        body.append(
            "We are currently evaluating suppliers for an upcoming procurement requirement."
        )
        body.append("")

        body.append("Requirement Summary:")

        if quantity is not None:
            body.append(f"• Quantity: {quantity:,} units")

        if material:
            body.append(f"• Product / Service: {material}")

        if location:
            body.append(f"• Preferred Location: {location}")

        if deadline:
            body.append(f"• Delivery Timeline: {deadline}")

        body.append("")
        body.append(
            "Based on our evaluation, your organisation has been shortlisted."
        )
        body.append("")
        body.append("Could you please provide:")
        body.append("• Current pricing")
        body.append("• Lead time")
        body.append("• Production capacity")
        body.append("• Relevant certifications")
        body.append("")
        body.append("We look forward to hearing from you.")
        body.append("")
        body.append("Regards,")
        body.append("Procurement Team")

        drafts.append(
            {
                "supplier_id": details.get("id"),
                "company_name": details.get("company_name"),
                "email": details.get("email"),
                "phone": details.get("phone"),
                "subject": subject,
                "message": "\n".join(body),
                "status": "Draft",
                "human_approval_required": True,
            }
        )

    activity = {
        "title": "Outreach Engine",
        "status": "Completed",
        "summary": f"Prepared {len(drafts)} outreach draft(s).",
        "details": {
            "drafts_created": len(drafts),
            "delivery_method": "Email Draft",
            "human_approval_required": True,
        },
    }

    return {
        "outreach_drafts": drafts,
        "activity": activity,
    }