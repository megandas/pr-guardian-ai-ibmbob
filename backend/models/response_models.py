from pydantic import BaseModel
from typing import List, Dict, Any

class Issue(BaseModel):
    file: str
    line: int
    severity: str
    category: str
    issue: str
    fix: str

class ReviewResponse(BaseModel):
    review_score: int
    merge_ready: bool
    summary: Dict[str, Any]
    recommendation: str
    issues: List[Issue]
    ai_review: str