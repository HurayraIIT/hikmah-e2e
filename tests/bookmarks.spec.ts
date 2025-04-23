import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("bookmarks - should contain previously bookmarked posts", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Navigate and verify
    await expect(page.getByRole('link', { name: 'Bookmarks' })).toBeVisible();
    await page.getByRole('link', { name: 'Bookmarks' }).click();
    await expect(page.getByRole('heading', { name: 'Bookmarks' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Abu Hurayra$/ }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'React', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comment' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Share' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Saved' }).first()).toBeVisible();
    await expect(page.getByText('সুবহানাল্লাহ!! আলহামদুলিল্লাহ!!!')).toBeVisible();
    await expect(page.getByRole('link', { name: '#Karate_Overhung_Mourner' })).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Translated Show Original$/ }).first()).toBeVisible();
    await page.getByRole('link', { name: 'Show Original' }).click();
    await expect(page.getByRole('paragraph').filter({ hasText: 'SubhanAllah!! Alhamdulillah!!!' })).toBeVisible();
});