from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.team import create_team, get_all_teams, get_team_by_id, update_team, delete_team
from middleware.auth_middleware import admin_required
from bson import ObjectId

teams_bp = Blueprint("teams", __name__)

def serialize_team(team):
    team["_id"] = str(team["_id"])
    return team

@teams_bp.route("", methods=["GET"])
@jwt_required()
def list_teams():
    date = request.args.get("date")
    teams = get_all_teams(date)
    return jsonify([serialize_team(t) for t in teams]), 200

@teams_bp.route("/<team_id>", methods=["GET"])
@jwt_required()
def get_team(team_id):
    team = get_team_by_id(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    return jsonify(serialize_team(team)), 200

@teams_bp.route("", methods=["POST"])
@admin_required
def add_team():
    data = request.get_json()
    required = ["name", "company", "date", "start_time", "end_time", "presentation_order"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing fields"}), 400
    create_team(data)
    return jsonify({"message": "Team created"}), 201

@teams_bp.route("/<team_id>", methods=["PUT"])
@admin_required
def edit_team(team_id):
    data = request.get_json()
    data.pop("_id", None)
    update_team(team_id, data)
    return jsonify({"message": "Team updated"}), 200

@teams_bp.route("/<team_id>", methods=["DELETE"])
@admin_required
def remove_team(team_id):
    delete_team(team_id)
    return jsonify({"message": "Team deleted"}), 200