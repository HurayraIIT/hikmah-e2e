import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("settings - should allow users to modify display settings", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');

    // Ensure user is logged in
    await expect.soft(page.locator('#sidebarUserMenu').getByText('Khalid Yusuf')).toBeVisible();

    // Navigate to the settings page
    await page.getByRole('link', { name: 'Settings' }).click();

    // Verify display settings
    await page.getByRole('link', { name: 'Display' }).click();
    await expect(page.locator("div#mainContent div.main-content-section")).toMatchAriaSnapshot(`
    - text: Appearance
    - radio "Light"
    - text: Light
    - radio "Dark"
    - text: Dark
    - radio "System"
    - text: System Video autoplay
    - switch
    `);

    // Toggle light mode
    await page.getByText('Light').click();
    await expect(page.locator("div#mainContent div.main-content-section")).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    // Toggle dark mode
    await page.getByText('Dark').click();
    await expect(page.locator("div#mainContent div.main-content-section")).toHaveCSS('background-color', 'rgb(20, 27, 52)');
});