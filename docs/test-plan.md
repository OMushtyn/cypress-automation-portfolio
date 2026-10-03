# Test plan

Feature test plans for [automationexercise.com](https://automationexercise.com).

## Feature codes

| Code | Feature |
|---|---|
| REG | Registration |
| SRCH | ProductSearch |
| CART | CartCheckout |

## Features

### CartCheckout

**Status:** Approved

**Scope**
- In scope: adding products to the cart from the product list and from the product details page, the modal shown after adding, cart contents (quantity, price, total), removing items, the empty cart, cart persistence, proceeding to checkout as a guest (login prompt), checkout for a logged-in user (address, order review, payment, confirmation).
- Out of scope: registration (separate feature REG); product search (SRCH); invoice download (file check, low priority); a real payment gateway (the demo site accepts any card data); footer newsletter subscription.

**Risks**
- Product risks: wrong quantity or total in the cart; cart lost after reload or login; a guest being able to order without logging in; an order placed with empty payment data; unexpected handling of invalid quantities (0, negative, non-numeric, huge) on the product details page.
- Automation risks: the "Add to cart" button appears on hover (needs `.first()`/`force`); the modal is animated; third-party ad overlays; product order and content on the demo site can change (a product index is not stable); the guest cart lives in the session, so every test must start from a clean state; cases for a logged-in user need an existing account in test data (creating it through the UI is slow and depends on REG).
- Assumptions: the checkout, payment and confirmation pages, the product details Quantity input constraints and the behaviour after login were not verified via WebFetch (they need authentication or the HTML attributes were not visible). Expected results for TC-CART-009..013 and TC-CART-019..022 are therefore assumptions and need an exploratory check on the site first. The empty cart shows "Cart is empty!" with a link to /products (verified via WebFetch).
- Technique note: only the five techniques from the test design guidelines are used. End-to-end flows are described as State transition.

**Test cases**

Statuses: Covered / Partial / Missing. User state: G = guest, U = logged-in user.

| ID | Title | Technique | Type | Priority | Automate | Status |
|---|---|---|---|---|---|---|
| [TC-CART-001](#tc-cart-001) | Guest adds one product, the cart has one row with quantity 1 | State transition | Positive | High | Yes | Covered |
| [TC-CART-002](#tc-cart-002) | Guest adds two different products, both are in the cart | State transition | Positive | High | Yes | Covered |
| [TC-CART-003](#tc-cart-003) | Guest removes the only product, the cart is empty | State transition | Positive | High | Yes | Covered |
| [TC-CART-004](#tc-cart-004) | Guest clicks Proceed To Checkout and sees the login prompt | State transition | Positive | High | Yes | Covered |
| [TC-CART-005](#tc-cart-005) | Empty cart shows "Cart is empty!" with a link to products | State transition | Positive | Medium | Yes | Missing |
| [TC-CART-006](#tc-cart-006) | Adding the same product twice increases the quantity to 2 | Error guessing | Positive | High | Yes | Covered |
| [TC-CART-007](#tc-cart-007) | Product page: quantity 3 (typical valid value) is shown in the cart | Equivalence partitioning | Positive | Medium | Yes | Missing |
| [TC-CART-008](#tc-cart-008) | Product page: quantity 1 (minimum valid value) is shown in the cart | Boundary value analysis | Boundary | Medium | Yes | Missing |
| [TC-CART-009](#tc-cart-009) | Product page: quantity 0 (just below minimum) is handled | Boundary value analysis | Negative | Medium | No | Missing |
| [TC-CART-010](#tc-cart-010) | Product page: negative quantity is handled | Boundary value analysis | Negative | Medium | No | Missing |
| [TC-CART-011](#tc-cart-011) | Product page: very large quantity is handled | Error guessing | Boundary | Low | No | Missing |
| [TC-CART-012](#tc-cart-012) | Product page: non-numeric quantity is handled | Equivalence partitioning | Negative | Medium | No | Missing |
| [TC-CART-013](#tc-cart-013) | Product page: empty quantity is handled | Equivalence partitioning | Negative | Medium | No | Missing |
| [TC-CART-014](#tc-cart-014) | Row total equals price multiplied by quantity | Equivalence partitioning | Positive | High | Yes | Covered |
| [TC-CART-015](#tc-cart-015) | Removing one of two products keeps the other | State transition | Positive | Medium | Yes | Missing |
| [TC-CART-016](#tc-cart-016) | Cart is preserved after a page reload | Error guessing | Positive | Medium | Yes | Missing |
| [TC-CART-017](#tc-cart-017) | The Register / Login link in the checkout modal leads to /login | State transition | Positive | Medium | Yes | Partial |
| [TC-CART-018](#tc-cart-018) | Continue Shopping closes the modal and stays on the products page | State transition | Positive | Low | Yes | Partial |
| [TC-CART-019](#tc-cart-019) | Logged-in user sees address and order review on checkout | State transition | Positive | High | No | Missing |
| [TC-CART-020](#tc-cart-020) | Logged-in user places an order with valid card data | State transition | Positive | High | No | Missing |
| [TC-CART-021](#tc-cart-021) | Payment with empty card fields is not submitted | Equivalence partitioning | Negative | High | No | Missing |
| [TC-CART-022](#tc-cart-022) | A product added by a guest stays in the cart after login | State transition | Positive | Medium | No | Missing |

**Test case details**

#### TC-CART-001

**Guest adds one product, the cart has one row with quantity 1**

- **Preconditions:** guest (G); the /products page is open
- **Steps:**
  1. Hover over the first product and click "Add to cart"
  2. In the modal click "View Cart"
- **Test data:** product index 0
- **Expected result:** the cart table has exactly 1 row and the quantity is exactly "1"
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should add a single product to the cart and reflect correct quantity"

#### TC-CART-002

**Guest adds two different products, both are in the cart**

- **Preconditions:** guest (G); the /products page is open
- **Steps:**
  1. Add the first product, click "Continue Shopping" in the modal
  2. Add the second product, click "View Cart"
- **Test data:** product indexes 0 and 1
- **Expected result:** the cart has 2 rows and the product names match the two added products
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should add multiple different products and show them all in the cart"

#### TC-CART-003

**Guest removes the only product, the cart is empty**

- **Preconditions:** guest (G); the /products page is open (the product is added inside the test)
- **Steps:**
  1. Add the first product and open the cart
  2. Click the delete icon in the product row
- **Test data:** product index 0
- **Expected result:** the cart table has 0 rows
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should allow removing a product from the cart"

#### TC-CART-004

**Guest clicks Proceed To Checkout and sees the login prompt**

- **Preconditions:** guest (G); the /products page is open
- **Steps:**
  1. Search for a product, add it to the cart, open the cart
  2. Click "Proceed To Checkout"
- **Test data:** search term `Top`, product index 0
- **Expected result:** the page stays on /view_cart; the "Checkout" modal is visible with a "Register / Login" link (href `/login`)
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "full flow: search product, add to cart, proceed to checkout as guest"

#### TC-CART-005

**Empty cart shows "Cart is empty!" with a link to products**

- **Preconditions:** guest (G); the cart is empty (new session)
- **Steps:**
  1. Open /view_cart
- **Test data:** —
- **Expected result:** the text "Cart is empty!" and a "here" link to /products are visible; there is no product table
- **Covered by:** —

#### TC-CART-006

**Adding the same product twice increases the quantity to 2**

- **Preconditions:** guest (G); the /products page is open
- **Steps:**
  1. Add the first product, click "Continue Shopping"
  2. Add the same product again, click "View Cart"
- **Test data:** product index 0, twice
- **Expected result:** the cart has 1 row and the quantity is exactly "2"
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should increase the quantity to 2 when the same product is added twice"

#### TC-CART-007

**Product page: quantity 3 (typical valid value) is shown in the cart**

- **Preconditions:** guest (G); the details page of the first product is open (/product_details/1)
- **Steps:**
  1. Clear the Quantity field and enter the value
  2. Click "Add to cart", then "View Cart"
- **Test data:** quantity `3`
- **Expected result:** the cart has 1 row and the quantity is exactly "3"
- **Covered by:** —

#### TC-CART-008

**Product page: quantity 1 (minimum valid value) is shown in the cart**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and enter the value
  2. Click "Add to cart", then "View Cart"
- **Test data:** quantity `1`
- **Expected result:** the cart has 1 row and the quantity is exactly "1"
- **Covered by:** —

#### TC-CART-009

**Product page: quantity 0 (just below minimum) is handled**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and enter the value
  2. Click "Add to cart"
- **Test data:** quantity `0`
- **Expected result:** unknown. Assumption: the value is rejected (validation message or nothing added) or replaced by a valid quantity. The exact behaviour must be established first.
- **Covered by:** —

#### TC-CART-010

**Product page: negative quantity is handled**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and enter the value
  2. Click "Add to cart"
- **Test data:** quantity `-1`
- **Expected result:** a negative quantity is rejected (the field has `min="1"`): the product is not added and a validation message is shown. Actual behaviour differs — see [BUG-001](bug-reports.md#bug-001)
- **Covered by:** —

#### TC-CART-011

**Product page: very large quantity is handled**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and enter the value
  2. Click "Add to cart", then "View Cart"
- **Test data:** quantity `999999`. No maximum is documented, so this is a robustness check, not a boundary of a known range.
- **Expected result:** unknown. Assumption: the site either accepts the value and shows it or rejects it, without an error page. The exact behaviour must be established first.
- **Covered by:** —

#### TC-CART-012

**Product page: non-numeric quantity is handled**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and try to enter the value
  2. Click "Add to cart"
- **Test data:** quantity `abc`
- **Expected result:** unknown. Assumption: the field does not accept letters or the value is rejected. The exact behaviour must be established first (it depends on the input type, which was not visible).
- **Covered by:** —

#### TC-CART-013

**Product page: empty quantity is handled**

- **Preconditions:** guest (G); /product_details/1 is open
- **Steps:**
  1. Clear the Quantity field and leave it empty
  2. Click "Add to cart"
- **Test data:** quantity is empty
- **Expected result:** unknown. Assumption: the form is not submitted or the quantity falls back to 1. The exact behaviour must be established first.
- **Covered by:** —

#### TC-CART-014

**Row total equals price multiplied by quantity**

- **Preconditions:** guest (G); the /products page is open (the product is added twice inside the test)
- **Steps:**
  1. Add the first product twice and open the cart
  2. Read the price, quantity and row total
- **Test data:** product index 0, quantity 2 (class: quantity greater than 1)
- **Expected result:** the row total equals price × 2
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should show a row total equal to the price multiplied by the quantity"

#### TC-CART-015

**Removing one of two products keeps the other**

- **Preconditions:** guest (G); the /products page is open (two products are added inside the test)
- **Steps:**
  1. Add products 0 and 1 and open the cart
  2. Delete the first row
- **Test data:** product indexes 0 and 1
- **Expected result:** 1 row remains and it contains the name of the second product
- **Covered by:** —

#### TC-CART-016

**Cart is preserved after a page reload**

- **Preconditions:** guest (G); the /products page is open (the product is added inside the test)
- **Steps:**
  1. Add a product and open the cart
  2. Reload the page
- **Test data:** product index 0
- **Expected result:** the cart still has 1 row with the same product and quantity 1
- **Covered by:** —

#### TC-CART-017

**The Register / Login link in the checkout modal leads to /login**

- **Preconditions:** guest (G); the /products page is open (the product is added inside the test)
- **Steps:**
  1. Add a product, open the cart, click "Proceed To Checkout"
  2. Click "Register / Login" in the modal
- **Test data:** product index 0
- **Expected result:** the URL contains /login and the Login and Signup forms are visible
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "full flow: search product, add to cart, proceed to checkout as guest" (partial: only the href is checked; the click and the navigation are missing)

#### TC-CART-018

**Continue Shopping closes the modal and stays on the products page**

- **Preconditions:** guest (G); the /products page is open
- **Steps:**
  1. Add a product
  2. Click "Continue Shopping" in the modal
- **Test data:** product index 0
- **Expected result:** the modal is hidden and the URL is still /products
- **Covered by:** CartCheckout/test_cart_checkout.spec.ts — "should add multiple different products and show them all in the cart" (partial: the button is used as a step, but the modal closing and the URL are not asserted)

#### TC-CART-019

**Logged-in user sees address and order review on checkout**

- **Preconditions:** logged-in user (U); an existing registered account is required (prepare it in test data); one product is added inside the test
- **Steps:**
  1. Log in, add a product, open the cart
  2. Click "Proceed To Checkout"
- **Test data:** email and password of the existing account (from data.ts, not hardcoded in the spec); product index 0
- **Expected result:** /checkout opens; the delivery and billing address blocks show the account data; the order review lists the product; the Comment field and the "Place Order" button are visible (assumption, not verified)
- **Covered by:** —

#### TC-CART-020

**Logged-in user places an order with valid card data**

- **Preconditions:** logged-in user (U); an existing account is required; one product is added inside the test
- **Steps:**
  1. On checkout enter a comment and click "Place Order"
  2. Fill in the payment fields and click "Pay and Confirm Order"
- **Test data:** comment `Test order`; name on card `Test User`; number `4111111111111111`; CVC `123`; month `12`; year `2030`
- **Expected result:** /payment_done opens with "Order Placed!" and a "Continue" button; after "Continue" the cart is empty (assumption, not verified)
- **Covered by:** —

#### TC-CART-021

**Payment with empty card fields is not submitted**

- **Preconditions:** logged-in user (U); an existing account is required; one product is added inside the test; the /payment page is open
- **Steps:**
  1. Leave all card fields empty
  2. Click "Pay and Confirm Order"
- **Test data:** all fields empty
- **Expected result:** the form is not submitted, the first empty required field shows a native browser validation message and /payment_done does not open (assumption, not verified)
- **Covered by:** —

#### TC-CART-022

**A product added by a guest stays in the cart after login**

- **Preconditions:** a guest who then logs in (G to U); an existing account is required; the cart is empty
- **Steps:**
  1. Add a product, open the cart, click "Proceed To Checkout" and "Register / Login"
  2. Log in with the existing account
  3. Open the cart
- **Test data:** email and password of the existing account; product index 0
- **Expected result:** the added product is still in the cart (assumption, not verified)
- **Covered by:** —

**Notes**
- Automate = No (reason "needs exploratory check", the expected result is unknown or unverified on the site): TC-CART-009, 010, 011, 012, 013 (invalid quantity handling; the Quantity input type and constraints were not visible) and TC-CART-019, 020, 021, 022 (checkout, payment and login pages need authentication and were not inspected). After the exploratory check the expected results should be fixed and Automate switched to Yes.
- TC-CART-019..022 also need an existing account in test data.
- Independence: every case adds its own products and starts from a clean state; cases do not depend on each other.
- Existing quantity checks use an exact text match (commit "verify login prompt for guest checkout and exact cart quantity").
- The existing CartArea page object checks row count, quantity, product names and the row total of a single-row cart (`verifyRowTotalEqualsPriceTimesQuantity`); methods for totals of several rows, the empty cart, the product page quantity field, checkout and payment will be needed.
- TC-CART-014 tests one value from the class "quantity greater than 1"; the class "quantity equal to 1" is already checked by TC-CART-001.

**Coverage summary**

| Status | Count | Cases |
|---|---|---|
| Covered | 6 | 001, 002, 003, 004, 006, 014 |
| Partial | 2 | 017, 018 |
| Missing | 14 | 005, 007–013, 015, 016, 019–022 |
| Total | 22 | |

Automation split: Automate = Yes 13 cases (001–008, 014–018), Automate = No 9 cases (009–013, 019–022).

**Gaps by priority**

| Priority | Cases | What is missing |
|---|---|---|
| High | 019, 020, 021 | the whole checkout of a logged-in user (address, payment, confirmation, payment validation; these need an exploratory check first) |
| Medium | 005, 007, 008, 009, 010, 012, 013, 015, 016, 017, 022 | the empty cart, valid quantities from the product page, invalid quantity handling (exploratory), partial removal, cart persistence, the /login navigation, the cart after login |
| Low | 011, 018 | huge quantity handling (exploratory), modal closing check |
