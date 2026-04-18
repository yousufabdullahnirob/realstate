import requests
import time

BASE_URL = "http://localhost:8000/api"

def measure_latency(endpoint):
    url = f"{BASE_URL}{endpoint}"
    start_time = time.time()
    try:
        response = requests.get(url, timeout=10)
        end_time = time.time()
        latency_ms = (end_time - start_time) * 1000
        return latency_ms, response.status_code
    except Exception as e:
        return None, str(e)

def run_benchmarks():
    print("--- PERFORMANCE BENCHMARK: API LATENCY ---")
    threshold = 2000 # 2 seconds
    
    endpoints = [
        "/apartments/",
        "/projects/",
    ]
    
    for ep in endpoints:
        latency, status = measure_latency(ep)
        if latency is not None:
            status_tag = "[OK]" if latency < threshold else "[WARN]"
            print(f"{status_tag} {ep}: {latency:.2f} ms (Status: {status})")
        else:
            print(f"[FAIL] {ep}: Connection Error ({status})")

if __name__ == "__main__":
    run_benchmarks()
