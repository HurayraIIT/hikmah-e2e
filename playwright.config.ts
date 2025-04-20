import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 4,
  timeout: 60 * 1000,

  reporter: [["dot"], ["list"], ["html"]],

  use: {
    baseURL: process.env.BASE_URL,
    screenshot: "on",
    trace: "on-first-retry",
    video: "on",

    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "QATEST": `HurayraIIT`,
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
