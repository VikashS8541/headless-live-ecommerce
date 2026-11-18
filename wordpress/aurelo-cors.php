<?php
/**
 * Plugin Name: Aurelo CORS
 * Description: Lets the React storefront (a different web address) read WooCommerce's Store API.
 *              WooCommerce only answers browsers from approved origins; add your front-end address here.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'allowed_http_origins', function ( $origins ) {
	return array_merge( $origins, array(
		'http://localhost:5173',   // npm run dev
		'http://127.0.0.1:5173',
		'http://localhost:4173',   // npm run preview
		'http://127.0.0.1:4173',
		'https://headless-live-ecommerce.vercel.app',   // Vercel live storefront
	) );
} );
