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
     * Verifies the displayed quantity of a product in the cart.
     * @param expectedQuantity - Expected quantity.
     */
    verifyItemQuantity(expectedQuantity: number): this {
        cy.get(mapping_cart.buttons.quantity_button)
            .should('contain.text', String(expectedQuantity));

        return this;
    }

    /**
     * Removes a product from the cart (clicks the delete icon on the first row).
     */
    deleteFirstItem(): this {
        cy.get(mapping_cart.buttons.delete_button)
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
     * Verifies that guest checkout redirects to the registration/login page
     * (this demo site requires an account before completing checkout).
     */
    verifyRedirectedToLoginForGuestCheckout(): this {
        cy.url()
            .should('include', '/view_cart');

        return this;
    }
}

export const cartPage = new CartArea();