from flask import Blueprint, request, jsonify
from models.user_model import User
from models import db

# Create a Blueprint for user-related routes
user_bp = Blueprint("user", __name__)

  
@user_bp.route("/LogIn", methods=["POST"])
def logIn():
    data = request.get_json()
    account = data.get('account')
    password = data.get('password')

    if not account or not password:
        return jsonify({"error": "Missing account or password"}), 400
    

    user = User.query.filter_by(Account=account, Password=password).first()

    if user:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid account or password"}), 401


@user_bp.route("/CreateAccount", methods=["POST"])
def create_account():
    data = request.get_json()
    account = data.get('account')
    password = data.get('password')

    if not account or not password:
        return jsonify({"error": "Missing account or password"}), 400

    # Check if the account already exists
    existing_user = User.query.filter_by(Account=account).first()
    if existing_user:
        return jsonify({"error": "Account already exists"}), 400

    # Create new user and store it in the database
    new_user = User(Account=account, Password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"}), 201
    
    
    