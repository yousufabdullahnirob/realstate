# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.js >> Mahim Builders System Testing >> Login and Navigate to Dashboard
- Location: tests\e2e.spec.js:4:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*admin/
Received string:  "http://localhost:5173/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://localhost:5173/login"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - img "Mahim Builders Logo" [ref=e7]
      - navigation [ref=e8]:
        - list [ref=e9]:
          - listitem [ref=e10]:
            - link "Home" [ref=e11] [cursor=pointer]:
              - /url: /
          - listitem [ref=e12]:
            - link "Apartments" [ref=e13] [cursor=pointer]:
              - /url: /apartments
          - listitem [ref=e14]:
            - link "About Us" [ref=e15] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e16]:
            - link "Projects" [ref=e17] [cursor=pointer]:
              - /url: /projects
          - listitem [ref=e18]:
            - link "Services" [ref=e19] [cursor=pointer]:
              - /url: /services
          - listitem [ref=e20]:
            - link "Contact" [ref=e21] [cursor=pointer]:
              - /url: /contact
      - link "Login" [ref=e23] [cursor=pointer]:
        - /url: /login
  - generic [ref=e27]:
    - heading "Welcome back" [level=2] [ref=e29]
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]: Email Address
        - textbox [ref=e33]: admin@mahim.com
      - generic [ref=e34]:
        - generic [ref=e35]: Password
        - generic [ref=e36]:
          - textbox [ref=e37]: password
          - button [ref=e38] [cursor=pointer]:
            - img [ref=e39]
      - button "Sign In" [active] [ref=e42] [cursor=pointer]
    - generic [ref=e43]:
      - text: Don't have an account?
      - link "Register Now" [ref=e44] [cursor=pointer]:
        - /url: /register
  - contentinfo [ref=e45]:
    - generic [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]: Mahim Builders
        - paragraph [ref=e52]: Premium properties with integrated interior and architectural design — crafted for Bangladesh's discerning homeowners since 2010.
        - generic [ref=e53]:
          - link "f" [ref=e54] [cursor=pointer]:
            - /url: https://facebook.com
          - link "in" [ref=e55] [cursor=pointer]:
            - /url: https://instagram.com
          - link "X" [ref=e56] [cursor=pointer]:
            - /url: https://twitter.com
          - link "li" [ref=e57] [cursor=pointer]:
            - /url: https://linkedin.com
      - generic [ref=e58]:
        - heading "Credentials" [level=4] [ref=e59]
        - generic [ref=e60]:
          - generic [ref=e61]:
            - paragraph [ref=e62]: RAJUK Reg.
            - paragraph [ref=e63]: RAJUK/DC/REDMR-001330/25
          - generic [ref=e64]:
            - paragraph [ref=e65]: REHAB Member
            - paragraph [ref=e66]: No. 1649/2022
      - generic [ref=e67]:
        - heading "Contact Us" [level=4] [ref=e68]
        - generic [ref=e69]:
          - generic [ref=e70]:
            - generic [ref=e71]: 📍
            - generic [ref=e72]:
              - paragraph [ref=e73]: Head Office
              - paragraph [ref=e74]: Mahim Shopping Mall, 4 East Maniknagor, Mugdapara, Dhaka-1203
          - generic [ref=e75]:
            - generic [ref=e76]: 🏢
            - generic [ref=e77]:
              - paragraph [ref=e78]: Operations
              - paragraph [ref=e79]: House 1015–1024, Road 7th Sarani & 47, Block-L, Bashundhara R/A, Dhaka-1229
          - generic [ref=e80]:
            - generic [ref=e81]: ✉️
            - generic [ref=e82]:
              - paragraph [ref=e83]: Email
              - paragraph [ref=e84]: info@mahimbuilders.com
          - generic [ref=e85]:
            - generic [ref=e86]: 📞
            - generic [ref=e87]:
              - paragraph [ref=e88]: Phone
              - paragraph [ref=e89]: +880 1778 117 118
      - generic [ref=e90]:
        - heading "Ongoing Projects" [level=4] [ref=e91]
        - generic [ref=e92]:
          - 'link "Mahim Palace 2: Bashundhara Royal Ascent" [ref=e93] [cursor=pointer]':
            - /url: /projects
          - 'link "Mahim Tower 2: Wari Signature Residence" [ref=e94] [cursor=pointer]':
            - /url: /projects
          - 'link "Mahim Shopping Mall: The Mugda Galleria" [ref=e95] [cursor=pointer]':
            - /url: /projects
        - heading "Quick Links" [level=4] [ref=e96]
        - generic [ref=e97]:
          - link "Home" [ref=e98] [cursor=pointer]:
            - /url: /
          - link "Projects" [ref=e99] [cursor=pointer]:
            - /url: /projects
          - link "Apartments" [ref=e100] [cursor=pointer]:
            - /url: /apartments
          - link "Services" [ref=e101] [cursor=pointer]:
            - /url: /services
          - link "About" [ref=e102] [cursor=pointer]:
            - /url: /about
          - link "Contact" [ref=e103] [cursor=pointer]:
            - /url: /contact
    - generic [ref=e104]:
      - paragraph [ref=e105]: © 2026 Mahim Builders Ltd. All rights reserved.
      - generic [ref=e106]:
        - link "Privacy Policy" [ref=e107] [cursor=pointer]:
          - /url: "#"
        - link "Terms of Service" [ref=e108] [cursor=pointer]:
          - /url: "#"
        - link "Cookie Policy" [ref=e109] [cursor=pointer]:
          - /url: "#"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Mahim Builders System Testing', () => {
  4  |   test('Login and Navigate to Dashboard', async ({ page }) => {
  5  |     // Navigate to frontpage
  6  |     await page.goto('http://localhost:5173/');
  7  |     
  8  |     // Login flow
  9  |     await page.click('text=Login');
  10 |     await page.fill('input[type="email"]', 'admin@mahim.com');
  11 |     await page.fill('input[type="password"]', 'password');
  12 |     await page.click('button:has-text("Sign In")');
  13 |     
  14 |     // Verify Dashboard access (Admins are redirected to /admin)
> 15 |     await expect(page).toHaveURL(/.*admin/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  16 |     await expect(page.locator('h1')).toContainText('Admin Dashboard');
  17 |   });
  18 | 
  19 |   test('Search and View Project - Niketon Lake', async ({ page }) => {
  20 |     await page.goto('http://localhost:5173/projects');
  21 |     
  22 |     // Verify Niketon project is visible (case-sensitive "Niketon")
  23 |     const projectCard = page.locator('.property-card', { hasText: 'Niketon' });
  24 |     await expect(projectCard).toBeVisible();
  25 |     
  26 |     // Navigate to details (Link text is "VIEW PROJECT →")
  27 |     await projectCard.locator('text=VIEW PROJECT').click();
  28 |     await expect(page).toHaveURL(/\/projects\/\d+/);
  29 |     await expect(page.locator('h3.spotlight-title')).toContainText('Niketon');
  30 |   });
  31 | 
  32 |   test('Apartment Selection Flow', async ({ page }) => {
  33 |     await page.goto('http://localhost:5173/apartments');
  34 |     
  35 |     // Verify results exist (Class is .property-title)
  36 |     const unitTitle = page.locator('.property-title').first();
  37 |     await expect(unitTitle).toBeVisible({ timeout: 10000 });
  38 |     
  39 |     // Navigate to details (Button text is "VIEW DETAILS →")
  40 |     await page.locator('text=VIEW DETAILS').first().click();
  41 |     await expect(page).toHaveURL(/\/apartments\/\d+/);
  42 |   });
  43 | });
  44 | 
```