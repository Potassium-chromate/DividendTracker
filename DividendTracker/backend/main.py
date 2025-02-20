from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_api
from routes.div_routes import div_api

config = Config()
app = Flask(__name__)
CORS(app)

# Load database configuration

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

user_api(app)
div_api(app)

# Run the connection test
check_db_connection()
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5001)
