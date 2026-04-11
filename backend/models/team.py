from models.database import get_db
from bson import ObjectId

def create_team(data):
    team = {
        "name": data["name"],
        "company": data["company"],
        "date": data["date"],
        "start_time": data["start_time"],
        "end_time": data["end_time"],
        "presentation_order": data["presentation_order"],
        "report_link": data.get("report_link", ""),
        "status": "upcoming"
    }
    return get_db().teams.insert_one(team)

def get_all_teams(date=None):
    query = {"date": date} if date else {}
    return list(get_db().teams.find(query).sort("presentation_order", 1))

def get_team_by_id(team_id):
    return get_db().teams.find_one({"_id": ObjectId(team_id)})

def update_team(team_id, data):
    return get_db().teams.update_one({"_id": ObjectId(team_id)}, {"$set": data})

def delete_team(team_id):
    return get_db().teams.delete_one({"_id": ObjectId(team_id)})