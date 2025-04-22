import { test as setup, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const kahfIdAuthFile = `playwright/.auth/kahf01.json`;
const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

const username = `${process.env.LinkedIn_USERNAME}`;
const password = `${process.env.LinkedIn_PASSWORD}`;

setup.skip('authenticate kahf id and save the session', async ({ page }) => {
    await page.goto(`/`);
    await expect(page).toHaveTitle(/Hikmah/);
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
    await page.getByRole('link', { name: 'Sign in' }).click();

    // Assert page contents
    await expect(page).toHaveTitle(/Kahf Identity/);
    await expect(page.getByRole('img', { name: 'Logo' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: 'Home About Privacy Terms' }).nth(1)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Linkedin' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Microsoft' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apple' })).toBeVisible();
    await expect(page.getByText('Home Accounts Devices Subscriptions')).toBeVisible();

    // Login to LinkedIn
    await page.getByRole('button', { name: 'Linkedin' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Email or Phone' }).click();
    await page.getByRole('textbox', { name: 'Email or Phone' }).fill(username);
    await page.getByRole('textbox', { name: 'Email or Phone' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Do stuff while page sleeps
    await page.waitForTimeout(15_000);

    await expect(page.getByRole('heading', { name: 'Login to Hikmah' })).toBeVisible();
    await expect(page.getByText(`Login using ${username}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.context().storageState({ path: kahfIdAuthFile });
});

setup("login to hikmah and save the session", async ({ browser }) => {
    const context = await browser.newContext({ storageState: kahfIdAuthFile });
    const page = await context.newPage();
    await page.goto(`https://id.kahf.co/`);

    await expect(page.getByRole('heading', { name: 'Khalid Yusuf' })).toBeVisible();

    await expect(page.getByText('Welcome Khalid Yusuf')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login as different user' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('heading', { name: 'Login to Hikmah' })).toBeVisible();
    await expect(page.getByText(`Login using ${username}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.goto('/');
    await expect(page.getByRole('button', { name: '+ Add New Post' })).toBeVisible();
    await page.getByRole('button', { name: '+ Add New Post' }).click();

    await page.context().storageState({ path: hikmahAuthFile });
});