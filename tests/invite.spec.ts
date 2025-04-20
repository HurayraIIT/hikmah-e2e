import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("invite - verify page elements", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Check navigation from the homepage
    await expect(page.locator('#mainContent').getByRole('link', { name: 'Invite' })).toBeVisible();
    await expect(page.locator('#sidebarMenusList').getByRole('link', { name: 'Invite' })).toBeVisible();

    await page.locator('#mainContent').getByRole('link', { name: 'Invite' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Invite Friends')).toBeVisible();

    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#sidebarMenusList').getByRole('link', { name: 'Invite' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText('Invite Friends')).toBeVisible();

    // Verify the page contents
    await expect(page.getByText('Copy the link below to invite')).toBeVisible();
    await expect(page.locator('#myUrl')).toHaveValue("https://hikmah.net?referrer=hurayraiit");
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share on Facebook' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share on Twitter' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share on LinkedIn' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share on WhatsApp' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share on Telegram' })).toBeVisible();

    // verify copy link button
    await page.getByRole('button', { name: 'Copy link' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('This link copied!')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByText('This link copied!')).not.toBeVisible();

    // Verify the clipboard contents
    await page.getByRole('textbox', { name: 'Search' }).click();
    await page.keyboard.press('ControlOrMeta+V');
    await page.getByRole('textbox', { name: 'Search' }).press('Enter');
    await expect(page.getByText('Search: https://hikmah.net?referrer=hurayraiit')).toBeVisible();
});