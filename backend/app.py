from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.request_models import ReviewRequest, ChatRequest
from models.response_models import ReviewResponse, Issue

from utils.parser import extract_added_lines
from agents.security import security_review
from services.review_service import run_review
from services.chat_service import chat_with_bob

app = FastAPI(
    title="PR Guardian AI",
    description="AI-powered Pull Request Reviewer using IBM Bob",
    version="1.0.0",
)

# Allow VS Code extension to connect to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "PR Guardian AI Backend is Running 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/review", response_model=ReviewResponse)
def review_pr(request: ReviewRequest):

    # Existing AI review from IBM Granite
    (
        score,
        merge_ready,
        issues,
        summary,
        recommendation,
        bob_review_text,
    ) = run_review(request.diff)

    # ------------------------------
    # Demo Pull Request Information
    # ------------------------------

    summary = {
        "pr_number": 27,
        "files_changed": 3,
        "high_issues": 2,
        "passed_checks": 41,
    }

    recommendation = "Changes Requested"

    bob_review_text = f"""
PR GUARDIAN AI — IBM GRANITE REVIEW

Reviewing PR #27
Title: Add Replay AI Review & Interactive Code Impact Map

Repository: PR Guardian AI
Author: Megan Das, Sakshi Kumar, Harsh Kumar
Branch: feature/replay-ai-review

Files Reviewed:
• src/architectureView.ts
• src/extension.ts
• package.json

Repository Summary:
This pull request introduces Replay AI Review and the Interactive Code Impact Map inside the Repository Intelligence Dashboard.

Key Findings:
• Replay AI Review successfully visualizes IBM Granite reasoning.
• Code Impact Map improves repository architecture exploration.
• VS Code Extension communicates correctly with the FastAPI backend.

Suggestions:
1. Split architectureView.ts into reusable UI components.
2. Separate replay animation state from dashboard state.
3. Move animation timing values into constants for maintainability.

Overall Recommendation:
{recommendation}

PR Health Score: {score}/100
"""

    return ReviewResponse(
        review_score=score,
        merge_ready=merge_ready,
        summary=summary,
        recommendation=recommendation,
        issues=issues,
        ai_review=bob_review_text,
    )


@app.post("/chat")
def chat_with_bob_endpoint(request: ChatRequest):

    result = chat_with_bob(request.question)

    return {
        "answer": result["answer"],
        "retrieval_used": result["retrieval_used"],
        "retrieval_reason": result["retrieval_reason"],
        "sources": result["sources"],
    }