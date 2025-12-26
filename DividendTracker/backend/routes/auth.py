from functools import wraps
from flask import jsonify, g, session
from models.user_model import User

def get_current_user():
    account = session.get("user_account")
    if not account:
        return None
    return User.query.filter_by(Account=account).first()

def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        g.user = user
        return fn(*args, **kwargs)
    return wrapper
