import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

const username = `${process.env.LINKEDIN_EMAIL}`;
const password = `${process.env.LINKEDIN_PASS}`;

test('authenticate kahf id and save the session', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL}`);
    await expect(page).toHaveTitle(/Hikmah/);
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
    await page.getByRole('link', { name: 'Sign in' }).click();

    // Assert page contents
    await expect(page).toHaveTitle(/Kahf Identity/);

    // Login to LinkedIn
    await page.getByRole('button', { name: 'Linkedin' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    // Do stuff while page sleeps
    await page.waitForTimeout(15_000);
    await page.context().storageState({ path: kahfIdAuthFile });
});

test("login to hikmah and save the session", async ({ browser }) => {
    const context = await browser.newContext({ storageState: kahfIdAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.KAHF_ID}`);

    await expect(page.getByRole('heading', { name: 'Abu Hurayra' })).toBeVisible();

    await expect(page.getByText('Welcome Abu Hurayra')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login as different user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { name: 'Login to Hikmah' })).toBeVisible();
    await expect(page.getByText('Login using hurayraiit')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.goto('https://hikmah.net/');
    await expect(page.getByRole('button', { name: '+ Add New Post' })).toBeVisible();
    await page.getByRole('button', { name: '+ Add New Post' }).click();

    await page.context().storageState({ path: hikmahAuthFile });
});

test("hikmah - authenticated - CRUD Post", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.BASE_URL}`);
    const postContent = randomSlug();

    // Ensure user is logged in
    await expect(page.locator('#sidebarUserMenu').getByText('Abu Hurayra')).toBeVisible();
    await page.locator('#sidebarUserMenu').getByText('Abu Hurayra').click();

    await page.locator('#top').getByText('@hurayraiit').waitFor();
    await expect(page.locator('#top').getByText('@hurayraiit')).toBeVisible();

    // Create a post
    await page.getByRole('button', { name: 'Something nice to share?' }).click();
    await expect(page.locator('div').filter({ hasText: /^Create post$/ })).toBeVisible();
    await page.getByRole('textbox', { name: 'Something nice to share?' }).fill(`### ${postContent}`);
    await expect(page.getByRole('button', { name: 'Post', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByText('Your post is submitted for review.')).toBeVisible();
    await expect(page.getByText('It will be published after some safety checks')).toBeVisible();
    await expect(page.getByRole('heading', { name: postContent })).toBeVisible();

    // Now delete post
    await page.locator('.pt-\\[0\\.1rem\\]').first().click();
    await expect(page.getByRole('button', { name: 'Delete Post' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete Post' }).click();
    await expect(page.locator('div').filter({ hasText: /^Are you sure you want to delete this post\?$/ })).toBeVisible();
    await page.getByRole('button', { name: 'Ok' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: postContent })).not.toBeVisible();
});

test("hikmah homepage - authenticated infinite scrolling", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');

    const feedItems = page.locator('div.feed-item');

    // Test infinite scroll with for loop
    for (let i = 0; i < 35; i += 1) {
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
});