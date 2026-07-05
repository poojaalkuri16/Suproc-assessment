from typing import Dict, Any


MAX_RETRIES = 3


def evaluate_retry(
    requested_suppliers: int,
    recommended_suppliers: int,
    current_attempt: int
) -> Dict[str, Any]:
    """
    Retry Engine

    Determines whether the procurement workflow
    should be retried.

    Business constraints are never modified.

    Maximum retry attempts: 3
    """

    should_retry = (
        recommended_suppliers < requested_suppliers
        and current_attempt < MAX_RETRIES
    )

    if should_retry:

        status = "Retry Required"

        reason = (
            f"Only {recommended_suppliers} supplier(s) "
            f"were recommended while "
            f"{requested_suppliers} were requested."
        )

    else:

        status = "Completed"

        if recommended_suppliers >= requested_suppliers:

            reason = (
                "Requested number of suppliers "
                "successfully identified."
            )

        else:

            reason = (
                "Maximum retry attempts reached."
            )

    activity = {

        "title": "Retry Engine",

        "status": status,

        "summary": reason,

        "details": {

            "attempt":
                current_attempt,

            "maximum_attempts":
                MAX_RETRIES,

            "requested_suppliers":
                requested_suppliers,

            "recommended_suppliers":
                recommended_suppliers,

            "retry_required":
                should_retry

        }

    }

    return {

        "retry_required":
            should_retry,

        "attempt":
            current_attempt,

        "maximum_attempts":
            MAX_RETRIES,

        "activity":
            activity

    }