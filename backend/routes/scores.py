from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.score import create_score, get_scores_by_judge, get_scores_by_team, get_all_scores
from middleware.auth_middleware import admin_required, judge_required
from bson import ObjectId

scores_bp = Blueprint("scores", __name__)

def serialize_score(score):
    score["_id"] = str(score["_id"])
    score["judge_id"] = str(score["judge_id"])
    score["team_id"] = str(score["team_id"])
    return score

@scores_bp.route("", methods=["POST"])
@judge_required
def submit_score():
    judge_id = get_jwt_identity()
    data = request.get_json()
    team_id = data.get("team_id")

    if not team_id:
        return jsonify({"error": "team_id required"}), 400

    result = create_score(judge_id, team_id, data)
    if result is None:
        return jsonify({"error": "Already submitted for this team"}), 409

    return jsonify({"message": "Score submitted"}), 201

@scores_bp.route("/mine", methods=["GET"])
@judge_required
def my_scores():
    judge_id = get_jwt_identity()
    scores = get_scores_by_judge(judge_id)
    return jsonify([serialize_score(s) for s in scores]), 200

@scores_bp.route("/team/<team_id>", methods=["GET"])
@admin_required
def team_scores(team_id):
    scores = get_scores_by_team(team_id)
    return jsonify([serialize_score(s) for s in scores]), 200

@scores_bp.route("/all", methods=["GET"])
@admin_required
def all_scores():
    scores = get_all_scores()
    return jsonify([serialize_score(s) for s in scores]), 200