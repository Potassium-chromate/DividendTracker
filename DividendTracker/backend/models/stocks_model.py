from models import db 

class Stocks(db.Model):
    __tablename__ = 'Stocks'
    Stock_ID = db.Column(db.String(50), primary_key=True)  # IDs are usually ASCII
    Stock_name = db.Column(db.Unicode(50), nullable=False)  # Use Unicode for Chinese

