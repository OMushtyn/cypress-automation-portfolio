import { mapping_cart } from './mapping_cart';

/**
 * Page Object for the cart page (/view_cart).
 */
export class CartArea {
    /**
     * Verifies the number of rows (products) in the cart table.
     * @param expectedRows - Expected number of rows.
     */
    verifyCartRowCount(expectedRows: number): this {
        cy.get(mapping_cart.elements.cart_row)
            .should('have.length', expectedRows);

        return this;
    }

    /**
     * Verifies that the cart contains exactly the products whose names were
     * saved earlier as aliases: same names, no extra or missing rows, all distinct.
     * The comparison ignores order.
     * @param aliases - Alias names without "@", saved by rememberProductNameByIndex.
     */
    verifyCartProductNamesMatchAliases(aliases: readonly string[]): this {
        const expectedNames: string[] = [];

        aliases.forEach((alias) => {
            cy.get<string>(`@${alias}`).then((name) => {
                expectedNames.push(name);
            });
        });
        cy.get(mapping_cart.elements.cart_product_name)
            .should(($names) => {
                const actualNames = $names.toArray().map((el) => Cypress.$(el).text().trim());

                expect(new Set(expectedNames).size, 'distinct remembered names').to.eq(aliases.length);
                expect(actualNames.sort()).to.deep.equal([...expectedNames].sort());
            });

        return this;
    }

    /**
     * Verifies the displayed quantity of a product in the cart.
     * Uses an exact text match (the quantity button has no surrounding
     * whitespace), so "1" does not pass for "10" or "11".
     * @param expectedQuantity - Expected quantity.
     */
    verifyItemQuantity(expectedQuantity: number): this {
        cy.get(mapping_cart.buttons.quantity_button)
            .should('have.text', String(expectedQuantity));

        return this;
    }

    /**
     * Verifies that the row total equals the row price multiplied by the quantity.
     * Works on a cart with exactly one row: both cells are checked to be single,
     * so prices of several rows are never concatenated into one string.
     * Amounts are parsed with a strict "Rs. <integer>" pattern (the site shows
     * whole rupees without thousands separators), so a format change fails the
     * test instead of silently producing NaN.
     * Price and total are read in one .should() callback, so Cypress retries
     * the whole check together and never compares a total with a stale price.
     * The total cell is looked up from the price element's <body> because the
     * mapping selectors are absolute (prefixed with the table id), so they
     * cannot be used with .find() inside a row.
     * @param expectedQuantity - Quantity the price is multiplied by.
     */
    verifyRowTotalEqualsPriceTimesQuantity(expectedQuantity: number): this {
        const parseRupees = (text: string): number => {
            const match = text.trim().match(/^Rs\.\s*(-?\d+)$/);

            expect(match, `amount format of "${text.trim()}"`).to.not.be.null;

            return Number(match![1]);
        };

        cy.get(mapping_cart.elements.cart_price)
            .should(($price) => {
                const $total = $price.closest('body').find(mapping_cart.elements.cart_total_price);

                expect($price, 'price cells').to.have.length(1);
                expect($total, 'total cells').to.have.length(1);

                const price = parseRupees($price.text());

                expect(parseRupees($total.text()), 'row total').to.eq(price * expectedQuantity);
            });

        return this;
    }

    /**
     * Removes the product in the first cart row.
     * Uses .first() because every cart row has its own delete icon, so only
     * the first one is clicked.
     */
    deleteFirstItem(): this {
        cy.get(mapping_cart.buttons.delete_button)
            .first()
            .click();

        return this;
    }

    /**
     * Clicks the "Proceed To Checkout" button.
     */
    proceedToCheckout(): this {
        cy.get(mapping_cart.buttons.checkout_button)
            .click();

        return this;
    }

    /**
     * Verifies that a guest who clicks "Proceed To Checkout" is asked to log in.
     * This demo site does not redirect guests: it stays on /view_cart and shows
     * the "Checkout" modal with a "Register / Login" link to /login.
     */
    verifyLoginPromptShownForGuestCheckout(): this {
        cy.get(mapping_cart.elements.checkout_modal)
            .should('be.visible');
        cy.get(mapping_cart.elements.checkout_modal_login_link)
            .should('be.visible')
            .and('have.attr', 'href', '/login');

        return this;
    }
}

export const cartPage = new CartArea();
