<?php
/**
 * Plugin Name: Aurelo CORS
 * Description: Allows the React storefront to access WooCommerce APIs.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_filter( 'allowed_http_origins', function ( $origins ) {
    return array_merge( $origins, array(
        'https://headless-live-ecommerce.vercel.app',
    ) );
} );