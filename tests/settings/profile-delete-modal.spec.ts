import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("settings - should display the delete modal", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');

    // Ensure user is logged in
    await expect.soft(page.locator('#sidebarUserMenu').getByText('Khalid Yusuf')).toBeVisible();

    // Navigate to the settings page
    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Display' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete Account' })).toBeVisible();

    // Open the delete account modal
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.getByText('Delete account', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Do you really want to delete your account?' })).toBeVisible();
    await expect(page.getByText("This action will be irreversible and you'll lost all your data")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.waitForTimeout(500);
    // Verify that the modal is closed
    await expect(page.getByRole('heading', { name: 'Do you really want to delete your account?' })).not.toBeVisible();
});