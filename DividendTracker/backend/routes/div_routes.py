from flask import request, jsonify
from models.dividends_model import Dividends
from models.stocks_model import Stocks
from models import db


def div_api(app):
    @app.route("/hello", methods=["GET"])
    def get_hello():
        return "hello"

    @app.route("/dividends", methods=["GET"])
    def get_Dividends():
        dividends = Dividends.query.all()
        
        return jsonify([
            {
                "ID": d.ID, 
                "stock_id": d.Stock_ID,
                "stock": d.Stock_name, 
                "amount": d.Amount, 
                "date": d.Date
            } 
            for d in dividends
        ])

    @app.route("/save_dividends", methods=["POST"])
    def save_dividends():
        data = request.get_json()
        if not data or "dividends" not in data:
            return jsonify({"error": "Invalid input"}), 400
        
        try:
            db.session.query(Dividends).delete()  # Clear existing data
            for item in data["dividends"]:         
                amount = float(item["amount"])
                new_dividend = Dividends(
                    Stock_ID=item["stock_id"],
                    Stock_name=item["stock"],
                    Amount=amount,
                    Date=item["date"]
                )
                db.session.add(new_dividend)
            db.session.commit()
            return jsonify({"message": "Dividends saved successfully"}), 201
        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")
            return jsonify({"error": str(e)}), 500

    @app.route("/get_stock_name", methods=["GET"])
    def get_stock():
        stock_id = request.args.get("id")
        if not stock_id:
            return jsonify({"error": "Stock ID is required"}), 400
        
        stock = Stocks.query.filter_by(Stock_ID=stock_id).first()
        
        if stock:
            return jsonify({"stock_id": stock.Stock_ID, "stock_name": stock.Stock_name})
        else:
            return jsonify({"error": "Stock ID not found"}), 404  

