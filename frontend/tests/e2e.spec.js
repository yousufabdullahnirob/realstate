import { test, expect } from '@playwright/test';

test.describe('Mahim Builders System Testing', () => {
  test('Login and Navigate to Dashboard', async ({ page }) => {
    // Navigate to frontpage
    await page.goto('http://localhost:5173/');
    
    // Login flow
    await page.click('text=Login');
    await page.fill('input[type="email"]', 'admin@mahim.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Sign In")');
    
    // Verify Dashboard access (Admins are redirected to /admin)
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
  });

  test('Search and View Project - Niketon Lake', async ({ page }) => {
    await page.goto('http://localhost:5173/projects');
    
    // Verify Niketon project is visible (case-sensitive "Niketon")
    const projectCard = page.locator('.property-card', { hasText: 'Niketon' });
    await expect(projectCard).toBeVisible();
    
    // Navigate to details (Link text is "VIEW PROJECT →")
    await projectCard.locator('text=VIEW PROJECT').click();
    await expect(page).toHaveURL(/\/projects\/\d+/);
    await expect(page.locator('h3.spotlight-title')).toContainText('Niketon');
  });

  test('Apartment Selection Flow', async ({ page }) => {
    await page.goto('http://localhost:5173/apartments');
    
    // Verify results exist (Class is .property-title)
    const unitTitle = page.locator('.property-title').first();
    await expect(unitTitle).toBeVisible({ timeout: 10000 });
    
    // Navigate to details (Button text is "VIEW DETAILS →")
    await page.locator('text=VIEW DETAILS').first().click();
    await expect(page).toHaveURL(/\/apartments\/\d+/);
  });
});
