from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient

jwt = JWTManager()
db = None

def create_app():
    global db
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = "AWIJUDGE36_2025"

    client = MongoClient("mongodb://localhost:27017")
    db = client.capstone_judging

    jwt.init_app(app)
    CORS(app)

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

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)