from models.database import get_db
from bson import ObjectId

CRITERIA = [
    "originality", "presentation_clarity", "financial_analysis",
    "marketing_strategies", "ai_integration", "sdgs_alignment", "scalability"
]

def create_score(judge_id, team_id, data):
    existing = get_db().scores.find_one({
        "judge_id": ObjectId(judge_id),
        "team_id": ObjectId(team_id),
        "status": "submitted"
    })
    if existing:
        return None

    scores = {c: data[c] for c in CRITERIA}
    total = sum(scores.values())

    score_doc = {
        "judge_id": ObjectId(judge_id),
        "team_id": ObjectId(team_id),
        **scores,
        "comments": data.get("comments", ""),
        "total_score": total,
        "status": data.get("status", "submitted")
    }
    return get_db().scores.insert_one(score_doc)

def get_scores_by_judge(judge_id):
    return list(get_db().scores.find({"judge_id": ObjectId(judge_id)}))

def get_scores_by_team(team_id):
    return list(get_db().scores.find({"team_id": ObjectId(team_id), "status": "submitted"}))

def get_all_scores():
    return list(get_db().scores.find({"status": "submitted"}))