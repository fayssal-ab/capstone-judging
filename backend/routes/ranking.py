from flask import Blueprint, jsonify
from models.score import get_all_scores, get_scores_by_team, CRITERIA
from models.team import get_all_teams
from middleware.auth_middleware import admin_required
from utils.tiebreak import rank_teams, get_category_winner

ranking_bp = Blueprint("ranking", __name__)

@ranking_bp.route("", methods=["GET"])
@admin_required
def overall_ranking():
    teams = get_all_teams()
    ranked = rank_teams(teams)
    return jsonify(ranked), 200

@ranking_bp.route("/category/<category>", methods=["GET"])
@admin_required
def category_ranking(category):
    if category not in CRITERIA:
        return jsonify({"error": "Invalid category"}), 400
    teams = get_all_teams()
    winner = get_category_winner(teams, category)
    return jsonify(winner), 200