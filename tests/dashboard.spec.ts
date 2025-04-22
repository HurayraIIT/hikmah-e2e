import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("hikmah - authenticated - CRUD Post", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');
    const postContent = randomSlug();

    // Ensure user is logged in
    await expect.soft(page.locator('#sidebarUserMenu').getByText('Khalid Yusuf')).toBeVisible();
    await page.locator('#sidebarUserMenu').getByText('Khalid Yusuf').click();

    await page.locator('#top').getByText('@wpdabh').waitFor();
    await expect.soft(page.locator('#top').getByText('@wpdabh')).toBeVisible();

    // Create a post
    await page.getByRole('button', { name: 'Something nice to share?' }).click();
    await expect.soft(page.locator('div').filter({ hasText: /^Create post$/ })).toBeVisible();
    await page.getByRole('textbox', { name: 'Something nice to share?' }).fill(`### ${postContent}`);
    await expect.soft(page.getByRole('button', { name: 'Post', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Post', exact: true }).click();

    await expect.soft(page.getByRole('heading', { name: postContent })).toBeVisible();

    // Now delete post
    await page.locator('.pt-\\[0\\.1rem\\]').first().click();
    await expect.soft(page.getByRole('button', { name: 'Delete Post' })).toBeVisible();
    await expect.soft(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete Post' }).click();
    await expect.soft(page.locator('div').filter({ hasText: /^Are you sure you want to delete this post\?$/ })).toBeVisible();
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.waitForTimeout(500);
    await expect.soft(page.getByRole('heading', { name: postContent })).not.toBeVisible();
});

test("hikmah homepage - authenticated infinite scrolling", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const feedItems = page.locator('div.feed-item');

    // Test infinite scroll with for loop
    for (let i = 0; i < 26; i += 1) {
        // scroll
        if (await feedItems.nth(i).isVisible()) {
            await feedItems.nth(i).scrollIntoViewIfNeeded();
            // Print author name
            // console.log(`${i}: ${await feedItems.nth(i).locator("a.base-username").first().textContent()}`);
        } else {
            await page.locator("div.v3-infinite-loading").nth(1).scrollIntoViewIfNeeded();
            await page.waitForTimeout(1500);
        }

        await page.waitForTimeout(500);
    }

    // moderation status strings should not be visible in the page
    await expect.soft(page.getByText("Someone in our team is checking your content...")).not.toBeVisible();
    await expect.soft(page.getByText("Rejected for having harmful content")).not.toBeVisible();
});