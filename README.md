# hikmah-e2e

[![Playwright Tests](https://github.com/HurayraIIT/hikmah-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/HurayraIIT/hikmah-e2e/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub last commit](https://img.shields.io/github/last-commit/HurayraIIT/hikmah-e2e)

End-to-end test automation using playwright node.js

## 🚀 Installation

_Follow the steps below to setup and run the project locally on your machine._

1. Clone the repo

```sh
git clone git@github.com:HurayraIIT/hikmah-e2e.git
```

2. Install NPM packages

```sh
npm install
```

3. Create the `.env` file and provide necessary details

```sh
cp .env.example .env
```

4. Update/Install playwright browsers.

```sh
npx playwright install --with-deps
```

5. Create storage state files.

```sh
mkdir -p playwright/.auth && cd playwright/.auth
for type in kahf01 hikmah01; do echo "{}" > "$type.json"; done
```

## 🧪 Running Tests

To run the tests:

```sh
npx playwright test
```

_For more examples, please refer to the [ Official Documentation](https://playwright.dev)_

## How to update playwright

By keeping the Playwright version up to date we will be able to use new features and test our app on the latest browser versions and catch failures before the latest browser version is released to the public.

```sh
# Update playwright
npm install -D @playwright/test@latest

# Install new browsers
npx playwright install
```

See what version of Playwright we have by running the following command:

```sh
npx playwright --version
```

## Managing Session in CI:

First of all, make sure to run the tests locally. You can generate the kahf ID session by running the following test:

```sh
npx playwright test tests/auth.setup.ts:10
```

Then run the following test to generate the hikmah session. Make sure that line:50 is not commented out! However, this process is set as a project dependency, so no need to do this manually. When you run any test, this step will be automatically executed.

```sh
npx playwright test tests/auth.setup.ts:30
```

Now run these commands to generate the base64 of the kahf session:

```sh
base64 -i playwright/.auth/kahf01.json > playwright/.auth/kahf01.b64
```

Finally visit [this page](https://github.com/HurayraIIT/hikmah-e2e/settings/secrets/actions) to add the newly generated base64 encoded session data.

The session lasts for 7 days (I think) so we need to update the session once every 7 days (until we find a better solution).

## Top contributors:

<a href="https://github.com/HurayraIIT/hikmah-e2e/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HurayraIIT/hikmah-e2e" alt="contrib.rocks image" />
</a>