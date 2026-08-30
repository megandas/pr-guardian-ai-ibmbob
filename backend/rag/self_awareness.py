from typing import Dict

# Keywords that usually need project retrieval
PROJECT_KEYWORDS = [
    "project", "authentication", "login", "endpoint",
    "api", "review", "security", "performance",
    "testing", "readme", "prompt", "merge",
    "backend", "agent", "service", "pr"
]

# Questions that don't need retrieval
GENERAL_KEYWORDS = [
    "what is", "explain", "difference between",
    "define", "meaning of", "how does python"
]


def decide_retrieval(question: str) -> Dict:
    q = question.lower()

    # General knowledge question
    if any(keyword in q for keyword in GENERAL_KEYWORDS):
        if not any(keyword in q for keyword in PROJECT_KEYWORDS):
            return {
                "needs_retrieval": False,
                "reason": "General programming knowledge."
            }

    # Project-specific question
    if any(keyword in q for keyword in PROJECT_KEYWORDS):
        return {
            "needs_retrieval": True,
            "reason": "Project-specific question detected."
        }

    # Default
    return {
        "needs_retrieval": True,
        "reason": "Unknown question. Retrieve context for safety."
    }


# Test locally
if __name__ == "__main__":
    questions = [
        "What is SQL Injection?",
        "Where is authentication implemented?",
        "Explain the security prompt.",
        "How does merge recommendation work?"
    ]

    for q in questions:
        result = decide_retrieval(q)
        print(f"\nQuestion: {q}")
        print(result)