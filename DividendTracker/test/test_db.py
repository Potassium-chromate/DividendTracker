import pyodbc, os, pytest
from dotenv import load_dotenv

load_dotenv()
connection_string = (
    f"DRIVER={os.getenv('DB_DRIVER')};"
    f"SERVER={os.getenv('DB_SERVER_URL')};"
    f"DATABASE={os.getenv('DB_DATABASE')};"
    f"UID={os.getenv('DB_USERNAME')};"
    f"PWD={os.getenv('DB_PASSWORD')}"
)


@pytest.fixture(scope="module")
def db_cursor():
    """
         建立一個模組級別的共享 cursor。
        在所有測試開始前登入一次，並在結束後關閉。
    """
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    
    yield cursor
    
    cursor.close()
    conn.close()

def get_table_schema(cursor, table_name):
    """
        共用的邏輯：傳入 Table 名稱，回傳整理好的 Schema Dict
    """
    sql = """
    SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = ?
    """
    cursor.execute(sql, (table_name,))
    rows = cursor.fetchall()

    schema_info = {}
    for row in rows:
        schema_info[row[0]] = {
            "type": row[1],
            "length": row[2],
            "nullable": row[3]
        }
    return schema_info

def test_user_model_structure(db_cursor):
    """
    [獨立測試] 驗證 Users Table 的 Schema (欄位名稱與型態)
    """
    schema_info = get_table_schema(db_cursor, 'Users')
    print("\n[Schema Info]:", schema_info)

    # 驗證欄位名稱是否存在
    assert "Account" in schema_info, "欄位 'Account' 遺失"
    assert "Password" in schema_info, "欄位 'Password' 遺失"

    # 驗證欄位型態
    # Account 是 varchar(100)
    assert schema_info["Account"]["type"] in ["nvarchar", "varchar"], "Account 型態錯誤"
    assert schema_info["Account"]["length"] == 100, "Account 長度應為 100"

    # Password 是 varchar(255)
    assert schema_info["Password"]["type"] in ["nvarchar", "varchar"], "Password 型態錯誤"
    assert schema_info["Password"]["length"] == 255, "Password 長度應為 255"
    
    # 驗證是否允許 NULL
    assert schema_info["Account"]["nullable"] == "NO", "Account 不應允許 NULL"
    assert schema_info["Password"]["nullable"] == "NO", "Password 不應允許 NULL"
    
def test_stocks_model_structure(db_cursor):
    """
    [獨立測試] 驗證 Stocks Table 的 Schema (欄位名稱與型態)
    """
    schema_info = get_table_schema(db_cursor, 'Stocks')
    print("\n[Schema Info]:", schema_info)

    # 驗證欄位名稱是否存在
    assert "Stock_ID" in schema_info, "欄位 'Stock_ID' 遺失"
    assert "Stock_name" in schema_info, "欄位 'Stock_name' 遺失"

    # 驗證欄位型態
    # Stock_ID 是 varchar(50)
    assert schema_info["Stock_ID"]["type"] in ["nvarchar", "varchar"], "Stock_ID 型態錯誤"
    assert schema_info["Stock_ID"]["length"] == 50, "Stock_ID 長度應為 50"

    # Stock_name 是 nvarchar(50)
    assert schema_info["Stock_name"]["type"] in ["nvarchar"], "Stock_name 型態錯誤"
    assert schema_info["Stock_name"]["length"] == 50, "Stock_name 長度應為 50"
    
    # 驗證是否允許 NULL
    assert schema_info["Stock_ID"]["nullable"] == "NO", "Stock_ID 不應允許 NULL"
    assert schema_info["Stock_name"]["nullable"] == "NO", "Stock_name 不應允許 NULL"
    
def test_dividends_model_structure(db_cursor):
    """
    [獨立測試] 驗證 Dividends Table 的 Schema (欄位名稱與型態)
    """
    schema_info = get_table_schema(db_cursor, 'Dividends')
    print("\n[Schema Info]:", schema_info)

    # 驗證欄位名稱是否存在
    assert "ID" in schema_info, "欄位 'ID' 遺失"
    assert "Stock_ID" in schema_info, "欄位 'Stock_ID' 遺失"
    assert "Stock_name" in schema_info, "欄位 'Stock_name' 遺失"
    assert "User_Account" in schema_info, "欄位 'User_Account' 遺失"
    assert "Amount" in schema_info, "欄位 'Amount' 遺失"
    assert "Date" in schema_info, "欄位 'Date' 遺失"

    # 驗證欄位型態 
    # ID 是 int
    assert schema_info["ID"]["type"] in ["int"], "ID 型態錯誤"

    # Stock_ID 是 varchar(50)
    assert schema_info["Stock_ID"]["type"] in ["nvarchar", "varchar"], "Stock_ID 型態錯誤"
    assert schema_info["Stock_ID"]["length"] == 50, "Stock_ID 長度應為 50"
    
    # Stock_name 是 varchar(50)
    assert schema_info["Stock_name"]["type"] in ["nvarchar", "varchar"], "Stock_name 型態錯誤"
    assert schema_info["Stock_name"]["length"] == 50, "Stock_name 長度應為 50"
    
    # User_Account 是 varchar(100)
    assert schema_info["User_Account"]["type"] in ["nvarchar", "varchar"], "User_Account 型態錯誤"
    assert schema_info["User_Account"]["length"] == 100, "User_Account 長度應為 100"
    
    # Amount 是 float
    assert schema_info["Amount"]["type"] in ["float"], "Amount 型態錯誤"
    
    # Date 是 varchar(50)
    assert schema_info["Date"]["type"] in ["nvarchar", "varchar"], "Date 型態錯誤"
    assert schema_info["Date"]["length"] == 50, "Date 長度應為 50"
    
    # 驗證是否允許 NULL
    assert schema_info["ID"]["nullable"] == "NO", "ID 不應允許 NULL"
    assert schema_info["Stock_ID"]["nullable"] == "NO", "Stock_ID 不應允許 NULL"
    assert schema_info["Stock_name"]["nullable"] == "NO", "Stock_name 不應允許 NULL"
    assert schema_info["User_Account"]["nullable"] == "NO", "User_Account 不應允許 NULL"
    assert schema_info["Amount"]["nullable"] == "YES", "Amount 應允許 NULL"
    assert schema_info["Date"]["nullable"] == "NO", "Date 不應允許 NULL"
