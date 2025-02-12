from flask import Flask
from flask_cors import CORS
from config import Config
from routes.user_routes import user_bp  
from routes.div_routes import div_bp  
from models import db  # Import shared db instance

app = Flask(__name__)
CORS(app, origins=["http://localhost:5001", "http://localhost:5173"], methods=["GET", "POST", "OPTIONS"])

# Load database configuration
config = Config()
app.config["SQLALCHEMY_DATABASE_URI"] = config.config()  # Use one database connection
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Avoid warnings

# Initialize SQLAlchemy with Flask app
db.init_app(app)



# Function to test database connection
from sqlalchemy import text

def check_db_connection():
    with app.app_context():
        try:
            with db.engine.connect() as connection:
                query = text("SELECT * FROM Stocks")  # Example table
                connection.execute(query)
                print("✅ Database connected successfully.")
        except Exception as e:
            print(f"❌ Error connecting to database: {e}")

# Register blueprints
app.register_blueprint(user_bp, url_prefix="/api/user")
app.register_blueprint(div_bp, url_prefix="/api/div")

# Run the connection test
check_db_connection()

if __name__ == "__main__":
    app.run(debug=True, port=5001)
