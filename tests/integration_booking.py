import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_booking_integration_flow():
    print("--- INTEGRATION TESTING: Use-Case 'Banani Booking' ---")
    
    # 1. Search for Banani apartments
    print("Step 1: Searching for apartments in Banani...")
    response = requests.get(f"{BASE_URL}/apartments/?location=Banani")
    apts = response.json()
    
    if not apts:
        print("[FAIL] No apartments found in Banani.")
        return False
    
    print(f"[OK] Found {len(apts)} apartments in Banani.")
    target_apt = apts[0]
    print(f"Selecting Apartment: {target_apt['title']} (ID: {target_apt['id']})")

    # 2. Check login health
    print("Step 2: Verifying public access to apartment details...")
    detail_res = requests.get(f"{BASE_URL}/apartments/{target_apt['id']}/")
    if detail_res.status_code == 200:
        print("[OK] Apartment details accessible.")
    else:
        print(f"[FAIL] Status {detail_res.status_code}")
        return False
        
    print("--- INTEGRATION TEST COMPLETED ---")
    return True

if __name__ == "__main__":
    if test_booking_integration_flow():
        exit(0)
    else:
        exit(1)
