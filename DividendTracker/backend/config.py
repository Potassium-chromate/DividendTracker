import os

class Config:
    def __init__(self):
        self.Username = os.getenv("DB_USER", "SA")            # fallback to "SA"
        self.Password = os.getenv("DB_PASSWORD", "password")  # fallback password
        self.Server   = os.getenv("DB_SERVER", "localhost")   # fallback host
        self.Data_Base = os.getenv("DB_NAME", "Data_Base")    # fallback DB name
        self.Driver   = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")
        
    def config(self):
        return f"mssql+pyodbc://{self.Username}:{self.Password}@{self.Server}/{self.Data_Base}?driver={self.Driver}"

