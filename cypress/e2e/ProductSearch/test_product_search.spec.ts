import { productsPage } from '../page_objects/ProductsArea/ProductsPageArea';
import { data } from './data';

describe('Product Search', () => {
    beforeEach(() => {
        productsPage.visit();
    });

    it('should display search results when searching for an existing product', () => {
        const testData = data.dataProvider.existingSearchTerm;

        productsPage
            .searchProduct(testData)
            .verifySearchResultsHeadingVisible()
            .verifyProductsDisplayed();
    });

    it('should show no products for a nonsense search term', () => {
        const testData = data.dataProvider;

        productsPage
            .searchProduct(testData.nonExistentSearchTerm)
            .verifyProductCount(testData.expectedEmptySearchResultCount);
    });

    it('should filter products by category from the sidebar', () => {
        const testData = data.dataProvider.categoryFilter;

        productsPage
            .selectWomenDressCategory()
            .verifyCategoryPageShown(testData.path, testData.heading)
            .verifyAllProductNamesMatch(testData.productNamePattern);
    });
});
