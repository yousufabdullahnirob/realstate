# Mahim Builders: Comprehensive Testing & Quality Guide

This guide provides a roadmap for maintaining the quality and stability of the platform through automated and manual testing methodologies.

## 🚀 1. Automated Testing (CI/CD)

The project is equipped with a **GitHub Actions** CI/CD pipeline that automatically runs every time code is pushed to `main`. 

> [!TIP]
> To run the backend tests locally:
> ```bash
> pytest
> ```
> To run the frontend tests locally:
> ```bash
> cd frontend && npm test
> ```

## 📋 2. Release Testing Checklist (Manual)

Before every production deployment, perform the following manual checks:

- [ ] **Auth Flow:** Verify you can Register, Login, and stay logged in.
- [ ] **Payment Proof:** Try uploading a 1MB PDF/Image for an inquiry payment.
- [ ] **Admin Dashboard:** Check if stats (Total Projects, Total Apartments) match the database.
- [ ] **Inquiry Flow:** Submit an inquiry on a random apartment and check the admin panel.
- [ ] **Mobile View:** Open the site on a Chrome 'Mobile' emulator and check for layout breakages.

## 📈 3. Performance Testing (Locust)

For stress testing (e.g., handles 100+ concurrent users), use **Locust**.

> [!IMPORTANT]
> Install Locust via:
> ```bash
> pip install locust
> ```

### Sample `locustfile.py`
Create a file named `locustfile.py` in the root and run `locust`:
```python
from locust import HttpUser, task, between

class RealEstateUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def view_apartments(self):
        self.client.get("/api/apartments/")

    @task
    def view_projects(self):
        self.client.get("/api/projects/")
```

## 🔄 4. Regression Testing Rule

Whenever a new feature is added:
1.  **Run All Tests:** Do not merge if any existing test fails.
2.  **Add New Test:** If adding a new API endpoint, create a corresponding function in `core/tests/test_api.py`.
3.  **Check Coverage:** Aim for >80% coverage to ensure the core logic is protected.

---

## 🏗️ Test Mapping

| Test Type | Project Implementation |
| :--- | :--- |
| **Unit Testing** | `core/tests/test_models.py` |
| **Component Testing** | `ApartmentListing.test.jsx` |
| **Integration Testing** | `test.yml` (Full CI Flow) |
| **System Testing** | Browser Subagent (Manual/Automated) |
| **E2E Testing** | `e2e/auth.spec.js` (Playwright) |
| **Security Audit** | `bandit -r core/` |
| **Regression** | Every `git push` triggers a full suite |
| **Performance** | Optional `locustfile.py` |

---

## 🎭 5. End-to-End (E2E) Testing (Playwright)

To test the full user journey (Login -> Property Search -> Inquiry):

> [!IMPORTANT]
> Install the browser binaries first:
> ```bash
> cd e2e && npx playwright install chromium
> ```

Run the automated browser tests:
```bash
cd e2e && npx playwright test
```

## 🛡️ 6. Static Security Analysis (Bandit)

To scan the backend code for security vulnerabilities:

```bash
bandit -r core/
```
Check for "High" severity issues and resolve them before production deployment.
