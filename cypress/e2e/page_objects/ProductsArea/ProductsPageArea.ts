import { mapping_products } from './mapping_products';

/**
 * Page Object for the "All Products" page (/products).
 */
export class ProductsPage {
    /**
     * Opens the products listing page.
     */
    visit(): this {
        cy.visit('/products');

        return this;
    }

    /**
     * Types a search term and clicks the search button.
     * @param term - Search term.
     */
    searchProduct(term: string): this {
        cy.get(mapping_products.inputs.search_input)
            .type(term);
        cy.get(mapping_products.buttons.search_button)
            .click();

        return this;
    }

    /**
     * Verifies that the "Searched Products" heading is shown after a search,
     * confirming the search actually executed (not asserting on individual
     * product names, since the site's search can return category-related
     * items whose titles don't literally contain the search term).
     */
    verifySearchResultsHeadingVisible(): this {
        cy.get(mapping_products.elements.product_title)
            .should('be.visible')
            .invoke('text')
            .should('match', /searched products/i);

        return this;
    }

    /**
     * Verifies that at least one product is displayed on the page.
     */
    verifyProductsDisplayed(): this {
        cy.get(mapping_products.elements.product_info_text)
            .should('have.length.greaterThan', 0);

        return this;
    }

    /**
     * Verifies the number of products displayed on the page.
     * @param expectedCount - Expected number of products.
     */
    verifyProductCount(expectedCount: number): this {
        cy.get(mapping_products.elements.product_info_text)
            .should('have.length', expectedCount);

        return this;
    }

    /**
     * Adds a product to the cart by its index in the list (hover + click "Add to cart").
     * Uses .first() because a product card can contain more than one element
     * matching the "Add to cart" selector (e.g. a hover overlay button plus
     * a second one elsewhere in the same card markup).
     * @param index - Index of the product in the list (0-based).
     */
    addProductToCartByIndex(index: number): this {
        cy.get(mapping_products.elements.product_items).eq(index).trigger('mouseover');
        cy.get(mapping_products.elements.product_items)
            .eq(index)
            .find(mapping_products.buttons.add_to_cart_button)
            .first()
            .click({ force: true });

        return this;
    }

    /**
     * Clicks "Continue Shopping" in the modal shown after adding a product.
     */
    continueShoppingFromModal(): this {
        cy.get(mapping_products.buttons.continue_shopping_button)
            .click();

        return this;
    }

    /**
     * Navigates to the cart via the "View Cart" link in the modal.
     */
    goToCartFromModal(): this {
        cy.get(mapping_products.elements.modal_view_cart_link)
            .click();

        return this;
    }

    /**
     * Selects the first category in the sidebar.
     */
    selectFirstCategory(): this {
        cy.get(mapping_products.elements.category_panel_link)
            .first()
            .click();

        return this;
    }

    /**
     * Verifies that product titles are rendered (used after navigating into
     * a category to confirm the product list loaded).
     */
    verifyProductTitlesVisible(): this {
        cy.get(mapping_products.elements.product_title)
            .should('be.visible');

        return this;
    }
}

export const productsPage = new ProductsPage();