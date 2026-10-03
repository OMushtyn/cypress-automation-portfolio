# Cypress Automation Portfolio

E2E UI test automation for the public demo e-commerce site https://automationexercise.com.
Stack: Cypress 13 + TypeScript, Page Object Model, GitHub Actions CI.
The code is stable and green in CI — changes must keep the existing style and must not break existing tests.


## Structure
- `cypress/e2e/<Feature>/` — one folder per feature: `test_<feature>.spec.ts` + its `data.ts`
- `cypress/e2e/page_objects/<Name>Area/` — `<Name>PageArea.ts` (page object) + `mapping_<name>.ts` (selectors)
- `cypress/support/e2e.ts` — global config, runs before every spec
- `.github/workflows/cypress.yml` — CI pipeline


## Code conventions (MUST follow)

### Page objects
- File: `<Name>PageArea.ts`; class: `<Name>Area` (e.g. `CartArea`); export a ready instance at the bottom: `export const cartPage = new CartArea();`
- Every method returns `this` so calls can be chained
- Action methods are named as verbs (`searchProduct`, `clickSignupButton`); assertion methods start with `verify` (`verifyProductsDisplayed`)
- Every method has a TSDoc comment (`/** ... */`, `@param name - description`); non-obvious decisions (e.g. `.first()`, `{ force: true }`) are explained in that comment
- Selectors are never written inside page objects — always taken from the mapping file

### Selectors (mapping files)
- `export const mapping_<name> = { inputs: {...}, buttons: {...}, elements: {...} } as const;`
- Keys in snake_case (`search_input`, `add_to_cart_button`)
- Links (`<a>`) go into `elements`, buttons (`<button>`, clickable controls) into `buttons`

### Test data
- `export const data = { dataProvider: { ... } };` in the feature's `data.ts`
- No hardcoded test values inside specs
- Data that must be unique per run is generated in `data.ts` (see `Registration/data.ts`)

### Specs
- File: `test_<feature>.spec.ts` (the `specPattern` in `cypress.config.ts` only picks up this pattern)
- Import the page object instance and `data`; open the page in `beforeEach`
- Test titles describe the expected behaviour, usually as `should ...`; end-to-end scenarios may use a `full flow: ...` title
- Specs read as chains of page object calls, not raw `cy.get`

### General
- Never use `cy.wait(<number>)` — wait for elements or use `cy.intercept` + alias
- 4-space indentation

### Method style (follow the reference files)
- A page object method is a short chain of Cypress commands: one action or one check
- TSDoc: one sentence, plus `@param` lines; explain non-obvious decisions in one extra sentence at most
- No helper functions, parsing or calculations inside page object methods — put reusable helpers in `cypress/support/utils.ts` and import them
- Prefer `cy.get(...)` chains; avoid direct jQuery manipulation (`.closest()`, `.find()` on jQuery objects) unless a comment explains why it is needed

### Assertions
- Prefer strict checks: `.invoke('text').invoke('trim').should('equal', expected)`
- For strings with irregular whitespace: `.then((t) => expect(t.trim().replace(/\s+/g, ' ')).to.equal(expected))`
- Expected values always come from `data.ts`
- No hardcoded dates or times — generate them dynamically

### Network waits
- If an action triggers a request the test must wait for, break the chain: action → `cy.wait('@alias')` right after it → then `verify...`
- Register `cy.intercept` before the action that triggers the request

## Reference files (copy their style)
- Page object: `cypress/e2e/page_objects/ProductsArea/ProductsPageArea.ts`
- Selectors: `cypress/e2e/page_objects/ProductsArea/mapping_products.ts`
- Spec: `cypress/e2e/ProductSearch/test_product_search.spec.ts`
- Data: `cypress/e2e/ProductSearch/data.ts`

## Known specifics (do NOT change without asking)
- Registration tests assert exact native browser validation messages in Ukrainian. Chrome's UI language is pinned via `--lang=uk-UA` in `cypress.config.ts` (`before:browser:launch`), and CI installs `language-pack-uk` and sets locale env vars. Do not remove or change either.
- `cypress/support/e2e.ts` suppresses `uncaught:exception` globally because the demo site throws third-party script errors. Keep it.
- `retries.runMode` is 1, which can hide flaky tests. To run without retries, add `--config '{"e2e":{"retries":0}}'`. `--config retries=0` does not work here, because retries are set inside the `e2e` block of `cypress.config.ts`.
- Always run tests in Chrome (`--browser chrome` or `npm run cy:run:chrome`) — the Ukrainian locale pin works only there, same as in CI.

## Commands
- All tests (Chrome, same as CI): `npm run cy:run:chrome`
- One spec: `npx cypress run --browser chrome --spec "cypress/e2e/<Feature>/test_<feature>.spec.ts"`
- Type check: `npx tsc --noEmit`

## Working rules
- Show a plan before changing code and wait for confirmation
- After changes, run the affected specs and `npx tsc --noEmit`
- Do not modify existing tests or page objects unless explicitly asked; search for an existing page object before creating a new one
- Do not touch `.github/workflows/`, `.env` or other secrets