from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # Allow frontend to access API
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///dividends.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Dividend(db.Model):
    id = db.Column(db.String(10), primary_key=True)
    stock = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.String(10), nullable=False)

@app.route("/api/dividends", methods=["GET"])
def get_dividends():
    dividends = Dividend.query.all()
    return jsonify([{"id": d.id, "stock": d.stock, "amount": d.amount, "date": d.date} for d in dividends])

@app.route("/api/save_dividends", methods=["POST"])
def save_dividends():
    data = request.get_json()
    
    if not data or "dividends" not in data:
        return jsonify({"error": "Invalid input"}), 400
    
    try:
        db.session.query(Dividend).delete()  # Clear existing data
        for item in data["dividends"]:
            new_dividend = Dividend(
                id=item["id"],
                stock=item["stock"],
                amount=item["amount"],
                date=item["date"]
            )
            db.session.add(new_dividend)
        db.session.commit()
        return jsonify({"message": "Dividends saved successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def get_stock_name(stock_id):
    """Query database to get stock name by stock ID."""
    conn = sqlite3.connect("instance/stocks.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM stocks WHERE id = ?", (stock_id,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None

@app.route("/api/get_stock_name", methods=["GET"])
def get_stock():
    stock_id = request.args.get("id")
    if not stock_id:
        return jsonify({"error": "Stock ID is required"}), 400

    stock_name = get_stock_name(stock_id)
    if stock_name:
        return jsonify({"stock_id": stock_id, "stock_name": stock_name})
    else:
        return jsonify({"error": "Stock ID not found"}), 404

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create DB if not exists
    app.run(debug=True, port=5001)
