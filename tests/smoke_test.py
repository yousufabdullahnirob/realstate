import requests
import sys

def check_server(url, name):
    try:
        response = requests.get(url, timeout=5)
        if response.status_code < 400:
            print(f"[OK] {name} is UP ({url})")
            return True
        else:
            print(f"[FAIL] {name} returned status {response.status_code} ({url})")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] {name} is DOWN ({url}) - Error: {e}")
        return False

def run_smoke_test():
    print("--- SMOKE TESTING PHASE ---")
    backend_ok = check_server("http://localhost:8000/api/health/", "Django Backend")
    frontend_ok = check_server("http://localhost:5173", "Vite Frontend")
    
    if backend_ok and frontend_ok:
        print("--- SMOKE TEST PASSED ---")
        sys.exit(0)
    else:
        print("--- SMOKE TEST FAILED ---")
        sys.exit(1)

if __name__ == "__main__":
    run_smoke_test()
