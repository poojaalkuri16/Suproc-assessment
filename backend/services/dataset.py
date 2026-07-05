import json
from pathlib import Path
from typing import List, Dict, Any


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


# =====================================================
# Generic Loader
# =====================================================

def load_json(filename: str) -> List[Dict[str, Any]]:
    """
    Generic JSON loader.

    Every dataset in /data should be loaded
    through this function.
    """

    dataset_path = DATA_DIR / filename

    with open(dataset_path, "r", encoding="utf-8") as file:
        return json.load(file)


# =====================================================
# Dataset Loaders
# =====================================================

def load_businesses() -> List[Dict[str, Any]]:
    return load_json("businesses.json")


def load_suppliers() -> List[Dict[str, Any]]:
    return load_json("suppliers.json")


def load_professionals() -> List[Dict[str, Any]]:
    return load_json("professionals.json")


def load_opportunities() -> List[Dict[str, Any]]:
    return load_json("opportunities.json")


def load_interactions() -> List[Dict[str, Any]]:
    return load_json("interactions.json")


# =====================================================
# Search Tool
# =====================================================

def search_entities(entity_type: str) -> List[Dict[str, Any]]:
    """
    Generic search tool.

    Version 1:
    Returns all records of the requested entity.

    Future:
    This function will become semantic search using
    embeddings + Qwen3 while keeping the same interface.
    """

    entity_type = entity_type.strip().lower()

    mapping = {
        "supplier": load_businesses,
        "business": load_businesses,
        "professional": load_professionals,
        "opportunity": load_opportunities,
        "interaction": load_interactions,
    }

    loader = mapping.get(entity_type)

    if loader is None:
        return []

    return loader()