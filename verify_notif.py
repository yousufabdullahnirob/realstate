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

def verify_notif_patch():
    # 1. Login
    print("Logging in...")
    res, code = make_request(f"{BASE_URL}/login/", "POST", {
        "email": "admin@mahimbuilders.com",
        "password": "admin123",
        "role": "admin"
    })
    if code != 200:
        print("Login failed")
        return
    
    token = res["access"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Notifications
    print("Fetching notifications...")
    notifs, code = make_request(f"{BASE_URL}/notifications/", "GET", headers=headers)
    if not notifs:
        print("No notifications found to test.")
        return
    
    target_id = notifs[0]["id"]
    print(f"Testing PATCH on notification ID: {target_id}")

    # 3. PATCH Notification
    patch_res, code = make_request(f"{BASE_URL}/v2/notifications/{target_id}/", "PATCH", {"is_read": True}, headers=headers)
    if code == 200 and patch_res["is_read"] == True:
        print(f"SUCCESS: Notification {target_id} marked as read via API.")
    else:
        print(f"FAILURE: API returned code {code}, res: {patch_res}")

if __name__ == "__main__":
    verify_notif_patch()
