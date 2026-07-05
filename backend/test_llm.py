from services.llm import extract_requirements_llm


query = (
    "Find 3 food-grade plastic suppliers in Bengaluru "
    "capable of supplying 10000 units by Q4 2024"
)

result = extract_requirements_llm(query)

print(result)