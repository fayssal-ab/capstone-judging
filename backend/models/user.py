from models.database import get_db
import bcrypt

def create_user(name, email, code, role="judge"):
    hashed = bcrypt.hashpw(code.encode("utf-8"), bcrypt.gensalt())
    user = {
        "name": name,
        "email": email,
        "code": hashed,
        "role": role,
        "is_active": True
    }
    return get_db().users.insert_one(user)

def find_user_by_email(email):
    return get_db().users.find_one({"email": email})

def verify_code(stored_hash, code):
    return bcrypt.checkpw(code.encode("utf-8"), stored_hash)

def get_all_judges():
    return list(get_db().users.find({"role": "judge", "is_active": True}, {"code": 0}))