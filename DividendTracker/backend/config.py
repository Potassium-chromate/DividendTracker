class Config:
    def __init__(self):
        self.Username = "SA"  # Replace with your DB username
        self.Password = "Eason901215"  # Replace with your DB password
        self.Server = "localhost"  # Double backslashes for escape
        self.Data_Base = "Data_Base"
        self.Driver = "ODBC Driver 17 for SQL Server"
        
    def config(self):
        #return f"mssql+pyodbc://{self.Username}:{self.Password}@{self.Server}/{self.Data_Base}?driver={self.Driver}"
    	return f"mssql+pyodbc://{self.Username}:{self.Password}@192.168.83.4/{self.Data_Base}?driver=ODBC+Driver+17+for+SQL+Server"

