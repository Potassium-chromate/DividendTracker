import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Read the Excel file
df = pd.read_excel('C:/Users/user/Desktop/股票id.xlsx')

# Convert DataFrame to numpy array and process it
arr = df.to_numpy()
result = [element[0].split() for element in arr]

# Database connection details
Server = "localhost\\SQLEXPRESS"
Database = "Data_Base"
Driver = "ODBC Driver 17 for SQL Server"
Database_con = f"mssql+pyodbc://@{Server}/{Database}?driver={Driver}"

# Create SQLAlchemy engine
engine = create_engine(Database_con)

# Insert data into "Stocks" table with auto-commit
def insert_stocks():
    with engine.begin() as connection:  # Auto-commit mode
        print("Inserting data into Stocks table...")
        for element in result:
            try:
                Stock_ID, Stock_Name = element[0], element[1]  # Ensure both values exist
                query = text("""
                    INSERT INTO Stocks (Stock_ID, Stock_name)
                    VALUES (:Stock_ID, :Stock_Name)
                """)
                connection.execute(query, {"Stock_ID": Stock_ID, "Stock_Name": Stock_Name})
                print(f"Inserted: {Stock_ID} - {Stock_Name}")
            except Exception as e:
                print(f"Error inserting {element}: {e}")

# Retrieve and print data from "Stocks" table
def search_stocks():
    query = "SELECT * FROM dbo.Stocks;"
    with engine.connect() as connection:
        try:
            result = connection.execute(text(query))
            for row in result:
                print(f"Stock ID: {row['Stock_ID']}, Stock Name: {row['Stock_name']}")
        except Exception as e:
            print(f"Error fetching stocks: {e}")

# Check connection and insert data
def check_connection():
    try:
        with engine.connect() as connection:
            print("Database connection successful!")
            insert_stocks()  # Insert the data
            search_stocks()  # Retrieve and print the data
    except OperationalError as e:
        print(f"Connection failed: {e}")

# Run script
if __name__ == '__main__':
    check_connection()
