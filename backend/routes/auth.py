from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models.user import find_user_by_email, verify_code

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return jsonify({"error": "Email and code required"}), 400

    user = find_user_by_email(email)
    if not user or not user["is_active"]:
        return jsonify({"error": "User not found"}), 404

    if not verify_code(user["code"], code):
        return jsonify({"error": "Invalid code"}), 401

    token = create_access_token(
        identity=str(user["_id"]),
        additional_claims={"role": user["role"], "name": user["name"]}
    )

    return jsonify({
        "token": token,
        "role": user["role"],
        "name": user["name"]
    }), 200

@auth_bp.route("/judges", methods=["GET"])
def list_judges():
    from models.user import get_all_judges
    judges = get_all_judges()
    for j in judges:
        j["_id"] = str(j["_id"])
    return jsonify(judges), 200