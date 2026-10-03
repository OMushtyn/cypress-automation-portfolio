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
            .rememberProductNameByIndex(testData.firstProductIndex, testData.firstProductNameAlias)
            .addProductToCartByIndex(testData.firstProductIndex)
            .continueShoppingFromModal()
            .rememberProductNameByIndex(testData.secondProductIndex, testData.secondProductNameAlias)
            .addProductToCartByIndex(testData.secondProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedTwoItemsCount)
            .verifyCartProductNamesMatchAliases([
                testData.firstProductNameAlias,
                testData.secondProductNameAlias,
            ]);
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

    it('should increase the quantity to 2 when the same product is added twice', () => {
        const testData = data.dataProvider;

        productsPage
            .addProductToCartByIndex(testData.firstProductIndex)
            .continueShoppingFromModal()
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .verifyItemQuantity(testData.expectedQuantityAfterAddingTwice);
    });

    it('should show a row total equal to the price multiplied by the quantity', () => {
        const testData = data.dataProvider;

        productsPage
            .addProductToCartByIndex(testData.firstProductIndex)
            .continueShoppingFromModal()
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .verifyItemQuantity(testData.expectedQuantityAfterAddingTwice)
            .verifyRowTotalEqualsPriceTimesQuantity(testData.expectedQuantityAfterAddingTwice);
    });

    it('should show the empty cart message with a link to products when the cart is empty', () => {
        const testData = data.dataProvider.emptyCart;

        cartPage
            .visit()
            .verifyEmptyCartShown(testData.message, testData.linkText, testData.linkPath);
    });

    it('should keep the other product when one of two products is removed', () => {
        const testData = data.dataProvider;

        productsPage
            .rememberProductNameByIndex(testData.firstProductIndex, testData.firstProductNameAlias)
            .rememberProductIdByIndex(testData.firstProductIndex, testData.firstProductIdAlias)
            .addProductToCartByIndex(testData.firstProductIndex)
            .continueShoppingFromModal()
            .rememberProductNameByIndex(testData.secondProductIndex, testData.secondProductNameAlias)
            .addProductToCartByIndex(testData.secondProductIndex)
            .goToCartFromModal();

        cartPage
            .verifyCartRowCount(testData.expectedTwoItemsCount)
            .interceptDeleteRequest(testData.deleteCartRequestAlias)
            .deleteFirstItem()
            .verifyDeleteRequestSucceeded(testData.deleteCartRequestAlias, testData.firstProductIdAlias)
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .verifyCartProductNamesMatchAliases([testData.secondProductNameAlias]);
    });

    it('should keep the cart contents after a page reload', () => {
        const testData = data.dataProvider;

        productsPage
            .rememberProductNameByIndex(testData.firstProductIndex, testData.firstProductNameAlias)
            .addProductToCartByIndex(testData.firstProductIndex)
            .goToCartFromModal();

        cartPage
            .reloadPage()
            .verifyCartRowCount(testData.expectedSingleItemCount)
            .verifyCartProductNamesMatchAliases([testData.firstProductNameAlias])
            .verifyItemQuantity(testData.expectedSingleItemCount);
    });
});
