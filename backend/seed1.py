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
        # Day 1 — Friday April 24 — 10 teams
        {"name": "200 OK", "company": "Oulmès", "date": "2026-04-24", "start_time": "15:00", "end_time": "15:30", "presentation_order": 1},
        {"name": "APEX", "company": "CMT", "date": "2026-04-24", "start_time": "15:30", "end_time": "16:00", "presentation_order": 2},
        {"name": "Aissila", "company": "CTM", "date": "2026-04-24", "start_time": "16:00", "end_time": "16:30", "presentation_order": 3},
        {"name": "Les Intouchables", "company": "Sothema", "date": "2026-04-24", "start_time": "16:30", "end_time": "17:00", "presentation_order": 4},
        {"name": "Impact Makers", "company": "Lesieur Cristal", "date": "2026-04-24", "start_time": "17:00", "end_time": "17:30", "presentation_order": 5},
        {"name": "Synergy", "company": "Addoha", "date": "2026-04-24", "start_time": "18:00", "end_time": "18:30", "presentation_order": 6},
        {"name": "Six Fold", "company": "CDM", "date": "2026-04-24", "start_time": "18:30", "end_time": "19:00", "presentation_order": 7},
        {"name": "Team Innovate", "company": "MARSAMAROC", "date": "2026-04-24", "start_time": "19:00", "end_time": "19:30", "presentation_order": 8},
        {"name": "EPSILON", "company": "CTM", "date": "2026-04-24", "start_time": "19:30", "end_time": "20:00", "presentation_order": 9},
        {"name": "Corporate Bloomers", "company": "Colorado", "date": "2026-04-24", "start_time": "20:00", "end_time": "20:30", "presentation_order": 10},

        # Day 2 — Saturday April 25 — 15 teams
        {"name": "Strategic leaders", "company": "COSUMAR", "date": "2026-04-25", "start_time": "09:00", "end_time": "09:30", "presentation_order": 11},
        {"name": "Inova", "company": "LABELVIE", "date": "2026-04-25", "start_time": "09:30", "end_time": "10:00", "presentation_order": 12},
        {"name": "Le Capstone", "company": "MARSAMAROC", "date": "2026-04-25", "start_time": "10:00", "end_time": "10:30", "presentation_order": 13},
        {"name": "KARMMA", "company": "LafargeHolcim", "date": "2026-04-25", "start_time": "10:30", "end_time": "11:00", "presentation_order": 14},
        {"name": "Rebels", "company": "MAROCTELECOM", "date": "2026-04-25", "start_time": "11:00", "end_time": "11:30", "presentation_order": 15},
        {"name": "SIMPLX", "company": "LABELVIE", "date": "2026-04-25", "start_time": "12:00", "end_time": "12:30", "presentation_order": 16},
        {"name": "BELFOSS", "company": "Afriquia Gaz", "date": "2026-04-25", "start_time": "12:30", "end_time": "13:00", "presentation_order": 17},
        {"name": "EEE", "company": "Aradei Capital", "date": "2026-04-25", "start_time": "13:00", "end_time": "13:30", "presentation_order": 18},
        {"name": "Momentum", "company": "Attijariwafa Bank", "date": "2026-04-25", "start_time": "13:30", "end_time": "14:00", "presentation_order": 19},
        {"name": "The Big Leagues", "company": "TGCC", "date": "2026-04-25", "start_time": "14:00", "end_time": "14:30", "presentation_order": 20},
        {"name": "The wrap-up", "company": "Sonasid", "date": "2026-04-25", "start_time": "15:45", "end_time": "16:15", "presentation_order": 21},
        {"name": "Ease & Edge", "company": "Stokvis", "date": "2026-04-25", "start_time": "16:15", "end_time": "16:45", "presentation_order": 22},
        {"name": "Toujours Plus", "company": "MAROCTELECOM", "date": "2026-04-25", "start_time": "16:45", "end_time": "17:15", "presentation_order": 23},
        {"name": "YMF", "company": "Maghreb Oxygene", "date": "2026-04-25", "start_time": "17:15", "end_time": "17:45", "presentation_order": 24},
        {"name": "Kaizen", "company": "Vicenne Group", "date": "2026-04-25", "start_time": "17:45", "end_time": "18:15", "presentation_order": 25},

        # Day 3 — Sunday April 26 — 10 teams
        {"name": "Les Qualifiables", "company": "ADDOHA", "date": "2026-04-26", "start_time": "09:00", "end_time": "09:30", "presentation_order": 26},
        {"name": "The sixth sense", "company": "Atlanta Sanad", "date": "2026-04-26", "start_time": "09:30", "end_time": "10:00", "presentation_order": 27},
        {"name": "fast and curious", "company": "CTM", "date": "2026-04-26", "start_time": "10:00", "end_time": "10:30", "presentation_order": 28},
        {"name": "Starkes team", "company": "CTM", "date": "2026-04-26", "start_time": "10:30", "end_time": "11:00", "presentation_order": 29},
        {"name": "Strategic Minds", "company": "COSUMAR", "date": "2026-04-26", "start_time": "11:15", "end_time": "11:45", "presentation_order": 30},
        {"name": "Last dance", "company": "Attijariwafa Bank", "date": "2026-04-26", "start_time": "11:45", "end_time": "12:15", "presentation_order": 31},
        {"name": "Future Leaders", "company": "LABELVIE", "date": "2026-04-26", "start_time": "12:15", "end_time": "12:45", "presentation_order": 32},
        {"name": "creative minds", "company": "Sonasid", "date": "2026-04-26", "start_time": "12:45", "end_time": "13:15", "presentation_order": 33},
        {"name": "RockTech", "company": "Ciments du Maroc", "date": "2026-04-26", "start_time": "13:15", "end_time": "13:45", "presentation_order": 34},
        {"name": "Sahara", "company": "MARSAMAROC", "date": "2026-04-26", "start_time": "13:45", "end_time": "14:15", "presentation_order": 35},
    ]

    for t in teams:
        t["report_link"] = ""
        t["status"] = "upcoming"
        db.teams.insert_one(t)

    print("=== Seed done ===")
    print("Admin: admin@capstone.ma / ADMIN2026")
    print("Judges: judge1-6@capstone.ma / JUDGE01-06")
    print(f"Teams: {len(teams)} created")
    print("  April 24 (Fri): 10 teams")
    print("  April 25 (Sat): 15 teams")
    print("  April 26 (Sun): 10 teams")

if __name__ == "__main__":
    seed()
