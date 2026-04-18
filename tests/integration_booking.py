import requests
import sys

BASE_URL = "http://localhost:8000"

def run_banani_booking_scenario():
    print("--- USE-CASE TESTING: BANANI BOOKING ---")
    
    # 1. Search for Banani apartments
    print("[STEP 1] Searching for apartments in Banani...")
    res = requests.get(f"{BASE_URL}/api/apartments/?location=Banani")
    if res.status_code != 200:
        print("[FAIL] Search API failed")
        sys.exit(1)
    
    apartments = res.json()
    print(f"[INFO] Found {len(apartments)} apartments in Banani")
    
    if not apartments:
        print("[WARN] No apartments in Banani for simulation. Checking all apartments...")
        res = requests.get(f"{BASE_URL}/api/apartments/")
        apartments = res.json()
        if not apartments:
            print("[FAIL] No apartments available in database.")
            sys.exit(1)

    target_apt = apartments[0]
    print(f"[INFO] Selected Apartment: {target_apt['title']} (ID: {target_apt['id']})")

    # 2. Login as Client
    print("[STEP 2] Authenticating User...")
    login_res = requests.post(f"{BASE_URL}/api/login/", json={
        "email": "customer@example.com", 
        "password": "password",
        "role": "customer"
    })
    if login_res.status_code != 200:
        print("[FAIL] Client Login failed. Ensure 'customer@example.com' exists.")
        sys.exit(1)
    
    token = login_res.json()['access']
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Complete Booking
    print("[STEP 3] Attempting Booking...")
    booking_data = {
        "apartment": target_apt['id'],
        "advance_amount": 1000000
    }
    book_res = requests.post(f"{BASE_URL}/api/bookings/", json=booking_data, headers=headers)
    
    if book_res.status_code in [201, 200]:
        print(f"[OK] Booking completed for {target_apt['title']}")
        print(f"[INFO] Reference: {book_res.json().get('booking_reference')}")
    else:
        print(f"[FAIL] Booking failed: {book_res.text}")
        sys.exit(1)

    print("--- USE-CASE TEST PASSED ---")

if __name__ == "__main__":
    run_banani_booking_scenario()
