from models import db 
from sqlalchemy import Float

class Dividends(db.Model):
    __tablename__ = 'Dividends'
    ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Stock_ID =  db.Column(db.String(50), nullable=False)
    Stock_name =  db.Column(db.String(50), nullable=False)
    Amount =  db.Column(Float, unique=False)
    Date =  db.Column(db.String(50), nullable=False)
