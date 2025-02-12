from models import db 

class User(db.Model):
    __tablename__ = 'Users'
    Account = db.Column(db.String(100), primary_key=True)
    Password = db.Column(db.String(255), nullable=False)
