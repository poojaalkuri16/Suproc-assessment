from typing import Dict, Any, List


def prepare_human_approval(
    outreach_drafts: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Human Approval Engine

    Stops the workflow before any external
    communication is performed.

    No procurement emails are sent.

    Human approval is mandatory.
    """

    pending_actions = []

    for draft in outreach_drafts:

        pending_actions.append(
            {
                "supplier_id": draft["supplier_id"],
                "company_name": draft["company_name"],
                "action": (
                    "Send procurement enquiry email"
                ),
                "status": "Pending Approval"
            }
        )

    activity = {

        "title": "Human Approval",

        "status": "Awaiting Approval",

        "summary": (
            "Workflow paused pending human approval."
        ),

        "details": {

            "approval_required": True,

            "pending_actions":
                len(pending_actions),

            "external_actions_executed":
                0

        }

    }

    return {

        "approval_status":
            "Awaiting Human Approval",

        "human_approval_required":
            True,

        "recommended_action": (
            "Review the recommended suppliers and "
            "approve the outreach drafts before "
            "contacting suppliers."
        ),

        "pending_actions":
            pending_actions,

        "external_actions_executed":
            0,

        "activity":
            activity

    }