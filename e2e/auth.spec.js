const { test, expect } = require('@playwright/test');

test.describe('Real Estate Platform: User Auth Journey', () => {
  test('should navigate to login and successfully authenticate', async ({ page }) => {
    // Go to the home page
    await page.goto('/');
    
    // Find the 'Member Login' button in the header and click it
    await page.getByText(/Member Login/i).first().click();

    // Verify we are on the login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText(/Welcome back/i);

    // Fill the login form
    // Note: We use the actual fields from the Login component
    await page.locator('input[type="email"]').fill('customer@example.com');
    await page.locator('input[type="password"]').fill('password123');

    // Click 'Sign In'
    await page.locator('button[type="submit"]').click();

    // Verify redirected to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText(/Client Portfolio/i)).toBeVisible();
  });
});
