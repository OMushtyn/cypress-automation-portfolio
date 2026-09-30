import { mapping_products } from './mapping_products';

/**
 * Page Object for the "All Products" page (/products).
 */
export class ProductsArea {
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
        cy.get(mapping_products.elements.section_title)
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
     * Uses { force: true } because the "Add to cart" button is only visible on
     * hover, and Cypress does not hold a real hover state.
     * Uses .eq(index) because the product is picked by its position from the
     * test data.
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
     * Saves the trimmed name of the product at the given index as a static alias,
     * so it can be compared later on another page (e.g. the cart).
     * Uses .eq(index) because the product is chosen by its position in the list
     * (same as addProductToCartByIndex). The alias is static because Cypress 12+
     * re-runs query aliases on access, and the product list is not on /view_cart.
     * @param index - Index of the product in the list (0-based).
     * @param alias - Alias name without "@".
     */
    rememberProductNameByIndex(index: number, alias: string): this {
        cy.get(mapping_products.elements.product_info_text)
            .eq(index)
            .invoke('text')
            .then((name) => name.trim())
            .as(alias, { type: 'static' });

        return this;
    }

    /**
     * Expands the "Women" sidebar panel and opens its "Dress" subcategory.
     * The panel title is only an accordion toggle, so the subcategory link
     * inside the expanded panel must be clicked to actually filter.
     */
    selectWomenDressCategory(): this {
        cy.get(mapping_products.elements.category_toggle_women)
            .click();
        cy.get(mapping_products.elements.category_link_women_dress)
            .click();

        return this;
    }

    /**
     * Verifies that the category page is open: exact URL path and exact heading.
     * @param expectedPath - Expected URL pathname (e.g. "/category_products/1").
     * @param expectedHeading - Expected heading text (e.g. "Women - Dress Products").
     */
    verifyCategoryPageShown(expectedPath: string, expectedHeading: string): this {
        cy.location('pathname')
            .should('eq', expectedPath);
        cy.get(mapping_products.elements.section_title)
            .should('have.text', expectedHeading);

        return this;
    }

    /**
     * Verifies that at least one product is listed and every product name
     * matches the pattern (proves the list is filtered, not the full catalogue).
     * @param pattern - Pattern every product name must match.
     */
    verifyAllProductNamesMatch(pattern: RegExp): this {
        cy.get(mapping_products.elements.product_info_text)
            .should('have.length.greaterThan', 0)
            .each(($name) => {
                expect($name.text().trim()).to.match(pattern);
            });

        return this;
    }
}

export const productsPage = new ProductsArea();
