# Cypress Automation Portfolio

![Cypress](https://img.shields.io/badge/Cypress-13.6-17202C?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![CI](https://github.com/OMushtyn/cypress-automation-portfolio/actions/workflows/cypress.yml/badge.svg)

End-to-end UI test automation framework built with **Cypress**, targeting a public demo e-commerce site ([automationexercise.com](https://automationexercise.com)), structured around the Page Object Model.

## Why this project

Since production code and business logic from my current QA role are covered by an NDA, this portfolio demonstrates the same automation skill set — Cypress, Page Object Model, maintainable test structure — on a public site, in the open.

## Tech Stack

- **Cypress** — E2E test execution
- **TypeScript** — statically typed test code, page objects, and configuration
- **Page Object Model (POM)** — selectors and page actions encapsulated in dedicated classes, separate from test specs
- **JavaScript (Mocha/Chai syntax)** — test assertion syntax (via Cypress, compiled from TypeScript)
- **GitHub Actions** — CI pipeline, tests run automatically on every push
- **Colocated test data (`*.data.ts`)** — each spec's input values and expected results live in a `dataProvider` object next to the spec, kept separate from test logic

## Project Structure

```
cypress-automation-portfolio/
├── cypress/
│   ├── e2e/
│   │   ├── Registration/
│   │   │   ├── data.ts
│   │   │   └── test_registration.spec.ts
│   │   ├── ProductSearch/
│   │   │   ├── data.ts
│   │   │   └── test_product_search.spec.ts
│   │   ├── CartCheckout/
│   │   │   ├── data.ts
│   │   │   └── test_cart_checkout.spec.ts
│   │   └── page_objects/
│   │       ├── RegistrationArea/
│   │       │   ├── RegistrationPageArea.ts
│   │       │   └── mapping_registration.ts
│   │       ├── ProductsArea/
│   │       │   ├── ProductsPageArea.ts
│   │       │   └── mapping_products.ts
│   │       └── CartArea/
│   │           ├── CartPageArea.ts
│   │           └── mapping_cart.ts
│   └── support/
│       └── e2e.ts           # Global test config (runs before every spec)
├── .github/workflows/       # CI pipeline (GitHub Actions)
├── cypress.config.ts
├── tsconfig.json
└── package.json
```

Each feature gets its own folder under `e2e/`, with the spec and its `data.ts` colocated. Page Objects live in a sibling `page_objects/` folder inside `e2e/`, grouped the same way — one folder per feature area, each holding its `*Area.ts` class and sibling `mapping_*.ts` selectors file.

### Why Page Object Model

Each `*Area.ts` class owns the actions and assertions for its page, while its sibling `mapping_*.ts` file holds only the selectors. Specs call chainable methods (e.g. `productsPageArea.searchProduct(term).verifySearchResultsContain(term)`) and read like a sequence of business actions rather than raw DOM queries. If the site's markup changes, only the mapping file needs an update — no hunting through test files.

## Site under test

[automationexercise.com](https://automationexercise.com) — a public demo e-commerce site used widely for automation practice.

## What's covered

- User registration form validation (positive & negative cases)
- Product search, including empty-result handling
- Cart management: add, add multiple, remove
- Full flow: search → add to cart → checkout

## Getting Started

```bash
# clone the repository
git clone https://github.com/OMushtyn/cypress-automation-portfolio.git
cd cypress-automation-portfolio

# install dependencies
npm install

# open Cypress Test Runner (interactive mode)
npm run cy:open

# run all tests headlessly
npm run cy:run
```

## CI/CD

Every push to `main` triggers an automated test run via GitHub Actions. Failed runs upload screenshots as build artifacts for debugging.

## Author

**Olha Mushtyn** — QA Engineer (Manual & Automation)
[LinkedIn](https://linkedin.com/in/olha-mushtyn)
