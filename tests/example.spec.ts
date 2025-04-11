import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto(`${process.env.BASE_URL}`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hikmah/);
});

