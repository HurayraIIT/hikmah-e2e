# hikmah-e2e
End-to-end test automation using playwright node.js

## Installation

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

## Usage

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

## Top contributors:

<a href="https://github.com/HurayraIIT/hikmah-e2e/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HurayraIIT/hikmah-e2e" alt="contrib.rocks image" />
</a>