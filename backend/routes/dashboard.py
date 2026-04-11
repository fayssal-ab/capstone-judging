from flask import Blueprint, jsonify
from models.team import get_all_teams
from models.score import get_all_scores
from models.user import get_all_judges
from middleware.auth_middleware import admin_required

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("", methods=["GET"])
@admin_required
def stats():
    teams = get_all_teams()
    scores = get_all_scores()
    judges = get_all_judges()

    total_teams = len(teams)
    total_judges = len(judges)
    total_expected = total_teams * total_judges
    total_submitted = len(scores)

    missing = []
    for team in teams:
        team_id = str(team["_id"])
        judge_ids_submitted = [str(s["judge_id"]) for s in scores if str(s["team_id"]) == team_id]
        for judge in judges:
            if str(judge["_id"]) not in judge_ids_submitted:
                missing.append({
                    "team": team["name"],
                    "judge": judge["name"]
                })

    return jsonify({
        "total_teams": total_teams,
        "total_judges": total_judges,
        "total_expected": total_expected,
        "total_submitted": total_submitted,
        "progress": f"{round(total_submitted/total_expected*100, 1)}%" if total_expected > 0 else "0%",
        "missing": missing
    }), 200