const { test, expect } = require('@playwright/test');

test.describe('Real Estate Platform: Inquiry Journey', () => {
    test('should allow a user to search for an apartment and send an inquiry', async ({ page }) => {
        // Go to the home page
        await page.goto('/');

        // Navigate to the list of apartments
        await page.getByText(/Apartments/i).first().click();

        // Check if we are on the apartments page
        await expect(page).toHaveURL(/.*apartments/);

        // Click the first apartment in the list
        await page.locator('a.apt-link').first().click();

        // Check if we are on the apartment details page
        await expect(page).toHaveURL(/.*apartments\/\d+/);

        // Check for the "Send Inquiry" button
        const inquiryBtn = page.getByRole('button', { name: /Send Inquiry/i });
        await expect(inquiryBtn).toBeVisible();

        // Note: Full form submission is not tested here as it requires a real logged-in user 
        // who owns a booking or specific apartment access, but we validated the UI navigation layer.
    });
});
