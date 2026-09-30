# Bug reports

Defects of [automationexercise.com](https://automationexercise.com) found by manual exploratory testing and the automated test suite.

## Summary

| ID | Title | Severity | Priority | Reproducibility | Found | Status |
|---|---|---|---|---|---|---|
| [BUG-001](#bug-001) | Cart accepts a negative quantity from the product page and shows a negative total | Major | High | 3/3 runs | 2026-09-30 | Open |

## Reports

### BUG-001

**Cart accepts a negative quantity from the product page and shows a negative total**

- **Environment:** https://automationexercise.com, Chrome 151, Ubuntu, 2026-09-30, found during manual exploratory testing
- **Preconditions:** guest user; the cart is empty
- **Steps to reproduce:**
  1. Open https://automationexercise.com/product_details/1 (Blue Top, Rs. 500)
  2. Clear the Quantity field and enter `-3`
  3. Click "Add to cart"
  4. In the modal, click "View Cart"
- **Expected result:** a quantity below 1 is rejected: the Quantity field has `min="1"`, so the product is not added and the user sees a validation message (or the quantity is corrected to a valid value)
- **Actual result:** the modal "Added! Your product has been added to cart." is shown; the cart contains Blue Top with quantity `-3` and total `Rs. -1500`
- **Reproducibility:** 3/3 runs
- **Severity:** Major
- **Priority:** High
- **Attachments:** see PR description
- **Related test:** none yet; covers TC-CART-010 in [docs/test-plan.md](test-plan.md)
- **Notes:** the Quantity input is `<input type="number" min="1">`, but "Add to cart" is `<button type="button">`: the form is not submitted, so the browser's `min` validation never runs, and the server accepts the value as is. Validation is needed on the server side (and ideally on the client before sending).
