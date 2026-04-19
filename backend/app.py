from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_folder="build/static", static_url_path="/static")

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "AWIJUDGE36_2025")

    jwt.init_app(app)
    CORS(app, origins=["*"])

    from routes.auth import auth_bp
    from routes.teams import teams_bp
    from routes.scores import scores_bp
    from routes.ranking import ranking_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(teams_bp, url_prefix="/api/teams")
    app.register_blueprint(scores_bp, url_prefix="/api/scores")
    app.register_blueprint(ranking_bp, url_prefix="/api/ranking")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        if path.startswith("api/"):
            return jsonify({"error": "Not found"}), 404
        full_path = os.path.join(build_dir, path)
        if path and os.path.isfile(full_path):
            return send_from_directory(build_dir, path)
        return send_from_directory(build_dir, "index.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=False, host="0.0.0.0", port=5000)