import { productsPage } from '../page_objects/ProductsArea/ProductsPageArea';
import { cartPage } from '../page_objects/CartArea/CartPageArea';
import { data } from './data';

describe('Cart and Checkout Flow', () => {
    beforeEach(() => {
        productsPage.visit();
    });

    it('should add a single product to the cart and reflect correct quantity', () => {
        const testData = data.dataProvider;

        productsPage
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .verifyItemQuantity(testData.expectedSingleItemCount);
    });

    it('should add multiple different products and show them all in the cart', () => {
        const testData = data.dataProvider;

        productsPage
            .addProductToCartByIndex(testData.firstProductIndex)
            .continueShoppingFromModal()
            .addProductToCartByIndex(testData.secondProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedTwoItemsCount);
    });

    it('should allow removing a product from the cart', () => {
        const testData = data.dataProvider;

        productsPage
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .deleteFirstItem()
            .verifyCartRowCount(testData.expectedEmptyCartCount);
    });

    it('full flow: search product, add to cart, proceed to checkout as guest', () => {
        const testData = data.dataProvider;

        productsPage
            .searchProduct(testData.searchTermForCheckoutFlow)
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .proceedToCheckout()
            .verifyLoginPromptShownForGuestCheckout();
    });
});
