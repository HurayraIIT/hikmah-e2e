import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;
const customLink = `https://x.com/${randomSlug()}`;

test("settings - should allow users to view existing profile information", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');

    // Ensure user is logged in
    await expect.soft(page.locator('#sidebarUserMenu').getByText('Khalid Yusuf')).toBeVisible();

    // Navigate to the settings page > Profile Section
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await page.getByRole('link', { name: 'Settings' }).click();

    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();
    await expect(page.locator('#mainContent img')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Khalid Yusuf' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change profile photo' })).toBeVisible();

    // Verify the saved values

    // Email
    await expect(page.getByText("Email", { exact: true }).locator('../..').locator('input')).toHaveAttribute('value', "wpdabh@gmail.com");
    await expect(page.getByText("Email", { exact: true }).locator('../..').locator('input')).toHaveAttribute('readonly');

    // Display Name
    await expect(page.getByText("Display Name", { exact: true }).locator('../..').locator('input')).toHaveAttribute('value', "Khalid Yusuf");

    // Username
    await expect(page.getByText("Username", { exact: true }).locator('../..').locator('input')).toHaveAttribute('value', "wpdabh");

    // Language
    await expect(page.getByText("Language", { exact: true }).locator('../..').locator('span')).toHaveAttribute('aria-label', "Bangla");

    // Bio
    await expect(page.getByText("Bio", { exact: true }).locator('../..').locator('textarea')).toHaveAttribute('value', "This is the bio.");

    // About
    await expect(page.getByText("About", { exact: true }).locator('../..').locator('textarea')).toHaveAttribute('value', "This is the about content.");

    // Location
    await expect(page.getByText("Location", { exact: true }).locator('../..').locator('span')).toHaveAttribute('aria-label', "Bangladesh");
    await expect(page.getByText("Location", { exact: true }).locator('../..').getByPlaceholder('Zip Code')).toHaveAttribute('value', "1212");
    await expect(page.getByText("Location", { exact: true }).locator('../..').getByPlaceholder('Address')).toHaveAttribute('value', "Mirpur, Dhaka");

    // Gender
    await expect(page.getByText("Gender", { exact: true }).locator('../..').locator('span')).toHaveAttribute('aria-label', "Male");

    // Birthday
    await expect(page.getByText("Birthday", { exact: true }).locator('../..').locator('span')).toHaveAttribute('data-pc-name', "calendar");

    // Timezone
    await expect(page.getByText("Timezone", { exact: true }).locator('../..').locator('span')).toHaveAttribute('aria-label', "Asia/Dhaka (UTC+6:00)");

    // Links
    await expect(page.getByText("Link", { exact: true }).locator('../..').locator('input[value="https://wpdabh.com"]')).toBeVisible();
    await expect(page.getByText("Link", { exact: true }).locator('../..').locator('input[value="https://github.com/wpdabh"]')).toBeVisible();
});

test("settings - should allow users to save new profile information", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');

    // Ensure user is logged in
    await expect.soft(page.locator('#sidebarUserMenu').getByText('Khalid Yusuf')).toBeVisible();

    // Navigate to the settings page > Profile Section
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await page.getByRole('link', { name: 'Settings' }).click();

    // Add a new link and save
    await expect(page.getByRole('button', { name: 'Add more link' })).toBeVisible();
    await page.getByRole('button', { name: 'Add more link' }).click();
    await page.getByText("Link", { exact: true }).locator('../..').locator('input[value=""]').fill(customLink);
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Your changes have been saved.').waitFor();
    await expect(page.getByText('Your changes have been saved.')).toBeVisible();

    // Reload and verify the newly added link
    await page.goto('/settings');
    await expect(page.getByText("Link", { exact: true }).locator('../..').locator(`input[value="${customLink}"]`)).toBeVisible();

    // Now remove the link, save and verify
    await page.getByText("Link", { exact: true }).locator('../..').locator(`input[value="${customLink}"]`).locator('../../..').getByRole("button").click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Your changes have been saved.').waitFor();
    await expect(page.getByText('Your changes have been saved.')).toBeVisible();

    await page.goto('/settings');
    await expect(page.getByText("Link", { exact: true }).locator('../..').locator(`input[value="${customLink}"]`)).not.toBeVisible();
});