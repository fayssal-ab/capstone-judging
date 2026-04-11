from pymongo import MongoClient
import bcrypt

def seed():
    client = MongoClient("mongodb://localhost:27017")
    db = client.capstone_judging

    db.users.drop()
    db.teams.drop()
    db.scores.drop()

    db.scores.create_index([("team_id", 1), ("judge_id", 1)], unique=True)

    def add_user(name, email, code, role):
        hashed = bcrypt.hashpw(code.encode("utf-8"), bcrypt.gensalt())
        db.users.insert_one({"name": name, "email": email, "code": hashed, "role": role, "is_active": True})

    add_user("Admin", "admin@capstone.ma", "ADMIN2026", "admin")

    for i in range(1, 7):
        add_user(f"Judge {i}", f"judge{i}@capstone.ma", f"JUDGE0{i}", "judge")

    teams = [
        {"name": "Team Alpha", "company": "OCP Group", "date": "2026-04-10", "start_time": "09:00", "end_time": "09:20", "presentation_order": 1, "report_link": "https://drive.google.com/team-alpha", "status": "upcoming"},
        {"name": "Team Beta", "company": "Maroc Telecom", "date": "2026-04-10", "start_time": "09:25", "end_time": "09:45", "presentation_order": 2, "report_link": "https://drive.google.com/team-beta", "status": "upcoming"},
        {"name": "Team Gamma", "company": "BMCE Bank", "date": "2026-04-11", "start_time": "09:50", "end_time": "10:10", "presentation_order": 3, "report_link": "https://drive.google.com/team-gamma", "status": "upcoming"},
    ]
    for t in teams:
        db.teams.insert_one(t)

    print("=== Seed done ===")
    print("Admin: admin@capstone.ma / ADMIN2026")
    print("Judges: judge1-6@capstone.ma / JUDGE01-06")
    print(f"Teams: {len(teams)} created")

if __name__ == "__main__":
    seed()