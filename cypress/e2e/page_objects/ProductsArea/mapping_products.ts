export const mapping_products = {
    inputs: {
        search_input: '#search_product',
    },
    buttons: {
        search_button: '#submit_search',
        add_to_cart_button: '.add-to-cart',
        continue_shopping_button: '.modal-content .btn-success',
    },
    elements: {
        product_items: '.features_items .product-image-wrapper',
        product_info_text: '.features_items .productinfo p',
        product_title: '.features_items .title',
        category_panel_link: '.left-sidebar .panel-title a',
        modal_view_cart_link: '.modal-content a[href="/view_cart"]',
    },
} as const;
