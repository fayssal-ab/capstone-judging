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
        # Day 1 — Saturday April 11 — 10 teams
        {"name": "Team Alpha", "company": "OCP Group", "date": "2026-04-11", "start_time": "09:00", "end_time": "09:20", "presentation_order": 1},
        {"name": "Team Beta", "company": "Maroc Telecom", "date": "2026-04-11", "start_time": "09:25", "end_time": "09:45", "presentation_order": 2},
        {"name": "Team Gamma", "company": "BMCE Bank", "date": "2026-04-11", "start_time": "09:50", "end_time": "10:10", "presentation_order": 3},
        {"name": "Team Delta", "company": "Attijariwafa Bank", "date": "2026-04-11", "start_time": "10:15", "end_time": "10:35", "presentation_order": 4},
        {"name": "Team Epsilon", "company": "Inwi", "date": "2026-04-11", "start_time": "10:40", "end_time": "11:00", "presentation_order": 5},
        {"name": "Team Zeta", "company": "Managem", "date": "2026-04-11", "start_time": "11:30", "end_time": "11:50", "presentation_order": 6},
        {"name": "Team Eta", "company": "Cosumar", "date": "2026-04-11", "start_time": "11:55", "end_time": "12:15", "presentation_order": 7},
        {"name": "Team Theta", "company": "LafargeHolcim Maroc", "date": "2026-04-11", "start_time": "12:20", "end_time": "12:40", "presentation_order": 8},
        {"name": "Team Iota", "company": "Lydec", "date": "2026-04-11", "start_time": "14:00", "end_time": "14:20", "presentation_order": 9},
        {"name": "Team Kappa", "company": "Marsa Maroc", "date": "2026-04-11", "start_time": "14:25", "end_time": "14:45", "presentation_order": 10},

        # Day 2 — Sunday April 12 — 16 teams
        {"name": "Team Lambda", "company": "ONCF", "date": "2026-04-12", "start_time": "09:00", "end_time": "09:20", "presentation_order": 11},
        {"name": "Team Mu", "company": "RAM", "date": "2026-04-12", "start_time": "09:25", "end_time": "09:45", "presentation_order": 12},
        {"name": "Team Nu", "company": "Centrale Danone", "date": "2026-04-12", "start_time": "09:50", "end_time": "10:10", "presentation_order": 13},
        {"name": "Team Xi", "company": "Wafa Assurance", "date": "2026-04-12", "start_time": "10:15", "end_time": "10:35", "presentation_order": 14},
        {"name": "Team Omicron", "company": "Label Vie", "date": "2026-04-12", "start_time": "10:40", "end_time": "11:00", "presentation_order": 15},
        {"name": "Team Pi", "company": "Saham", "date": "2026-04-12", "start_time": "11:30", "end_time": "11:50", "presentation_order": 16},
        {"name": "Team Rho", "company": "TMSA", "date": "2026-04-12", "start_time": "11:55", "end_time": "12:15", "presentation_order": 17},
        {"name": "Team Sigma", "company": "Addoha", "date": "2026-04-12", "start_time": "12:20", "end_time": "12:40", "presentation_order": 18},
        {"name": "Team Tau", "company": "Sonasid", "date": "2026-04-12", "start_time": "14:00", "end_time": "14:20", "presentation_order": 19},
        {"name": "Team Upsilon", "company": "Ciments du Maroc", "date": "2026-04-12", "start_time": "14:25", "end_time": "14:45", "presentation_order": 20},
        {"name": "Team Phi", "company": "Auto Hall", "date": "2026-04-12", "start_time": "14:50", "end_time": "15:10", "presentation_order": 21},
        {"name": "Team Chi", "company": "Disway", "date": "2026-04-12", "start_time": "15:15", "end_time": "15:35", "presentation_order": 22},
        {"name": "Team Psi", "company": "HPS", "date": "2026-04-12", "start_time": "16:00", "end_time": "16:20", "presentation_order": 23},
        {"name": "Team Omega", "company": "Microdata", "date": "2026-04-12", "start_time": "16:25", "end_time": "16:45", "presentation_order": 24},
        {"name": "Team Atlas", "company": "S2M", "date": "2026-04-12", "start_time": "16:50", "end_time": "17:10", "presentation_order": 25},
        {"name": "Team Toubkal", "company": "M2M Group", "date": "2026-04-12", "start_time": "17:15", "end_time": "17:35", "presentation_order": 26},

        # Day 3 — Monday April 13 — 10 teams
        {"name": "Team Rif", "company": "CIH Bank", "date": "2026-04-13", "start_time": "09:00", "end_time": "09:20", "presentation_order": 27},
        {"name": "Team Sahara", "company": "Total Energies Maroc", "date": "2026-04-13", "start_time": "09:25", "end_time": "09:45", "presentation_order": 28},
        {"name": "Team Draa", "company": "Lesieur Cristal", "date": "2026-04-13", "start_time": "09:50", "end_time": "10:10", "presentation_order": 29},
        {"name": "Team Souss", "company": "Dari Couspate", "date": "2026-04-13", "start_time": "10:15", "end_time": "10:35", "presentation_order": 30},
        {"name": "Team Oued", "company": "Stokvis Nord Afrique", "date": "2026-04-13", "start_time": "10:40", "end_time": "11:00", "presentation_order": 31},
        {"name": "Team Moulouya", "company": "Jet Contractors", "date": "2026-04-13", "start_time": "11:30", "end_time": "11:50", "presentation_order": 32},
        {"name": "Team Ziz", "company": "Alliances", "date": "2026-04-13", "start_time": "11:55", "end_time": "12:15", "presentation_order": 33},
        {"name": "Team Tensift", "company": "Mutandis", "date": "2026-04-13", "start_time": "12:20", "end_time": "12:40", "presentation_order": 34},
        {"name": "Team Bouregreg", "company": "Taqa Morocco", "date": "2026-04-13", "start_time": "14:00", "end_time": "14:20", "presentation_order": 35},
        {"name": "Team Loukos", "company": "Timar", "date": "2026-04-13", "start_time": "14:25", "end_time": "14:45", "presentation_order": 36},
    ]

    for t in teams:
        t["report_link"] = ""
        t["status"] = "upcoming"
        db.teams.insert_one(t)

    print("=== Seed done ===")
    print("Admin: admin@capstone.ma / ADMIN2026")
    print("Judges: judge1-6@capstone.ma / JUDGE01-06")
    print(f"Teams: {len(teams)} created")
    print("  April 11: 10 teams")
    print("  April 12: 16 teams")
    print("  April 13: 10 teams")

if __name__ == "__main__":
    seed()