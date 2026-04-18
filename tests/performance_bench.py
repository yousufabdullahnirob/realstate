import requests
import time

BASE_URL = "http://localhost:8000/api"

def run_performance_test():
    print("--- PERFORMANCE TESTING: API Response Latency ---")
    
    url = f"{BASE_URL}/apartments/"
    start_time = time.time()
    
    try:
        response = requests.get(url, timeout=10)
        end_time = time.time()
        
        latency_ms = (end_time - start_time) * 1000
        print(f"Endpoint: {url}")
        print(f"Response Time: {latency_ms:.2f} ms")
        
        # User requested 2 seconds threshold report
        if latency_ms < 2000:
            print(f"[OK] Status: Acceptable (Below 2000ms threshold)")
        else:
            print(f"[WARN] Status: Slow (Exceeds 2000ms threshold)")
            
    except Exception as e:
        print(f"[ERROR] Performance test failed: {e}")

if __name__ == "__main__":
    run_performance_test()
