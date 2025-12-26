from flask import request, jsonify, g, session
from models.dividends_model import Dividends
from models.stocks_model import Stocks
from models import db
from routes.auth import login_required

def div_api(app):
    @app.route("/hello", methods=["GET"])
    def get_hello():
        return "hello"

    # Retrieve all dividends
    @app.route("/dividends", methods=["GET"])
    @login_required
    def get_dividends():
        if 'user_account' not in session:
            return jsonify({"error": "Not logged in"}), 401
        # return only dividends belonging to the authenticated user
        dividends = Dividends.query.filter_by(User_Account=g.user.Account).all()
        return jsonify([
            {
                "id": d.ID,
                "stock_id": d.Stock_ID,
                "stock": d.Stock_name,
                "amount": d.Amount,
                "date": d.Date
            }
            for d in dividends
        ]), 200

    # Create (save) new dividends
    @app.route("/dividends", methods=["POST"])
    @login_required
    def create_dividends():
        data = request.get_json()
        if not data or "dividends" not in data:
            return jsonify({"error": "Invalid input"}), 400
        
        try:
            # Clear existing data for this user only
            db.session.query(Dividends).filter_by(User_Account=g.user.Account).delete()

            # Add new dividends tied to this user
            for item in data["dividends"]:
                new_dividend = Dividends(
                    Stock_ID=item["stock_id"],
                    Stock_name=item["stock"],
                    User_Account=g.user.Account,
                    Amount=float(item["amount"]),
                    Date=item["date"]
                )
                db.session.add(new_dividend)
            db.session.commit()

            return jsonify({"message": "Dividends saved successfully"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    # Retrieve stock details by Stock ID
    @app.route("/stocks/<string:id>", methods=["GET"])
    def get_stock_by_id(id):
        stock = Stocks.query.filter_by(Stock_ID=id).first()
        if stock:
            return jsonify({
                "stock_id": stock.Stock_ID,
                "stock_name": stock.Stock_name
            }), 200
        return jsonify({"error": "Stock not found"}), 404

