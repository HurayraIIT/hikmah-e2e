import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("my pages - should display the pages created by this user", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Switch to a page
    await expect(page.getByRole('link', { name: 'My pages' })).toBeVisible();
    await page.getByRole('link', { name: 'My pages' }).click();
    await expect(page.getByRole('heading', { name: 'My pages' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create new page' })).toBeVisible();
    await expect(page.getByText('WPDABH Page')).toBeVisible();
    await page.locator('#sidebarUserMenu').getByRole('button').filter({ hasText: /^$/ }).click();
    await expect(page.locator('div').filter({ hasText: /^Switch Page$/ })).toBeVisible();
    await expect(page.getByLabel('Switch Page').getByText('WPDABH Page')).toBeVisible();
    await expect(page.getByLabel('Switch Page').getByRole('button', { name: 'Create new page' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
});