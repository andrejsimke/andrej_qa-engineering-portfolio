# QA Engineering Portfolio

A small Playwright and TypeScript project for practicing test automation and explaining quality decisions. The tests use the public [SauceDemo](https://www.saucedemo.com/) store.

## Coverage

| Area | What the tests check | Why it matters |
| --- | --- | --- |
| Login | Valid access and an invalid-password error | Users need clear, reliable access to the store. |
| Cart | An added product appears in the cart | A missing item can prevent checkout. |
| Checkout review | Two item prices, their subtotal, and total = subtotal + tax | Incorrect charges have direct customer impact. |
| Order completion | Confirmation, PDF download, and return to Products | Customers need evidence of a completed order and a way back to shopping. |
| Navigation | The All Items menu option returns from the cart to Products | Customers should be able to recover their place in the store. |

The checkout total receives a stronger assertion than a simple visibility check because a displayed but incorrect price is still a defect. This is a small example of risk-based test selection.

## Run locally

```bash
npm ci
npx playwright install chromium
npm test
```

To generate a dated HTML report, run `npm run test:report`.

To look for intermittent failures, run `npm run test:stability`. It runs each test 10 times with three workers and no retries. Set `STABILITY_WORKERS` to compare a different level of parallelism, for example `STABILITY_WORKERS=1 npm run test:stability`. Reports are saved under `playwright-reports/` and are excluded from Git.

## Continuous integration

The GitHub Actions workflow runs the tests on pushes and pull requests. A failing test fails the workflow, and the HTML report is uploaded as an artifact for investigation. This provides a basic quality gate for changes to this portfolio.

## Scope

SauceDemo is an external demo site, so changes or outages there can affect these tests. The suite currently covers browser UI behavior; API and mobile automation are future modules.
