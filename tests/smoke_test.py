import requests
import sys

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

def test_login():
    """Simulate user login flow via API."""
    print("[INFO] Testing API Login flow...")
    login_data = {"email": "admin@mahim.com", "password": "password", "role": "admin"}
    try:
        response = requests.post(f"{BASE_URL}/api/login/", json=login_data, timeout=5)
        if response.status_code == 200:
            token = response.json().get('access')
            print("[OK] Admin Login SUCCESS")
            return token
        else:
            print(f"[FAIL] Admin Login FAILED (Status: {response.status_code})")
            return None
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return None

def test_dashboard_data(token):
    """Verify admin dashboard stats can be fetched."""
    print("[INFO] Testing Dashboard Statistics API...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        response = requests.get(f"{BASE_URL}/api/admin-stats/", headers=headers, timeout=5)
        if response.status_code == 200:
            print("[OK] Dashboard Statistics FETCHED")
            return True
        else:
            print(f"[FAIL] Dashboard Stats FAILED (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"[ERROR] API Request failed: {e}")
        return False

def run_comprehensive_smoke():
    print("--- COMPREHENSIVE SMOKE TEST ---")
    
    # 1. Heartbeat
    try:
        requests.get(FRONTEND_URL, timeout=5)
        print("[OK] Frontend Server is ALIVE")
    except:
        print("[FAIL] Frontend Server is DOWN")
        sys.exit(1)

    # 2. Login Flow
    token = test_login()
    if not token: sys.exit(1)

    # 3. Dashboard Integration
    if not test_dashboard_data(token): sys.exit(1)

    # 4. Project View
    print("[INFO] Testing Public Project Listing...")
    res = requests.get(f"{BASE_URL}/api/apartments/", timeout=5)
    if res.status_code == 200:
        print(f"[OK] Project View SUCCESS (Count: {len(res.json())})")
    else:
        print("[FAIL] Project View FAILED")
        sys.exit(1)

    print("--- COMPREHENSIVE SMOKE TEST PASSED ---")

if __name__ == "__main__":
    run_comprehensive_smoke()
