import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

const username = `${process.env.LINKEDIN_EMAIL}`;
const password = `${process.env.LINKEDIN_PASS}`;

test.skip('authenticate kahf id and save the session', async ({ page }) => {
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

test.skip("login to hikmah and save the session", async ({ browser }) => {
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

    // await page.context().storageState({ path: hikmahAuthFile });
});