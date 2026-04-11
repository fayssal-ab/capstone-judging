from pymongo import MongoClient

_db = None

def get_db():
    global _db
    if _db is None:
        client = MongoClient("mongodb://localhost:27017")
        _db = client.capstone_judging
    return _db