import { test, expect } from '@playwright/test';
import { randomSlug, randomString } from '../utils/random-data';

const hikmahAuthFile = `playwright/.auth/hikmah01.json`;

test("lists - should display all menu items", async ({ browser }) => {
    const context = await browser.newContext({ storageState: hikmahAuthFile });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Switch to a page
    await expect(page.getByRole('link', { name: 'Lists' })).toBeVisible();
    await page.getByRole('link', { name: 'Lists' }).click();
    await expect(page.locator('#center')).toMatchAriaSnapshot(`
      - link "Followers":
        - /url: /lists
      - link "Following":
        - /url: /lists/following
      - link "Blocking":
        - /url: /lists/block_member
      - link "Tags":
        - /url: /lists/tag
      - link "Stories":
        - /url: /lists/stories
    `);

    // Followers
    await expect(page.locator('#center')).toMatchAriaSnapshot(`
      - heading "Followers" [level=2]
      - button "Users"
      - button "Pages"
    `);
    await page.getByRole('link', { name: 'Followers' }).click();
    await expect(page.getByRole('heading', { name: 'Followers' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
    await page.getByRole('button', { name: 'Pages' }).click();

    // Following
    await page.getByRole('link', { name: 'Following' }).click();
    await expect(page.getByRole('heading', { name: 'Following' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();

    // Blocking
    await expect(page.getByRole('link', { name: 'Blocking' })).toBeVisible();
    await page.getByRole('link', { name: 'Blocking' }).click();
    await expect(page.getByRole('heading', { name: 'Blocked' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pages' })).toBeVisible();
    await page.getByRole('button', { name: 'Pages' }).click();

    // Tags
    await expect(page.getByRole('link', { name: 'Tags' })).toBeVisible();
    await page.getByRole('link', { name: 'Tags' }).click();
    await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();
    await expect(page.getByText('No Tags')).toBeVisible();

    // Stories
    await expect(page.getByRole('link', { name: 'Stories' })).toBeVisible();
    await page.getByRole('link', { name: 'Stories' }).click();
    await expect(page.getByRole('heading', { name: 'Stories' })).toBeVisible();
});