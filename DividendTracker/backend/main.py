from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_api
from routes.div_routes import div_api
from datetime import timedelta

config = Config()
app = Flask(__name__)
CORS(app)

# Load database configuration

app.config["SQLALCHEMY_DATABASE_URI"] = config.config()  # Use one database connection
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Avoid warnings
app.config["SECRET_KEY"] = "請改成強隨機字串，正式環境用環境變數"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # 上線 HTTPS 改 True

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
