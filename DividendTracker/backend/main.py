from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes.user_routes import user_api
from routes.div_routes import div_api
from datetime import timedelta
from dotenv import load_dotenv
from werkzeug.middleware.proxy_fix import ProxyFix
import os

load_dotenv()
config = Config()
app = Flask(__name__)
CORS(app,
	origins=["http://localhost:5173",
	         "http://192.168.83.4:5173",
	         "https://dividend.local"],
	supports_credentials=True)


app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Load database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = config.config()  # Use one database connection
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Avoid warnings
app.config["SECRET_KEY"] = "請改成強隨機字串，正式環境用環境變數"
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# Use environment variable to distingish develop and production
if os.getenv("SSL_ENABLE") == "true":
    print("🔒 SSL Mode: ENABLED (Secure Cookies ON)")
    app.config["SESSION_COOKIE_SECURE"] = True
else:
    print("🔓 SSL Mode: DISABLED (Relying on Proxy or Local HTTP)")
    app.config["SESSION_COOKIE_SECURE"] = False

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
    # Use environment variable to distingish develop and production
    if os.getenv("SSL_ENABLE") == "true":
        cert_path = 'tls.crt'
        key_path = 'tls.key'
        ssl_context = (cert_path, key_path)
        app.run(host="0.0.0.0", debug=True, port=5001, ssl_context=ssl_context)
    else:
        app.run(host="0.0.0.0", debug=True, port=5001)
