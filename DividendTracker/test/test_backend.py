import pytest
import os
import requests
from dotenv import load_dotenv

# 1. 初始化設定
load_dotenv()
BASE_URL = os.getenv("BACKEND_SERVER_URL")
TEST_ACCOUNT = os.getenv("TEST_ACCOUNT")
TEST_PASSWORD = os.getenv("TEST_PASSWORD")

@pytest.fixture(scope="module")
def api_session():
    """
         建立一個模組級別的共享 Session。
        在所有測試開始前登入一次，並在結束後關閉。
    """
    session = requests.Session()
    login_url = f"{BASE_URL}/users/login"
    payload = {"account": TEST_ACCOUNT, "password": TEST_PASSWORD}
    
    try:
        response = session.post(login_url, json=payload)
        response.raise_for_status() # 如果 4xx/5xx 會直接報錯
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Login setup failed: {e}")

    # 確保有拿到 session cookie
    assert "session" in session.cookies.get_dict(), "No session cookie received during setup"
    
    yield session
    
    session.close()

def test_login_success():
    """
    [獨立測試] 驗證原始登入接口功能
    """
    url = f"{BASE_URL}/users/login"
    payload = {"account": TEST_ACCOUNT, "password": TEST_PASSWORD}
    
    response = requests.post(url, json=payload)
    
    assert response.status_code == 200
    assert "Login successful" in response.json().get("message", "")

def test_workflow_get_then_post(api_session):
    """
    [整合測試] 完整流程：讀取現有資料 -> 轉換格式 -> 寫回資料
    """
    # GET 讀取
    response = api_session.get(f"{BASE_URL}/dividends")
    assert response.status_code == 200
    
    get_data = response.json()
    assert isinstance(get_data, list)

    # 驗證欄位完整性 (抽樣檢查第一筆)
    if get_data:
        first_item = get_data[0]
        required_fields = ["id", "stock", "stock_id", "amount", "date"]
        for field in required_fields:
            assert field in first_item, f"Missing field: {field}"

    # 資料轉換 (使用 List Comprehension 讓程式碼更乾淨)
    # 過濾掉不需要回傳給後端的欄位 (如 'id')
    post_data_list = [
        {
            "stock_id": item["stock_id"],
            "stock": item["stock"],
            "date": item["date"],
            "amount": item["amount"]
        }
        for item in get_data
    ]

    # POST 寫回
    payload = {"dividends": post_data_list}
    response = api_session.post(f"{BASE_URL}/dividends", json=payload)

    # 驗證結果
    assert response.status_code == 201
    
    res_json = response.json()
    assert isinstance(res_json, dict)
    assert res_json["message"] == "Dividends saved successfully"

def test_get_specific_stock(api_session):
    """
    [功能測試] 取得特定股票資訊
    """
    target_stock = "0050"
    response = api_session.get(f"{BASE_URL}/stocks/{target_stock}")
    
    assert response.status_code == 200
    
    data = response.json()
    assert data["stock_id"] == target_stock
    assert "元大台灣50" in data["stock_name"]

def test_unauthorized_access():
    """
    [安全性測試] 未登入狀態下存取受保護資源
    """
    empty_session = requests.Session()
    response = empty_session.get(f"{BASE_URL}/dividends")
    
    assert response.status_code in [401, 403], "Should reject unauthorized access"
    empty_session.close()

def test_log_out_functionality():
    """
    [功能測試] 登出流程
        注意：這裡不使用 shared fixture 'api_session'，而是建立一個臨時 session。
        這是為了避免這個測試執行完後，把其他測試要用的共用 session 給登出了。
    """
    # 建立臨時 Session 並登入
    temp_session = requests.Session()
    login_res = temp_session.post(
        f"{BASE_URL}/users/login", 
        json={"account": TEST_ACCOUNT, "password": TEST_PASSWORD}
    )
    assert login_res.status_code == 200

    # 執行登出
    logout_res = temp_session.post(f"{BASE_URL}/users/logout")
    assert logout_res.status_code == 200
    assert logout_res.json()["message"] == "Logged out"

    # 驗證登出後無法再存取資料
    access_res = temp_session.get(f"{BASE_URL}/dividends")
    assert access_res.status_code == 401
    assert access_res.json()["error"] == "Authentication required"
    
    temp_session.close()
