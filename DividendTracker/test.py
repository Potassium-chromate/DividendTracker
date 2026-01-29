import pyodbc
import pandas as pd

server = '192.168.58.2,32645'  # host,port — NO http://
database = 'master'            # default DB
username = 'sa'
password = 'EasonPaf-9721'
driver = '{ODBC Driver 17 for SQL Server}'

def print_tables(cursor):
	cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES")
	print("Tables in database:")
	for row in cursor.fetchall():
		print("-", row.TABLE_NAME)


if __name__ == "__main__":
	try:
		conn = pyodbc.connect(
			f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}',
			timeout=5
		)
		cursor = conn.cursor()
		
		cursor.execute("""CREATE TABLE Users (
							Account VARCHAR(100) PRIMARY KEY,
							Password VARCHAR(255) NOT NULL
						);""")
		cursor.execute("""CREATE TABLE Dividends (
							ID INT IDENTITY(1,1) PRIMARY KEY,
							Stock_ID VARCHAR(50) NOT NULL,
							Stock_name NVARCHAR(50) NOT NULL,
							Amount FLOAT NULL,
							Date VARCHAR(50) NOT NULL
						);""")
		cursor.commit()

		print_tables(cursor)
		conn.close()
	except Exception as e:
		print("Connection failed:", e)

