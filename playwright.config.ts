import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 4,
  timeout: 40 * 1000,

  reporter: [['json', { outputFile: 'test-results/summary.json' }], ["dot"], ["list"], ["html"]],

  use: {
    baseURL: process.env.BASE_URL || `https://hikmah.net/`,
    screenshot: "on",
    trace: "on",
    video: "on",

    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "QATEST": `HurayraIIT`,
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
