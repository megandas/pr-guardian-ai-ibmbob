from rag.self_awareness import decide_retrieval
from rag.retriever import retrieve_context
from services.bob_service import bob_review


def chat_with_bob(question: str):
    """
    Self-Aware RAG + IBM Bob Agent Mode
    """

    # -----------------------------
    # 🧠 Agent 1: Self-Awareness
    # -----------------------------
    decision = decide_retrieval(question)

    retrieved_sources = []
    retrieved_context = ""

    # -----------------------------
    # 📚 Agent 2: Retrieval
    # -----------------------------
    if decision["needs_retrieval"]:
        docs = retrieve_context(question)

        retrieved_sources = [doc["source"] for doc in docs]

        retrieved_context = "\n\n".join(
            f"Source: {doc['source']}\n{doc['content']}"
            for doc in docs
        )

    # -----------------------------
    # 🤖 Agent 3: IBM Bob Aggregator
    # -----------------------------
    prompt = f"""
Context:
{retrieved_context}

Question:
{question}

Answer using the context if relevant.
"""
    answer = bob_review(prompt)
    # Remove accidental prompt leakage if the model echoes instructions.
    for marker in ["IMPORTANT:", "### Your Task", "### User Question", "### Project Context"]:
        if marker in answer:
            answer = answer.split(marker)[0].strip()

    # -----------------------------
    # Pretty Agent Workflow
    # -----------------------------
    workflow = "🤖 IBM Bob Agent Mode Activated\n\n"

    workflow += (
        "🧠 Self-Awareness Agent\n"
        f"• {decision['reason']}\n\n"
    )

    if decision["needs_retrieval"]:
        workflow += "📚 Retrieval Agent\n"

        for src in retrieved_sources:
            workflow += f"• Retrieved: {src}\n"

        workflow += "\n"

    workflow += (
        "🤖 IBM Bob Aggregator\n"
        "• Generated a grounded response using project knowledge.\n\n"
    )

    final_answer = workflow + "----------------------------------------\n\n" + answer

    return {
        "answer": final_answer,
        "retrieval_used": decision["needs_retrieval"],
        "retrieval_reason": decision["reason"],
        "sources": retrieved_sources
    }