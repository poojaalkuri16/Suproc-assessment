from engine.extractor import extract_requirements
from engine.planner import create_execution_plan
from engine.search import search_suppliers
from engine.filter import filter_suppliers
from engine.ranking import rank_suppliers
from engine.validator import validate_suppliers
from engine.recommendation import generate_recommendations
from engine.outreach import generate_outreach
from engine.approval import prepare_human_approval
from engine.retry import evaluate_retry


def run_agent(query: str):
    """
    Main AI Procurement Agent Orchestrator.
    """

    print("\n========== ORCHESTRATOR ==========\n")

    # Stage 1
    print("Stage 1 - Requirement Extraction")
    extraction_result = extract_requirements(query)
    print("✓ Stage 1 complete")

    # Stage 2
    print("Stage 2 - Planning")
    planning_result = create_execution_plan(
        extraction_result["requirements"]
    )
    print("✓ Stage 2 complete")

    # Stage 3
    print("Stage 3 - Search")
    search_result = search_suppliers(
        extraction_result["requirements"]
    )
    print("✓ Stage 3 complete")

    # Stage 4
    print("Stage 4 - Filtering")
    filter_result = filter_suppliers(
        search_result["candidates"],
        extraction_result["requirements"]
    )
    print("✓ Stage 4 complete")

    # Stage 5
    print("Stage 5 - Ranking")
    ranking_result = rank_suppliers(
        filter_result["filtered_suppliers"],
        extraction_result["requirements"]
    )
    print("✓ Stage 5 complete")

    # Stage 6
    print("Stage 6 - Validation")
    validation_result = validate_suppliers(
        ranking_result["ranked_suppliers"],
        extraction_result["requirements"]
    )
    print("✓ Stage 6 complete")

    # Stage 7
    print("Stage 7 - Recommendation")
    recommendation_result = generate_recommendations(
        validation_result["validated_suppliers"],
        extraction_result["requirements"]
    )
    print("✓ Stage 7 complete")

    # Stage 8
    print("Stage 8 - Retry Evaluation")
    retry_result = evaluate_retry(
        requested_suppliers=extraction_result["requirements"].get("supplier_count", 0) or 0,
        recommended_suppliers=recommendation_result["recommendation_summary"]["recommended_suppliers"],
        current_attempt=1
    )
    print("✓ Stage 8 complete")

    # Stage 9
    print("Stage 9 - Outreach")
    outreach_result = generate_outreach(
        recommendation_result["recommended_suppliers"],
        extraction_result["requirements"]
    )
    print("✓ Stage 9 complete")

    # Stage 10
    print("Stage 10 - Human Approval")
    approval_result = prepare_human_approval(
        outreach_result["outreach_drafts"]
    )
    print("✓ Stage 10 complete")

    print("Returning final response...\n")

    return {

        "status": "completed",

        "mission": query,

        "activities": [

            extraction_result["activity"],

            planning_result["activity"],

            search_result["activity"],

            filter_result["activity"],

            ranking_result["activity"],

            validation_result["activity"],

            recommendation_result["activity"],

            retry_result["activity"],

            outreach_result["activity"],

            approval_result["activity"]

        ],

        "requirements":
            extraction_result["requirements"],

        "plan":
            planning_result["plan"],

        "recommended_suppliers":
            recommendation_result["recommended_suppliers"],

        "recommendation_summary":
            recommendation_result["recommendation_summary"],

        "retry": {
            "retry_required": retry_result["retry_required"],
            "attempt": retry_result["attempt"],
            "maximum_attempts": retry_result["maximum_attempts"]
        },

        "outreach_drafts":
            outreach_result["outreach_drafts"],

        "approval":
            {
                "approval_status":
                    approval_result["approval_status"],

                "human_approval_required":
                    approval_result["human_approval_required"],

                "recommended_action":
                    approval_result["recommended_action"],

                "pending_actions":
                    approval_result["pending_actions"],

                "external_actions_executed":
                    approval_result["external_actions_executed"]
            },

        "validation_passed":
            validation_result["validation_passed"],

        "validation_issues":
            validation_result["issues"]

    }