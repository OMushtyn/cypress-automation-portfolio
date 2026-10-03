export const mapping_cart = {
    buttons: {
        quantity_button: '.cart_quantity button',
        delete_button: '.cart_quantity_delete',
        checkout_button: '.btn.check_out',
    },
    elements: {
        cart_row: '#cart_info_table tbody tr',
        cart_product_name: '#cart_info_table .cart_description h4 a',
        cart_price: '#cart_info_table .cart_price p',
        cart_total_price: '#cart_info_table .cart_total_price',
        checkout_modal: '#checkoutModal',
        checkout_modal_login_link: '#checkoutModal a[href="/login"]',
    },
} as const;

