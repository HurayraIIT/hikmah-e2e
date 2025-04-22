import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("hashtags - should not let unauthenticated users access the tags page", async ({ page }) => {
    await page.goto(`https://hikmah.net/hashtags/suggest`);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
});

test("hashtags - should display the homepage interest section", async ({ browser }) => {
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

test("hashtags - should show all hashtags in the hashtags suggest page", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const viewAllHashtagsLink = page.locator('a[href="/hashtags/suggest"]', {
        hasText: 'View All'
    });
    await viewAllHashtagsLink.click();
    await page.waitForTimeout(500);
    await page.waitForLoadState('domcontentloaded');

    // verify the page contents
    await expect(page.getByRole('textbox', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tags for you' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Enter tags' })).toBeVisible();

    // There should be no negative numbers in the post counts
    await page.locator('#center div.list_items_sub_text_color').first().waitFor();
    const count = await page.locator('#center div.list_items_sub_text_color').getByText(/-\d+ posts/).count();
    // console.log(`Count: ${count}`);
    // expect.soft(count).toBe(0);

    // Search for a tag
    await page.getByRole('textbox', { name: 'Enter tags' }).click();
    await page.getByRole('textbox', { name: 'Enter tags' }).fill('Karate_Overhung_Mourner_Freight_Reach9_Swinger');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('link', { name: 'Karate_Overhung_Mourner_Freight_Reach9_Swinger 1 post' })).toBeVisible();
    await expect(page.locator('#center').getByRole('button', { name: 'Follow' })).toBeVisible();
    await page.getByRole('link', { name: 'Karate_Overhung_Mourner_Freight_Reach9_Swinger 1 post' }).click();
    await expect(page.getByText('#Karate_Overhung_Mourner_Freight_Reach9_Swinger Follow')).toBeVisible();
    await expect(page.getByText('Khalid Yusuf')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'May Allah grant us jannah.' })).toBeVisible();
    await page.getByText('People').click();
    await expect(page.getByText('Khalid Yusuf@wpdabh')).toBeVisible();
    await page.getByText('Page', { exact: true }).click();
    await expect(page.getByText('No pages found')).toBeVisible();
});