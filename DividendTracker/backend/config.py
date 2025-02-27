import os

class Config:
    def __init__(self):
        self.Username = os.getenv("DB_USER")            # fallback to "SA"
        self.Password = os.getenv("DB_PASSWORD")  # fallback password
        self.Server   = os.getenv("DB_SERVER")   # fallback host
        self.Data_Base = os.getenv("DB_NAME")    # fallback DB name
        self.Driver   = os.getenv("DB_DRIVER")
        
    def config(self):
    	return f"mssql+pyodbc://{self.Username}:{self.Password}@{self.Server}/{self.Data_Base}?driver={self.Driver}"
