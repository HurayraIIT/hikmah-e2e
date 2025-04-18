import { test, expect } from '@playwright/test';

test.describe("Public Home Page", () => {
  test("hikmah public home - right column", async ({ page }) => {
    // Navigate to the home page
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    const continueButton = page.getByRole('button', { name: 'Continue browsing' });

    // Verify the sign in card contents
    await expect(page.locator('section')).toMatchAriaSnapshot(`
    - link:
      - img
    - heading "Let’s have a decent conversation" [level=6]
    - heading "Sign In" [level=1]
    - paragraph: Welcome to Hikmah
    - link "Sign in"
    - text: /Copyright 2025 by Hikmah — A Kahf Software Initiative/
    - link "Support"
    - link "Privacy Policy"
    - link "Terms & Conditions"
    `);
    await expect(page.getByRole('heading', { name: 'Let’s have a decent conversation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();

    // Verify the footer contents
    await expect(page.getByText('Copyright 2025 by Hikmah — A Kahf Software Initiative')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Support' })).toHaveAttribute('href', /support/);
    await expect(page.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', /privacy-policy/);
    await expect(page.getByRole('link', { name: 'Terms & Conditions' })).toHaveAttribute('href', /terms-and-conditions/);

    // Verify the sign in button click
    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL("https://id.kahf.co/?returnUrl=https%3A%2F%2Fhikmah.net%2Fauth%2Fkahf");
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
  });

  test("hikmah public home - login dialog", async ({ page }) => {
    // View a public post through the share link
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    const continueButton = page.getByRole('button', { name: 'Continue browsing' });
    await page.waitForTimeout(3000);

    // Card items
    await page.getByRole('button', { name: "Follow" }).nth(0).click();
    await continueButton.click();
    await page.locator('div.feed-main-action button').nth(0).click();
    await continueButton.click();
    await page.locator('div.feed-main-action button').nth(1).click();
    await continueButton.click();
    await page.locator('div.feed-main-action button').nth(2).click();
    await continueButton.click();
    await page.locator('div.feed-main-action button').nth(3).click();
    await continueButton.click();

    // Scrolling should trigger the login popup
    for (let i = 0; i < 6; i++) {
      await page.waitForTimeout(500);
      await page.locator('div.feed-item').nth(i).scrollIntoViewIfNeeded();
    }

    // Verify the login popup
    await expect(page.locator('body')).toMatchAriaSnapshot(`
    - heading "Sign in to see more" [level=3]
    - paragraph: Join our community to access all features
    - link "Sign in"
    - button "Continue browsing"
    `);
    await expect(page.getByRole('heading', { name: 'Sign in to see more' })).toBeVisible();
    await expect(page.getByText('Join our community to access all features')).toBeVisible();
    await expect(page.getByRole('dialog').filter({ hasText: 'Sign in to see moreJoin our' }).getByRole('link')).toHaveAttribute("href", "https://hikmah.net/auth/kahf");
    await expect(continueButton).toBeVisible();

    await continueButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Sign in to see more' })).not.toBeVisible();
  });

  test("hikmah public home - single post", async ({ page }) => {
    // View a public post through the share link
    await page.goto("https://hikmah.net/post/eid-mubarak-8p81l8hDNZ");
    await page.waitForLoadState('domcontentloaded');
    const continueButton = page.getByRole('button', { name: 'Continue browsing' });

    await expect(page.locator('div').filter({ hasText: /^Login$/ })).toBeVisible();
    await expect(page.getByRole('article')).toMatchAriaSnapshot(`
      - link "Abu Hurayra":
        - img "Abu Hurayra"
      - link "Abu Hurayra"
      - button "Follow"
      - link /ago/
      - paragraph: Eid Mubarak
      - img
      - text: /\\d+ views/
      - button "React":
        - img
      - button "Comment":
        - img
      - button "Share":
        - img
      - button "Save":
        - img
      `);
    await expect(page.locator('#center')).toMatchAriaSnapshot(`
    - link "Abu Hurayra":
      - img "Abu Hurayra"
    - link "Abu Hurayra"
    - link "@hurayraiit"
    - paragraph: Follower
    `);

    await page.getByRole('button', { name: 'Login' }).click();
    await continueButton.click();
    await page.getByRole('button', { name: 'Follow' }).click();
    await continueButton.click();
    await page.getByRole('button', { name: 'React' }).click();
    await continueButton.click();
    await page.getByRole('button', { name: 'Comment' }).click();
    await continueButton.click();
    await page.getByRole('button', { name: 'Share' }).click();
    await continueButton.click();
    await page.getByRole('button', { name: 'Save' }).click();
    await continueButton.click();

    // Back to home
    await page.locator('div').filter({ hasText: /^Login$/ }).getByRole('link').click();
    await expect(page.getByText('Welcome to Hikmah')).toBeVisible();
  });

  test("hikmah public home - infinite scrolling", async ({ page }) => {
    // Navigate to the home page
    await page.goto(`${process.env.BASE_URL}`);
    await page.waitForLoadState('domcontentloaded');
    const continueButton = page.getByRole('button', { name: 'Continue browsing' });
    const feedItems = page.locator('div.feed-item');

    // Test infinite scroll with for loop
    for (let i = 0; i < 35; i += 2) {
      // scroll
      if (await feedItems.nth(i).isVisible()) {
        await feedItems.nth(i).scrollIntoViewIfNeeded();
        // Print author name
        // console.log(`${i}: ${await feedItems.nth(i).locator("a.base-username").first().textContent()}`);
      } else {
        await page.locator("div.v3-infinite-loading").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
      }
      // if continueButton is visible, click it
      if (await continueButton.isVisible()) {
        await continueButton.click();
      }
      await page.waitForTimeout(500);
    }

    // moderation status strings should not be visible in the page
    await expect.soft(page.getByText("Someone in our team is checking your content...")).not.toBeVisible();
    await expect.soft(page.getByText("Rejected for having harmful content")).not.toBeVisible();
  });
});
