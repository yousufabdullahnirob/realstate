import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(url, method="GET", data=None, headers=None):
    if headers is None: headers = {}
    if data:
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8")), response.getcode()
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode("utf-8")), e.code

def test_flow():
    # 1. Login
    print("Logging in...")
    res, code = make_request(f"{BASE_URL}/login/", "POST", {
        "email": "admin@mahimbuilders.com",
        "password": "admin123",
        "role": "admin"
    })
    if code != 200:
        print("Login failed:", res)
        return
    
    token = res["access"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Admins
    print("Fetching admins...")
    admins, code = make_request(f"{BASE_URL}/v2/admins/", "GET", headers=headers)
    if not admins:
        print("No admins found.")
        return
    target_admin_id = admins[0]["id"]
    print(f"Target Admin ID: {target_admin_id}")

    # 3. Send Message
    print("Sending message...")
    msg, code = make_request(f"{BASE_URL}/v2/messages/", "POST", {
        "receiver": target_admin_id,
        "content": "TEST MESSAGE FROM URLLIB"
    }, headers=headers)
    if code != 201:
        print("Message send failed:", msg)
        return
    print("Message sent successfully.")

    # 4. Check Notifications
    print("Checking notifications...")
    notifs, code = make_request(f"{BASE_URL}/notifications/", "GET", headers=headers)
    
    found = False
    for n in notifs:
        if "TEST MESSAGE FROM URLLIB" in n["message"] or n["type"] == "message":
            print(f"FOUND Notification: {n}")
            found = True
            break
    
    if found:
        print("\nSUCCESS: Data flow verified!")
    else:
        print("\nFAILURE: Notification not found in API response.")

if __name__ == "__main__":
    test_flow()
