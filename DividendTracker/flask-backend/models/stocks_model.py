from models import db 

class Stocks(db.Model):
    __tablename__ = 'Stocks'
    Stock_ID = db.Column(db.String(50), primary_key=True)
    Stock_name =  db.Column(db.String(50), nullable=False)
    
