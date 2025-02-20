from flask import jsonify, request
import os

class UserAPI:
    def __init__(self, app):
        self.app = app
        self.setup_routes()

    def setup_routes(self):
        # Define the route using self.app
        
        @self.app.route("/api/logIn", methods=["GET"])
        def logIn():
            # Get the username from the query parameters
            account = request.args.get('account')  # assuming username is passed as a query parameter
            password = request.args.get('password')
            
            if "User.db" not in "/flask-backend/instance"
                create a db
            else:
                
                
                
            
    
        @self.app.route("/api/createUser", methods=["POST"])
        def createUser():
            # Get user data from the request body
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if not username or not password:
                return jsonify({"message": "Username and password are required"}), 400

            # Define the path to create the user folder
            users_folder = "users"
            user_folder_path = os.path.join(users_folder, username)
            
            # Check if the user already exists
            if os.path.isdir(user_folder_path):
                return jsonify({"message": "User already exists", "exists": True}), 409

            # Create the user folder
            os.makedirs(user_folder_path)
            
            # Optionally, store the user's password in a secure way (not in plain text)
            with open(os.path.join(user_folder_path, 'password.txt'), 'w') as f:
                f.write(password)  # In a real application, never store passwords in plain text
            
            return jsonify({"message": "User created successfully", "exists": True}), 201