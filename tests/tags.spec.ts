import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("hikmah - unauthenticated users should not access the tags page", async ({ page }) => {
    await page.goto(`https://hikmah.net/hashtags/suggest`);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
});

test("hikmah - homepage interest section", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    await expect(page.getByRole('heading', { name: 'Interest' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^InterestView All$/ }).getByRole('link')).toBeVisible();

    const interest_box = page.locator("div#right div.widget-box").nth(1);
    expect.soft(interest_box).toBeVisible();

    // There should be 10 tags + 1 "view all" button
    const tags = interest_box.locator("div.flex a");
    expect.soft(await tags.count()).toBe(11);

    // Click on a tag and verify
    await tags.nth(5).click();
    await page.waitForTimeout(500);
    await page.waitForLoadState('domcontentloaded');

    expect.soft(page).toHaveURL(/hikmah\.net\/search\/hashtag\/page\?q=/);
    await expect.soft(page.getByText('Post', { exact: true })).toBeVisible();
    await expect.soft(page.getByText('People', { exact: true })).toBeVisible();
    await expect.soft(page.getByText('Page', { exact: true })).toBeVisible();
    await page.getByText('People', { exact: true }).click();
    await page.getByText('Page', { exact: true }).click();
    await page.getByText('Post', { exact: true }).click();
});