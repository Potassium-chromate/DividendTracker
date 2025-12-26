from flask import request, jsonify, make_response, session
from werkzeug.security import check_password_hash
from models.user_model import User
from models import db
from werkzeug.security import generate_password_hash

def user_api(app): 
    @app.route("/users/login", methods=["POST"])
    def logIn():
        data = request.get_json()
        account = data.get('account')
        password = data.get('password')

        if not account or not password:
            return jsonify({"error": "Missing account or password"}), 400

        user = User.query.filter_by(Account=account).first()
        if not user or not check_password_hash(user.Password, password):
            return jsonify({"error": "Invalid account or password"}), 401
        
        session["user_account"] = user.Account   # 建立登入 session
        session.permanent = False                 # 可配合 PERMANENT_SESSION_LIFETIME

        return jsonify({"message": "Login successful"}), 200

    @app.route("/users/create", methods=["POST"])
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
        new_user = User(Account=account, Password=generate_password_hash(password))
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Account created successfully!"}), 201

    @app.route("/users/logout", methods=["POST"])
    def logout():
        session.clear()  # 或 session.pop("user_account", None)
        return jsonify({"message": "Logged out"}), 200

