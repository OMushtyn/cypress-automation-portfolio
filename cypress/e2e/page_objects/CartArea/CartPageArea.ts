import { mapping_cart } from './mapping_cart';
import { getTrimmedTexts, getUrlPathname, parseRupees, sortedCopy } from '../../../support/utils';

/**
 * Page Object for the cart page (/view_cart).
 */
export class CartArea {
    /**
     * Opens the cart page.
     */
    visit(): this {
        cy.visit('/view_cart');

        return this;
    }

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
     * Verifies that the cart contains exactly the remembered products, in any order.
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
                const actualNames = getTrimmedTexts($names);

                expect(new Set(expectedNames).size, 'distinct remembered names').to.eq(aliases.length);
                expect(sortedCopy(actualNames)).to.deep.equal(sortedCopy(expectedNames));
            });

        return this;
    }

    /**
     * Verifies the displayed quantity of the product in the cart.
     * @param expectedQuantity - Expected quantity.
     */
    verifyItemQuantity(expectedQuantity: number): this {
        cy.get(mapping_cart.buttons.quantity_button)
            .invoke('text')
            .invoke('trim')
            .should('equal', String(expectedQuantity));

        return this;
    }

    /**
     * Verifies that the only cart row's total equals its price multiplied by the quantity.
     * The total cell is looked up via .closest('body') because the mapping selectors
     * are absolute and cannot be used with .find() inside a row.
     * @param expectedQuantity - Quantity the price is multiplied by.
     */
    verifyRowTotalEqualsPriceTimesQuantity(expectedQuantity: number): this {
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
     * Uses .first() because every cart row has its own delete icon.
     */
    deleteFirstItem(): this {
        cy.get(mapping_cart.buttons.delete_button)
            .first()
            .click();

        return this;
    }

    /**
     * Registers an intercept for the cart delete request; call it before the delete click.
     * @param deletePath - Path prefix of the delete request (e.g. "/delete_cart/").
     * @param alias - Alias name without "@".
     */
    interceptDeleteRequest(deletePath: string, alias: string): this {
        cy.intercept('GET', `${deletePath}*`).as(alias);

        return this;
    }

    /**
     * Waits for the intercepted request with the given alias.
     * @param alias - Alias name without "@".
     */
    waitForRequest(alias: string): this {
        cy.wait(`@${alias}`);

        return this;
    }

    /**
     * Verifies that the waited delete request targeted the remembered product id.
     * @param requestAlias - Alias of the intercepted request, without "@".
     * @param deletePath - Path prefix of the delete request (e.g. "/delete_cart/").
     * @param productIdAlias - Alias of the expected product id, without "@", saved by rememberProductIdByIndex.
     */
    verifyDeleteRequestForProduct(requestAlias: string, deletePath: string, productIdAlias: string): this {
        cy.get<string>(`@${productIdAlias}`).then((productId) => {
            cy.get(`@${requestAlias}`)
                .its('request.url')
                .then(getUrlPathname)
                .should('equal', `${deletePath}${productId}`);
        });

        return this;
    }

    /**
     * Reloads the current page.
     */
    reloadPage(): this {
        cy.reload();

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
     * Verifies that the checkout modal with a login link is shown to a guest.
     * @param expectedLoginPath - Expected href of the "Register / Login" link (e.g. "/login").
     */
    verifyLoginPromptShownForGuestCheckout(expectedLoginPath: string): this {
        cy.get(mapping_cart.elements.checkout_modal)
            .should('be.visible');
        cy.get(mapping_cart.elements.checkout_modal_login_link)
            .should('be.visible')
            .and('have.attr', 'href', expectedLoginPath);

        return this;
    }

    /**
     * Verifies the empty cart message, the link to the products page and the absence of the cart table.
     * Meant for a page loaded with an empty cart, because deleting the last product only hides the table.
     * @param expectedMessage - Expected bold message text (e.g. "Cart is empty!").
     * @param expectedLinkText - Expected link text (e.g. "here").
     * @param expectedLinkPath - Expected link href (e.g. "/products").
     */
    verifyEmptyCartShown(expectedMessage: string, expectedLinkText: string, expectedLinkPath: string): this {
        cy.get(mapping_cart.elements.empty_cart_message)
            .should('be.visible')
            .invoke('text')
            .invoke('trim')
            .should('equal', expectedMessage);
        cy.get(mapping_cart.elements.empty_cart_products_link)
            .should('be.visible')
            .and('have.attr', 'href', expectedLinkPath);
        cy.get(mapping_cart.elements.empty_cart_products_link)
            .invoke('text')
            .invoke('trim')
            .should('equal', expectedLinkText);
        cy.get(mapping_cart.elements.cart_table)
            .should('not.exist');

        return this;
    }
}

export const cartPage = new CartArea();
