<?php
/**
 * Plugin Name: Aurelo Headless
 * Description: Content controls for the Aurelo React storefront. Adds the "Aurelo Content" admin screen,
 *              Testimonials, FAQs, menu locations, and one public REST endpoint (/wp-json/aurelo/v1/site).
 * Version:     1.0.0
 *
 * This is a "must-use" plugin: WordPress loads it automatically, no activation needed.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* -------------------------------------------------------------------------
 * 1. The fields shown on Aurelo Content (key => label, type, default)
 *    type: text | textarea | url | image
 * ---------------------------------------------------------------------- */
function aurelo_fields() {
	return array(
		'Announcement bar' => array(
			'announcement_text' => array( 'Announcement text', 'text', 'Free shipping across India on orders above ₹2,999 · Easy 15-day returns' ),
		),
		'Home: hero' => array(
			'hero_eyebrow'    => array( 'Small label', 'text', 'Autumn / Winter 2026' ),
			'hero_title'      => array( 'Headline', 'text', 'Considered pieces for every day.' ),
			'hero_text'       => array( 'Sub text', 'textarea', 'Natural fabrics, quiet colours and cuts that last beyond the season. Designed in Jaipur.' ),
			'hero_cta1_label' => array( 'Primary button text', 'text', 'Shop new arrivals' ),
			'hero_cta1_link'  => array( 'Primary button link', 'url', '/shop' ),
			'hero_cta2_label' => array( 'Second button text', 'text', 'Explore the edit' ),
			'hero_cta2_link'  => array( 'Second button link', 'url', '/category/lifestyle' ),
			'hero_image'      => array( 'Hero image', 'image', '' ),
		),
		'Home: promo banner' => array(
			'promo_overline'   => array( 'Small label', 'text', 'Limited offer' ),
			'promo_title'      => array( 'Headline', 'text', 'Autumn edit, up to 30% off' ),
			'promo_text'       => array( 'Sub text', 'textarea', 'Linen, suede and wool pieces in the season’s quietest colours. Offer ends 30 November.' ),
			'promo_cta_label'  => array( 'Button text', 'text', 'Shop the sale' ),
			'promo_cta_link'   => array( 'Button link', 'url', '/category/sale' ),
			'promo_image'      => array( 'Promo image', 'image', '' ),
		),
		'Home: editorial (Journal)' => array(
			'editorial_overline'  => array( 'Small label', 'text', 'The Journal' ),
			'editorial_title'     => array( 'Headline', 'text', 'Slow mornings, soft layers' ),
			'editorial_text'      => array( 'Text', 'textarea', 'How three Jaipur makers turn washed linen and merino into pieces that get better with wear. A short read on materials, mending and making things last.' ),
			'editorial_cta_label' => array( 'Button text', 'text', 'Read the story' ),
			'editorial_cta_link'  => array( 'Button link', 'url', '/about' ),
			'editorial_image'     => array( 'Editorial image', 'image', '' ),
		),
		'Home: benefits (4 items)' => array(
			'benefit1_title' => array( 'Benefit 1 title', 'text', 'Free shipping' ),
			'benefit1_text'  => array( 'Benefit 1 text', 'text', 'On every order above ₹2,999 across India.' ),
			'benefit2_title' => array( 'Benefit 2 title', 'text', '15-day returns' ),
			'benefit2_text'  => array( 'Benefit 2 text', 'text', 'Easy exchanges and refunds, no questions.' ),
			'benefit3_title' => array( 'Benefit 3 title', 'text', 'Secure payments' ),
			'benefit3_text'  => array( 'Benefit 3 text', 'text', 'UPI, cards, netbanking and cash on delivery.' ),
			'benefit4_title' => array( 'Benefit 4 title', 'text', 'Made to last' ),
			'benefit4_text'  => array( 'Benefit 4 text', 'text', 'Natural fibres and responsibly made.' ),
		),
		'Home: newsletter' => array(
			'newsletter_title' => array( 'Headline', 'text', 'Get 10% off your first order' ),
			'newsletter_text'  => array( 'Text', 'text', 'First looks, restocks and member offers. No spam, unsubscribe anytime.' ),
		),
		'Footer' => array(
			'footer_about'      => array( 'About text', 'textarea', 'Considered everyday wear, footwear and home pieces. Designed in Jaipur, made to last.' ),
			'instagram_handle'  => array( 'Instagram handle', 'text', '@aurelo.india' ),
			'copyright'         => array( 'Copyright line', 'text', '© 2026 Aurelo Lifestyle Pvt. Ltd.' ),
			'payment_text'      => array( 'Payment methods line', 'text', 'UPI · Visa · Mastercard · RuPay · COD' ),
			'footer_shop_title'    => array( 'Column 1 title (menu: Footer: Shop)', 'text', 'Shop' ),
			'footer_help_title'    => array( 'Column 2 title (menu: Footer: Help)', 'text', 'Help' ),
			'footer_company_title' => array( 'Column 3 title (menu: Footer: Company)', 'text', 'Company' ),
			'footer_news_title'    => array( 'Newsletter title', 'text', 'Get 10% off' ),
			'footer_news_text'     => array( 'Newsletter text', 'text', 'Join the list for first looks and member offers.' ),
		),
		'Contact details' => array(
			'contact_address' => array( 'Address (use a new line for each row)', 'textarea', "Aurelo Lifestyle Pvt. Ltd.\n22 Bapu Bazaar Road, Jaipur 302003" ),
			'contact_email'   => array( 'Email', 'text', 'care@aurelo.example' ),
			'contact_phone'   => array( 'Phone and hours (new line for each row)', 'textarea', "+91 141 400 0000\nMon–Sat, 10:00–19:00 IST" ),
		),
		'Empty and error pages' => array(
			'notfound_code'       => array( '404 page: big number', 'text', '404' ),
			'notfound_title'      => array( '404 page: headline', 'text', 'This page has wandered off' ),
			'notfound_text'       => array( '404 page: text', 'text', 'The link may be old or the page may have moved. Try a search or head back to the shop.' ),
			'notfound_btn1'       => array( '404 page: first button (goes to home)', 'text', 'Back to home' ),
			'notfound_btn2'       => array( '404 page: second button (goes to shop)', 'text', 'Shop new arrivals' ),
			'cart_empty_title'    => array( 'Empty cart: headline', 'text', 'Your cart is empty' ),
			'cart_empty_text'     => array( 'Empty cart: text', 'text', 'Add a few pieces and they will appear here.' ),
			'cart_empty_button'   => array( 'Empty cart: button (goes to shop)', 'text', 'Continue shopping' ),
			'wishlist_title'        => array( 'Wishlist page: headline', 'text', 'My wishlist' ),
			'wishlist_empty_title'  => array( 'Empty wishlist: headline', 'text', 'Nothing saved yet' ),
			'wishlist_empty_text'   => array( 'Empty wishlist: text', 'text', 'Tap the heart on any piece to keep it here.' ),
			'wishlist_empty_button' => array( 'Empty wishlist: button (goes to shop)', 'text', 'Explore new arrivals' ),
			'search_empty_title'  => array( 'No search results: headline (use {query} for the word searched)', 'text', 'No results for “{query}”' ),
			'search_empty_text'   => array( 'No search results: text', 'text', 'Check the spelling or try a shorter word.' ),
			'search_empty_button' => array( 'No search results: button (goes to shop)', 'text', 'Explore new arrivals' ),
			'orders_empty_title'  => array( 'No orders: headline', 'text', 'No orders yet' ),
			'orders_empty_text'   => array( 'No orders: text', 'text', 'When you place an order it will show up here.' ),
			'orders_empty_button' => array( 'No orders: button (goes to shop)', 'text', 'Start shopping' ),
		),
		'Brand (header and footer logo)' => array(
			'logo_text'  => array( 'Logo text', 'text', 'Aurelo' ),
			'logo_image' => array( 'Logo image (optional, shown instead of the text)', 'image', '' ),
		),
		'Home: section headings' => array(
			'home_view_all'       => array( '"View all" link text', 'text', 'View all' ),
			'home_cat_overline'   => array( 'Categories: small label', 'text', 'Shop by category' ),
			'home_cat_title'      => array( 'Categories: headline', 'text', 'Find your way in' ),
			'home_cat_link'       => array( 'Categories: link text', 'text', 'All categories' ),
			'new_overline'        => array( 'New arrivals: small label', 'text', 'New arrivals' ),
			'new_title'           => array( 'New arrivals: headline', 'text', 'Just landed' ),
			'best_overline'       => array( 'Best sellers: small label', 'text', 'Best sellers' ),
			'best_title'          => array( 'Best sellers: headline', 'text', 'Most loved this season' ),
			'trend_overline'      => array( 'Trending: small label', 'text', 'Trending' ),
			'trend_title'         => array( 'Trending: headline', 'text', 'What everyone is wearing' ),
			'testi_overline'      => array( 'Testimonials: small label', 'text', 'Customers' ),
			'testi_title'         => array( 'Testimonials: headline', 'text', 'Kind words' ),
			'newsletter_overline' => array( 'Newsletter: small label', 'text', 'Newsletter' ),
			'insta_overline'      => array( 'Instagram: small label', 'text', 'Instagram' ),
			'insta1_image'        => array( 'Instagram picture 1', 'image', '' ),
			'insta2_image'        => array( 'Instagram picture 2', 'image', '' ),
			'insta3_image'        => array( 'Instagram picture 3', 'image', '' ),
			'insta4_image'        => array( 'Instagram picture 4', 'image', '' ),
			'insta5_image'        => array( 'Instagram picture 5', 'image', '' ),
			'insta6_image'        => array( 'Instagram picture 6', 'image', '' ),
		),
		'Shop page' => array(
			'shop_title' => array( 'Headline', 'text', 'All products' ),
			'shop_text'  => array( 'Sub text', 'textarea', 'Natural fabrics, quiet colours and pieces made to last.' ),
		),
		'Product page' => array(
			'product_note1'         => array( 'Highlight line 1', 'text', 'Free delivery on orders above ₹2,999' ),
			'product_note2'         => array( 'Highlight line 2', 'text', 'Free 15-day returns and exchanges' ),
			'product_shipping_text' => array( 'Shipping and returns tab (new line for each paragraph)', 'textarea', "Standard delivery takes 3–5 working days across India; Express takes 1–2 working days in metro cities.\nFree shipping on orders above ₹2,999. Easy 15-day returns and exchanges." ),
		),
		'Cart' => array(
			'free_shipping_threshold' => array( 'Free shipping above (amount in rupees; leave empty to hide the progress bar)', 'text', '2999' ),
		),
		'Contact page' => array(
			'contact_overline' => array( 'Small label', 'text', 'Contact' ),
			'contact_title'    => array( 'Headline', 'text', 'We are here to help' ),
			'contact_text'     => array( 'Sub text', 'textarea', 'Questions about an order, sizing or a repair? Write to us and we reply within one working day.' ),
		),
		'FAQ page' => array(
			'faq_title' => array( 'Headline', 'text', 'Frequently asked questions' ),
			'faq_text'  => array( 'Sub text', 'text', 'Can’t find an answer? Write to us from the Contact page.' ),
		),
		'About page' => array(
			'about_overline'        => array( 'Small label', 'text', 'Our story' ),
			'about_title'           => array( 'Headline', 'text', 'Made slowly, worn for years.' ),
			'about_text'            => array( 'Sub text', 'textarea', 'Aurelo began in a Jaipur workshop in 2019 with one linen shirt and a belief that everyday clothes should last longer than the trend that sold them.' ),
			'about_image'           => array( 'Top image', 'image', '' ),
			'about_values_overline' => array( 'Values: small label', 'text', 'Mission and values' ),
			'about_values_title'    => array( 'Values: headline', 'text', 'What we stand for' ),
			'about_v1_title'        => array( 'Value 1 title', 'text', 'Natural first' ),
			'about_v1_text'         => array( 'Value 1 text', 'text', 'Linen, wool, cotton and leather from vetted mills.' ),
			'about_v2_title'        => array( 'Value 2 title', 'text', 'Honest pricing' ),
			'about_v2_text'         => array( 'Value 2 text', 'text', 'One fair price, no inflated markdowns.' ),
			'about_v3_title'        => array( 'Value 3 title', 'text', 'Made to be mended' ),
			'about_v3_text'         => array( 'Value 3 text', 'text', 'Free repairs for the first two years.' ),
			'about_s1_value'        => array( 'Number 1: value', 'text', '2019' ),
			'about_s1_label'        => array( 'Number 1: label', 'text', 'Founded in Jaipur' ),
			'about_s2_value'        => array( 'Number 2: value', 'text', '1.2L+' ),
			'about_s2_label'        => array( 'Number 2: label', 'text', 'Pieces sold' ),
			'about_s3_value'        => array( 'Number 3: value', 'text', '420' ),
			'about_s3_label'        => array( 'Number 3: label', 'text', 'Cities delivered to' ),
			'about_s4_value'        => array( 'Number 4: value', 'text', '4.7' ),
			'about_s4_label'        => array( 'Number 4: label', 'text', 'Average rating' ),
			'about_gallery1'        => array( 'Gallery picture 1 (wide)', 'image', '' ),
			'about_gallery2'        => array( 'Gallery picture 2', 'image', '' ),
			'about_gallery3'        => array( 'Gallery picture 3', 'image', '' ),
			'about_cta_title'       => array( 'Closing headline', 'text', 'Start with the pieces people re-order.' ),
			'about_cta_label'       => array( 'Closing button text', 'text', 'Shop best sellers' ),
			'about_cta_link'        => array( 'Closing button link', 'url', '/shop' ),
		),
		'Interface text: FAQ, policy pages & reviews' => array(
			'ui_faq_all'        => array( 'FAQ: All button', 'text', 'All' ),
			'ui_faq_categories' => array( 'FAQ: category menu label', 'text', 'FAQ categories' ),
			'ui_policy_toc'     => array( 'Policy pages: contents menu label', 'text', 'On this page' ),
			'ui_review_one'     => array( 'Word: review (one)', 'text', 'review' ),
			'ui_review_many'    => array( 'Word: reviews (many)', 'text', 'reviews' ),
			'ui_prod_total'     => array( 'Product page: total ({price})', 'text', 'Total {price}' ),
		),
		'Interface text: common & product cards' => array(
			'ui_quick_view' => array( 'Product card: Quick view link', 'text', 'Quick view' ),
			'ui_wishlist_add' => array( 'Add to wishlist (button label)', 'text', 'Add to wishlist' ),
			'ui_wishlist_remove' => array( 'Remove from wishlist (button label)', 'text', 'Remove from wishlist' ),
			'ui_badge_sale' => array( 'Badge: Sale', 'text', 'Sale' ),
			'ui_badge_soldout' => array( 'Badge: Sold out', 'text', 'Sold out' ),
			'ui_badge_low' => array( 'Badge: low stock ({count} = number left)', 'text', 'Only {count} left' ),
			'ui_error_generic' => array( 'Error: something went wrong', 'text', 'Something went wrong. Please try again.' ),
			'ui_error_network' => array( 'Error: cannot reach the store', 'text', 'Cannot reach the store. Check that WordPress is running.' ),
			'ui_bc_home' => array( 'Breadcrumb: Home', 'text', 'Home' ),
			'ui_bc_shop' => array( 'Breadcrumb: Shop', 'text', 'Shop' ),
			'ui_bc_label' => array( 'Breadcrumb: navigation label', 'text', 'Breadcrumb' ),
			'ui_pag_label' => array( 'Pagination label', 'text', 'Pagination' ),
			'ui_pag_prev' => array( 'Pagination: previous page', 'text', 'Previous page' ),
			'ui_pag_next' => array( 'Pagination: next page', 'text', 'Next page' ),
			'ui_qty_dec' => array( 'Quantity: decrease', 'text', 'Decrease quantity' ),
			'ui_qty_inc' => array( 'Quantity: increase', 'text', 'Increase quantity' ),
			'ui_free' => array( 'Word: Free', 'text', 'Free' ),
			'ui_continue_shopping' => array( 'Button: Continue shopping', 'text', 'Continue shopping' ),
		),
		'Interface text: header, menus & account menu' => array(
			'ui_menu_open' => array( 'Header: open menu', 'text', 'Open menu' ),
			'ui_menu_close' => array( 'Header: close menu', 'text', 'Close menu' ),
			'ui_nav_primary' => array( 'Header: primary menu label', 'text', 'Primary' ),
			'ui_nav_mobile' => array( 'Header: mobile menu label', 'text', 'Mobile' ),
			'ui_nav_search' => array( 'Header: Search icon label', 'text', 'Search' ),
			'ui_nav_account' => array( 'Header: Account', 'text', 'Account' ),
			'ui_nav_wishlist' => array( 'Header: Wishlist icon label', 'text', 'Wishlist' ),
			'ui_nav_cart' => array( 'Header: Cart icon label', 'text', 'Cart' ),
			'ui_home_label' => array( 'Logo link label', 'text', 'Home' ),
			'ui_back_to_store' => array( 'Login pages: Back to store', 'text', 'Back to store' ),
			'ui_secure_checkout' => array( 'Checkout header: Secure checkout', 'text', 'Secure checkout' ),
			'ui_acc_dashboard' => array( 'Account menu: Dashboard', 'text', 'Dashboard' ),
			'ui_acc_profile' => array( 'Account menu: My profile', 'text', 'My profile' ),
			'ui_acc_orders' => array( 'Account menu: My orders', 'text', 'My orders' ),
			'ui_acc_addresses' => array( 'Account menu: My addresses', 'text', 'My addresses' ),
			'ui_acc_wishlist' => array( 'Account menu: My wishlist', 'text', 'My wishlist' ),
			'ui_acc_settings' => array( 'Account menu: Account settings', 'text', 'Account settings' ),
			'ui_acc_logout' => array( 'Account menu: Logout', 'text', 'Logout' ),
		),
		'Interface text: shop, filters & sorting' => array(
			'ui_filter_category' => array( 'Filter: Category heading', 'text', 'Category' ),
			'ui_filter_all' => array( 'Filter: All products', 'text', 'All products' ),
			'ui_filter_sale' => array( 'Filter and page title: Sale', 'text', 'Sale' ),
			'ui_filter_price' => array( 'Filter: Price heading', 'text', 'Price (₹)' ),
			'ui_ph_min' => array( 'Placeholder: min price', 'text', 'Min' ),
			'ui_ph_max' => array( 'Placeholder: max price', 'text', 'Max' ),
			'ui_filter_avail' => array( 'Filter: Availability heading', 'text', 'Availability' ),
			'ui_filter_instock' => array( 'Filter: In stock only', 'text', 'In stock only' ),
			'ui_sort_label' => array( 'Sort: dropdown label', 'text', 'Sort products' ),
			'ui_sort_prefix' => array( 'Sort: prefix ({label} = option)', 'text', 'Sort: {label}' ),
			'ui_sort_featured' => array( 'Sort option: Featured', 'text', 'Featured' ),
			'ui_sort_newest' => array( 'Sort option: Newest', 'text', 'Newest' ),
			'ui_sort_price_asc' => array( 'Sort option: Price low to high', 'text', 'Price low to high' ),
			'ui_sort_price_desc' => array( 'Sort option: Price high to low', 'text', 'Price high to low' ),
			'ui_sort_rating' => array( 'Sort option: Top rated', 'text', 'Top rated' ),
			'ui_loading_products' => array( 'Loading products', 'text', 'Loading products…' ),
			'ui_products_count' => array( 'Product count ({count})', 'text', '{count} products' ),
			'ui_listing_empty_title' => array( 'No products found: headline', 'text', 'No products found' ),
			'ui_listing_empty_text' => array( 'No products found: text', 'text', 'Try removing a filter, or add products in WordPress.' ),
			'ui_grid_empty_title' => array( 'Empty product grid: headline', 'text', 'No products yet' ),
			'ui_grid_empty_text' => array( 'Empty product grid: text', 'text', 'Add products in WordPress and they will appear here.' ),
			'ui_grid_error_title' => array( 'Products failed to load: headline', 'text', 'We could not load products' ),
			'ui_grid_error_text' => array( 'Products failed to load: text', 'text', 'Check that WordPress is running, then refresh the page.' ),
			'ui_search_placeholder' => array( 'Search: placeholder and label', 'text', 'Search products' ),
			'ui_search_button' => array( 'Search: button', 'text', 'Search' ),
			'ui_search_try' => array( 'Search: "Try" label', 'text', 'Try:' ),
			'ui_search_suggestions' => array( 'Search: suggestion words (separate with commas)', 'text', 'linen, tee, boots, tote' ),
			'ui_search_results' => array( 'Search: result count ({count}, {query})', 'text', '{count} results for “{query}”' ),
		),
		'Interface text: product page' => array(
			'ui_product_not_found_title' => array( 'Product not found: headline', 'text', 'We could not find this product' ),
			'ui_product_not_found_text' => array( 'Product not found: text', 'text', 'It may have been removed.' ),
			'ui_pick_first' => array( 'Choose option message ({options} = e.g. size and colour)', 'text', 'Choose {options} first.' ),
			'ui_and' => array( 'Word: and (joins option names)', 'text', 'and' ),
			'ui_stock_out' => array( 'Stock: out of stock', 'text', 'Out of stock' ),
			'ui_stock_low' => array( 'Stock: low ({count})', 'text', 'In stock · only {count} left' ),
			'ui_stock_in' => array( 'Stock: in stock', 'text', 'In stock' ),
			'ui_reviews_none' => array( 'No reviews yet', 'text', 'No reviews yet' ),
			'ui_btn_soldout' => array( 'Button: sold out', 'text', 'Sold out' ),
			'ui_btn_adding' => array( 'Button: adding', 'text', 'Adding' ),
			'ui_btn_added' => array( 'Button: added', 'text', 'Added' ),
			'ui_btn_add' => array( 'Button: Add to cart', 'text', 'Add to cart' ),
			'ui_btn_add_price' => array( 'Button: Add to cart with price ({price})', 'text', 'Add to cart · {price}' ),
			'ui_added_msg' => array( 'Added to cart message', 'text', 'Added to your cart.' ),
			'ui_view_cart' => array( 'Link: View cart', 'text', 'View cart' ),
			'ui_go_cart' => array( 'Button: Go to cart', 'text', 'Go to cart' ),
			'ui_tab_description' => array( 'Tab: Description', 'text', 'Description' ),
			'ui_tab_specs' => array( 'Tab: Specifications', 'text', 'Specifications' ),
			'ui_tab_shipping' => array( 'Tab: Shipping and returns', 'text', 'Shipping and returns' ),
			'ui_tab_reviews' => array( 'Tab: Reviews ({count})', 'text', 'Reviews ({count})' ),
			'ui_spec_sku' => array( 'Spec: SKU', 'text', 'SKU' ),
			'ui_spec_weight' => array( 'Spec: Weight', 'text', 'Weight' ),
			'ui_spec_size' => array( 'Spec: Size', 'text', 'Size' ),
			'ui_verified_buyer' => array( 'Review: Verified buyer', 'text', 'Verified buyer' ),
			'ui_related_overline' => array( 'Related products: small label', 'text', 'You may also like' ),
			'ui_related_title' => array( 'Related products: headline', 'text', 'Related products' ),
			'ui_recent_overline' => array( 'Recently viewed: small label', 'text', 'Recently viewed' ),
			'ui_recent_title' => array( 'Recently viewed: headline', 'text', 'Pick up where you left off' ),
		),
		'Interface text: cart' => array(
			'ui_cart_load_error_title' => array( 'Cart failed to load: headline', 'text', 'We could not load your cart' ),
			'ui_cart_load_error_text' => array( 'Cart failed to load: text', 'text', 'Please refresh the page.' ),
			'ui_cart_title' => array( 'Cart: headline', 'text', 'Your cart' ),
			'ui_cart_item_one' => array( 'Cart: {count} item', 'text', '{count} item' ),
			'ui_cart_item_many' => array( 'Cart: {count} items', 'text', '{count} items' ),
			'ui_cart_ship_away' => array( 'Free shipping progress ({amount})', 'text', 'You are {amount} away from free shipping' ),
			'ui_cart_ship_free' => array( 'Free shipping reached', 'text', 'You have free shipping' ),
			'ui_remove' => array( 'Button: Remove', 'text', 'Remove' ),
			'ui_order_summary' => array( 'Order summary heading', 'text', 'Order summary' ),
			'ui_ph_coupon' => array( 'Coupon: placeholder and label', 'text', 'Coupon code' ),
			'ui_coupon_apply' => array( 'Coupon: Apply button', 'text', 'Apply' ),
			'ui_coupon_label' => array( 'Coupon: label', 'text', 'Coupon' ),
			'ui_sum_subtotal' => array( 'Summary: Subtotal', 'text', 'Subtotal' ),
			'ui_sum_shipping' => array( 'Summary: Shipping', 'text', 'Shipping' ),
			'ui_sum_discount' => array( 'Summary: Discount', 'text', 'Discount' ),
			'ui_sum_total' => array( 'Summary: Total', 'text', 'Total' ),
			'ui_ship_calc' => array( 'Shipping: calculated at checkout', 'text', 'Calculated at checkout' ),
			'ui_ship_none' => array( 'Shipping: not needed', 'text', 'Not needed' ),
			'ui_btn_checkout' => array( 'Button: Proceed to checkout', 'text', 'Proceed to checkout' ),
			'ui_cart_tax_note' => array( 'Cart: taxes note', 'text', 'Taxes and shipping are shown at checkout.' ),
			'ui_cart_more_overline' => array( 'Recommended: small label', 'text', 'Complete the look' ),
			'ui_cart_more_title' => array( 'Recommended: headline', 'text', 'Recommended for you' ),
		),
		'Interface text: checkout' => array(
			'ui_chk_fix_n_one' => array( 'Checkout error: one field ({count})', 'text', 'Please fix {count} field' ),
			'ui_chk_fix_n_many' => array( 'Checkout error: several fields ({count})', 'text', 'Please fix {count} fields' ),
			'ui_chk_fix_hint' => array( 'Checkout error: hint', 'text', 'Check the highlighted fields to continue.' ),
			'ui_chk_fail' => array( 'Checkout error: order failed', 'text', 'We could not place your order' ),
			'ui_chk_step_contact' => array( 'Step 1 title', 'text', 'Contact' ),
			'ui_chk_step_address' => array( 'Step 2 title', 'text', 'Shipping address' ),
			'ui_chk_step_method' => array( 'Step 3 title', 'text', 'Shipping method' ),
			'ui_chk_step_payment' => array( 'Step 4 title', 'text', 'Payment' ),
			'ui_f_email_address' => array( 'Field: Email address', 'text', 'Email address' ),
			'ui_f_first_name' => array( 'Field: First name', 'text', 'First name' ),
			'ui_f_last_name' => array( 'Field: Last name', 'text', 'Last name' ),
			'ui_f_mobile' => array( 'Field: Mobile number', 'text', 'Mobile number' ),
			'ui_f_country' => array( 'Field: Country', 'text', 'Country' ),
			'ui_country_india' => array( 'Country name', 'text', 'India' ),
			'ui_f_street' => array( 'Field: Street address', 'text', 'Street address' ),
			'ui_f_city' => array( 'Field: City', 'text', 'City' ),
			'ui_f_state' => array( 'Field: State', 'text', 'State' ),
			'ui_f_pin' => array( 'Field: PIN code', 'text', 'PIN code' ),
			'ui_select_state' => array( 'Select state option', 'text', 'Select state' ),
			'ui_chk_rates_hint' => array( 'Shipping options hint', 'text', 'Enter your address above to see delivery options.' ),
			'ui_chk_demo_title' => array( 'Demo notice: title', 'text', 'Demo mode' ),
			'ui_chk_demo_text' => array( 'Demo notice: text', 'text', 'No real payment is taken. Pick any method and any values; the order is created as if it was paid.' ),
			'ui_pay_upi' => array( 'Payment: UPI', 'text', 'UPI' ),
			'ui_pay_upi_hint' => array( 'Payment: UPI hint', 'text', 'Pay with any UPI app' ),
			'ui_pay_card' => array( 'Payment: Card', 'text', 'Credit / debit card' ),
			'ui_pay_card_hint' => array( 'Payment: Card hint', 'text', 'Visa, Mastercard, RuPay' ),
			'ui_pay_netbanking' => array( 'Payment: Netbanking', 'text', 'Netbanking' ),
			'ui_pay_netbanking_hint' => array( 'Payment: Netbanking hint', 'text', 'All major banks' ),
			'ui_pay_cod' => array( 'Payment: Cash on delivery', 'text', 'Cash on delivery' ),
			'ui_pay_cod_hint' => array( 'Payment: Cash on delivery hint', 'text', 'Pay when it arrives' ),
			'ui_pay_fallback' => array( 'Payment: other (demo)', 'text', 'Demo payment' ),
			'ui_pay_ph_upi' => array( 'Placeholder: UPI id', 'text', 'name@upi (optional, demo)' ),
			'ui_pay_lbl_upi' => array( 'Label: UPI id', 'text', 'UPI ID' ),
			'ui_pay_ph_card' => array( 'Placeholder: card number', 'text', 'Card number (demo)' ),
			'ui_pay_lbl_card' => array( 'Label: card number', 'text', 'Card number' ),
			'ui_pay_ph_expiry' => array( 'Placeholder: expiry', 'text', 'MM / YY' ),
			'ui_pay_lbl_expiry' => array( 'Label: expiry', 'text', 'Expiry' ),
			'ui_pay_ph_cvv' => array( 'Placeholder and label: CVV', 'text', 'CVV' ),
			'ui_pay_lbl_bank' => array( 'Label: bank', 'text', 'Bank' ),
			'ui_pay_choose_bank' => array( 'Choose bank option', 'text', 'Choose your bank (demo)' ),
			'ui_pay_banks' => array( 'Bank list (separate with commas)', 'text', 'State Bank of India, HDFC Bank, ICICI Bank, Axis Bank' ),
			'ui_pay_demo_note' => array( 'Payment demo note', 'text', 'Card and bank details above are never sent anywhere. They are only for the demo.' ),
			'ui_f_order_note' => array( 'Field: Order note', 'text', 'Order note (optional)' ),
			'ui_btn_placing' => array( 'Button: placing order', 'text', 'Placing order' ),
			'ui_btn_place_order' => array( 'Button: Place order ({price})', 'text', 'Place order · {price}' ),
			'ui_chk_terms' => array( 'Checkout: terms sentence (before link)', 'text', 'By placing your order you agree to our' ),
			'ui_chk_terms_link' => array( 'Checkout: terms link text', 'text', 'terms' ),
			'ui_err_email' => array( 'Error: invalid email', 'text', 'Enter a valid email address.' ),
			'ui_err_first_name' => array( 'Error: first name', 'text', 'Enter your first name.' ),
			'ui_err_last_name' => array( 'Error: last name', 'text', 'Enter your last name.' ),
			'ui_err_phone' => array( 'Error: mobile number', 'text', 'Enter a 10-digit mobile number.' ),
			'ui_err_street' => array( 'Error: street', 'text', 'Enter your street address.' ),
			'ui_err_city' => array( 'Error: city', 'text', 'Enter your city.' ),
			'ui_err_state' => array( 'Error: state', 'text', 'Choose your state.' ),
			'ui_err_pin' => array( 'Error: PIN code', 'text', 'Enter a valid 6-digit PIN code.' ),
		),
		'Interface text: order confirmation' => array(
			'ui_os_not_found_title' => array( 'Order not found: headline', 'text', 'We could not find that order' ),
			'ui_os_not_found_text' => array( 'Order not found: text', 'text', 'If you just placed an order, check your email for the confirmation.' ),
			'ui_os_thanks_name' => array( 'Thank you with name ({name})', 'text', 'Thank you, {name}' ),
			'ui_os_thanks' => array( 'Thank you', 'text', 'Thank you' ),
			'ui_os_confirmed' => array( 'Order confirmed text', 'text', 'Your order is confirmed.' ),
			'ui_os_emailed' => array( 'Receipt text ({email})', 'text', 'We have emailed the receipt to {email}.' ),
			'ui_os_order_pill' => array( 'Order pill ({id})', 'text', 'Order {id}' ),
			'ui_os_ship_addr' => array( 'Shipping address label', 'text', 'Shipping address' ),
			'ui_os_payment' => array( 'Payment label', 'text', 'Payment' ),
			'ui_os_pay_cod' => array( 'Payment text: pay on delivery ({method})', 'text', '{method} (demo), pay on delivery' ),
			'ui_os_pay_paid' => array( 'Payment text: paid ({method})', 'text', '{method} (demo), paid' ),
			'ui_os_view_order' => array( 'Button: View order', 'text', 'View order' ),
		),
		'Interface text: login, register & account' => array(
			'ui_login_title' => array( 'Login: headline', 'text', 'Welcome back' ),
			'ui_login_text' => array( 'Login: text', 'text', 'Sign in to track orders and save favourites.' ),
			'ui_f_email' => array( 'Field: Email', 'text', 'Email' ),
			'ui_f_password' => array( 'Field: Password', 'text', 'Password' ),
			'ui_login_forgot' => array( 'Link: Forgot password?', 'text', 'Forgot password?' ),
			'ui_login_btn' => array( 'Button: Log in', 'text', 'Log in' ),
			'ui_login_busy' => array( 'Button: logging in', 'text', 'Logging in' ),
			'ui_login_new' => array( 'Login: new customer sentence', 'text', 'New to Aurelo?' ),
			'ui_login_create' => array( 'Link: Create an account', 'text', 'Create an account' ),
			'ui_login_err' => array( 'Login: empty fields error', 'text', 'Enter your email and password.' ),
			'ui_reg_title' => array( 'Register: headline', 'text', 'Create account' ),
			'ui_reg_text' => array( 'Register: text', 'text', 'Join for faster checkout and member offers.' ),
			'ui_f_full_name' => array( 'Field: Full name', 'text', 'Full name' ),
			'ui_f_password_hint' => array( 'Password hint', 'text', 'At least 8 characters' ),
			'ui_f_confirm_password' => array( 'Field: Confirm password', 'text', 'Confirm password' ),
			'ui_reg_agree' => array( 'Register: agree sentence (before links)', 'text', 'I agree to the' ),
			'ui_reg_terms' => array( 'Link: Terms', 'text', 'Terms' ),
			'ui_reg_privacy' => array( 'Link: Privacy Policy', 'text', 'Privacy Policy' ),
			'ui_reg_btn' => array( 'Button: Create account', 'text', 'Create account' ),
			'ui_reg_busy' => array( 'Button: creating account', 'text', 'Creating account' ),
			'ui_reg_member' => array( 'Register: member sentence', 'text', 'Already a member?' ),
			'ui_reg_login' => array( 'Link: Log in', 'text', 'Log in' ),
			'ui_err_full_name' => array( 'Error: full name', 'text', 'Enter your full name.' ),
			'ui_err_password' => array( 'Error: password length', 'text', 'Use at least 8 characters.' ),
			'ui_err_confirm' => array( 'Error: passwords differ', 'text', 'The passwords do not match.' ),
			'ui_err_terms' => array( 'Error: terms', 'text', 'Please accept the terms to continue.' ),
			'ui_forgot_title' => array( 'Forgot password: headline', 'text', 'Forgot password' ),
			'ui_forgot_text' => array( 'Forgot password: text', 'text', 'Enter your email and we will send a reset link.' ),
			'ui_ph_email' => array( 'Placeholder: email', 'text', 'you@example.com' ),
			'ui_forgot_btn' => array( 'Button: Send reset link', 'text', 'Send reset link' ),
			'ui_forgot_busy' => array( 'Button: sending', 'text', 'Sending' ),
			'ui_back_login' => array( 'Link: Back to log in', 'text', 'Back to log in' ),
			'ui_forgot_sent_title' => array( 'Reset sent: headline', 'text', 'Check your inbox' ),
			'ui_forgot_sent_text' => array( 'Reset sent: text ({email})', 'text', 'If an account exists for {email}, we sent a link to choose a new password.' ),
			'ui_ov_welcome' => array( 'Dashboard: welcome ({name})', 'text', 'Welcome back, {name}' ),
			'ui_ov_since' => array( 'Dashboard: member since ({date})', 'text', 'Member since {date}' ),
			'ui_ov_total' => array( 'Dashboard: Total orders', 'text', 'Total orders' ),
			'ui_ov_pending' => array( 'Dashboard: Pending', 'text', 'Pending' ),
			'ui_ov_done' => array( 'Dashboard: Completed', 'text', 'Completed' ),
			'ui_ov_recent' => array( 'Dashboard: Recent orders', 'text', 'Recent orders' ),
			'ui_ov_view_all' => array( 'Dashboard: View all', 'text', 'View all' ),
			'ui_ov_info' => array( 'Dashboard: Account information', 'text', 'Account information' ),
			'ui_ov_edit' => array( 'Dashboard: Edit profile button', 'text', 'Edit profile' ),
			'ui_prof_title' => array( 'Profile: headline', 'text', 'My profile' ),
			'ui_prof_edit' => array( 'Profile: Edit profile heading', 'text', 'Edit profile' ),
			'ui_f_phone' => array( 'Field: Phone', 'text', 'Phone' ),
			'ui_prof_addresses' => array( 'Profile: My addresses heading', 'text', 'My addresses' ),
			'ui_prof_addresses_text' => array( 'Profile: addresses text', 'text', 'Used to fill in checkout for you.' ),
			'ui_prof_save' => array( 'Button: Save changes', 'text', 'Save changes' ),
			'ui_prof_saved' => array( 'Profile saved message', 'text', 'Your details were saved.' ),
			'ui_pw_title' => array( 'Change password heading', 'text', 'Change password' ),
			'ui_f_current_password' => array( 'Field: Current password', 'text', 'Current password' ),
			'ui_f_new_password' => array( 'Field: New password', 'text', 'New password' ),
			'ui_f_confirm_new_password' => array( 'Field: Confirm new password', 'text', 'Confirm new password' ),
			'ui_pw_btn' => array( 'Button: Update password', 'text', 'Update password' ),
			'ui_pw_err_short' => array( 'Error: new password too short', 'text', 'Use at least 8 characters for the new password.' ),
			'ui_pw_err_match' => array( 'Error: new passwords differ', 'text', 'The new passwords do not match.' ),
			'ui_pw_ok' => array( 'Password updated message', 'text', 'Your password was updated.' ),
		),
		'Interface text: orders & statuses' => array(
			'ui_orders_title' => array( 'My orders: headline', 'text', 'My orders' ),
			'ui_orders_count_one' => array( 'Order count: one ({count})', 'text', '{count} order' ),
			'ui_orders_count_many' => array( 'Order count: many ({count})', 'text', '{count} orders' ),
			'ui_orders_filter' => array( 'Status filter label', 'text', 'Filter by status' ),
			'ui_orders_all' => array( 'Status filter: All', 'text', 'All statuses' ),
			'ui_order_heading' => array( 'Order heading ({number})', 'text', 'Order #{number}' ),
			'ui_order_placed_on' => array( 'Placed on ({date})', 'text', 'Placed on {date}' ),
			'ui_payment_due' => array( 'Payment due', 'text', 'Payment due' ),
			'ui_delivering_to' => array( 'Delivering to ({address})', 'text', 'Delivering to {address}' ),
			'ui_order_step1' => array( 'Progress step 1', 'text', 'Order placed' ),
			'ui_order_step2' => array( 'Progress step 2', 'text', 'Processing' ),
			'ui_order_step3' => array( 'Progress step 3', 'text', 'Delivered' ),
			'ui_th_order' => array( 'Table: Order', 'text', 'Order' ),
			'ui_th_date' => array( 'Table: Date', 'text', 'Date' ),
			'ui_th_products' => array( 'Table: Products', 'text', 'Products' ),
			'ui_th_total' => array( 'Table: Total', 'text', 'Total' ),
			'ui_th_payment' => array( 'Table: Payment', 'text', 'Payment' ),
			'ui_th_status' => array( 'Table: Status', 'text', 'Status' ),
			'ui_paid' => array( 'Paid', 'text', 'Paid' ),
			'ui_due' => array( 'Due', 'text', 'Due' ),
			'ui_hide' => array( 'Hide', 'text', 'Hide' ),
			'ui_view_details' => array( 'View details', 'text', 'View details' ),
			'ui_status_pending' => array( 'Status: Pending payment', 'text', 'Pending payment' ),
			'ui_status_processing' => array( 'Status: Processing', 'text', 'Processing' ),
			'ui_status_on_hold' => array( 'Status: On hold', 'text', 'On hold' ),
			'ui_status_completed' => array( 'Status: Delivered', 'text', 'Delivered' ),
			'ui_status_cancelled' => array( 'Status: Cancelled', 'text', 'Cancelled' ),
			'ui_status_refunded' => array( 'Status: Refunded', 'text', 'Refunded' ),
			'ui_status_failed' => array( 'Status: Failed', 'text', 'Failed' ),
		),
		'Interface text: forms & newsletter' => array(
			'ui_contact_sent_title' => array( 'Contact sent: title', 'text', 'Message sent' ),
			'ui_contact_sent_text' => array( 'Contact sent: text', 'text', 'Thank you. We reply within one working day.' ),
			'ui_f_name' => array( 'Field: Name', 'text', 'Name' ),
			'ui_f_subject' => array( 'Field: Subject', 'text', 'Subject' ),
			'ui_f_message' => array( 'Field: Message', 'text', 'Message' ),
			'ui_ph_phone' => array( 'Placeholder: phone', 'text', '+91' ),
			'ui_ph_subject' => array( 'Placeholder: subject', 'text', 'Order, sizing, repairs' ),
			'ui_ph_message' => array( 'Placeholder: message', 'text', 'How can we help?' ),
			'ui_err_name' => array( 'Error: name', 'text', 'Enter your name.' ),
			'ui_err_message' => array( 'Error: message', 'text', 'Tell us how we can help.' ),
			'ui_contact_send' => array( 'Button: Send message', 'text', 'Send message' ),
			'ui_contact_sending' => array( 'Button: sending', 'text', 'Sending' ),
			'ui_contact_address_label' => array( 'Contact page: Address label', 'text', 'Address' ),
			'ui_contact_email_label' => array( 'Contact page: Email label', 'text', 'Email' ),
			'ui_contact_phone_label' => array( 'Contact page: Phone label', 'text', 'Phone' ),
			'ui_news_thanks' => array( 'Newsletter: thank you', 'text', 'Thank you. You are on the list.' ),
			'ui_news_placeholder' => array( 'Newsletter: email placeholder', 'text', 'Email address' ),
			'ui_news_button' => array( 'Newsletter: default button', 'text', 'Subscribe' ),
			'ui_news_button_footer' => array( 'Newsletter: footer button', 'text', 'Join' ),
		),
	);
}

function aurelo_defaults() {
	$out = array();
	foreach ( aurelo_fields() as $group ) {
		foreach ( $group as $key => $f ) {
			$out[ $key ] = $f[2];
		}
	}
	return $out;
}

/**
 * What the admin saved, and nothing else. A box left empty stays empty (the storefront hides it).
 * Only a field that was never saved (a brand-new field) starts with its suggested text.
 */
function aurelo_get_options() {
	$saved = get_option( 'aurelo_options', array() );
	$saved = is_array( $saved ) ? $saved : array();
	$out   = array();
	foreach ( aurelo_fields() as $group ) {
		foreach ( $group as $key => $f ) {
			$out[ $key ] = array_key_exists( $key, $saved ) ? $saved[ $key ] : $f[2];
			// Interface text (buttons, labels, messages) never goes blank: an empty box falls back to the suggested text.
			if ( 0 === strpos( $key, 'ui_' ) && '' === trim( (string) $out[ $key ] ) ) {
				$out[ $key ] = $f[2];
			}
		}
	}
	return $out;
}

/* -------------------------------------------------------------------------
 * 2. Admin screen: Aurelo Content
 * ---------------------------------------------------------------------- */
add_action( 'admin_menu', function () {
	add_menu_page( 'Aurelo Content', 'Aurelo Content', 'manage_options', 'aurelo-content', 'aurelo_render_page', 'dashicons-layout', 3 );
} );

add_action( 'admin_init', function () {
	register_setting( 'aurelo_group', 'aurelo_options', array(
		'sanitize_callback' => function ( $input ) {
			$clean = array();
			foreach ( aurelo_fields() as $group ) {
				foreach ( $group as $key => $f ) {
					$val = isset( $input[ $key ] ) ? wp_unslash( $input[ $key ] ) : '';
					if ( 'textarea' === $f[1] ) {
						$clean[ $key ] = sanitize_textarea_field( $val );
					} elseif ( 'image' === $f[1] ) {
						$clean[ $key ] = absint( $val );
					} elseif ( 'url' === $f[1] ) {
						// Keep relative links such as /shop as they are.
						$clean[ $key ] = 0 === strpos( $val, '/' ) ? sanitize_text_field( $val ) : esc_url_raw( $val );
					} else {
						$clean[ $key ] = sanitize_text_field( $val );
					}
				}
			}
			return $clean;
		},
	) );
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( 'toplevel_page_aurelo-content' === $hook ) {
		wp_enqueue_media();
	}
} );

function aurelo_render_page() {
	$opts = aurelo_get_options();
	?>
	<div class="wrap">
		<h1>Aurelo Content</h1>
		<p>Everything here shows up on the React storefront. Leave a box empty and that part is hidden on the site.
			Links can be a page on the shop such as <code>/shop</code> or <code>/category/sale</code>.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'aurelo_group' ); ?>
			<?php foreach ( aurelo_fields() as $group_name => $fields ) : ?>
				<h2 style="margin-top:2em"><?php echo esc_html( $group_name ); ?></h2>
				<table class="form-table" role="presentation">
					<?php foreach ( $fields as $key => $f ) :
						$name = 'aurelo_options[' . $key . ']';
						$val  = isset( $opts[ $key ] ) ? $opts[ $key ] : '';
						?>
						<tr>
							<th scope="row"><label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $f[0] ); ?></label></th>
							<td>
								<?php if ( 'textarea' === $f[1] ) : ?>
									<textarea id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $name ); ?>" rows="3" class="large-text"><?php echo esc_textarea( $val ); ?></textarea>
								<?php elseif ( 'image' === $f[1] ) :
									$id    = isset( $opts[ $key ] ) ? absint( $opts[ $key ] ) : 0;
									$url   = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
									?>
									<div class="aurelo-image" data-key="<?php echo esc_attr( $key ); ?>">
										<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $id ); ?>" />
										<img src="<?php echo esc_url( $url ); ?>" style="max-width:200px;display:<?php echo $url ? 'block' : 'none'; ?>;margin-bottom:8px" alt="" />
										<button type="button" class="button aurelo-pick">Choose image</button>
										<button type="button" class="button-link aurelo-clear">Remove</button>
									</div>
								<?php else : ?>
									<input type="text" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $val ); ?>" class="large-text" />
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endforeach; ?>
			<?php submit_button( 'Save changes' ); ?>
		</form>
	</div>
	<script>
	jQuery(function ($) {
		$('.aurelo-image').each(function () {
			var box = $(this), input = box.find('input'), img = box.find('img');
			box.find('.aurelo-pick').on('click', function () {
				var frame = wp.media({ title: 'Choose image', multiple: false });
				frame.on('select', function () {
					var a = frame.state().get('selection').first().toJSON();
					input.val(a.id);
					img.attr('src', (a.sizes && a.sizes.medium ? a.sizes.medium.url : a.url)).show();
				});
				frame.open();
			});
			box.find('.aurelo-clear').on('click', function () { input.val(''); img.hide(); });
		});
	});
	</script>
	<?php
}

/* -------------------------------------------------------------------------
 * 3. Testimonials and FAQs (custom content types, readable by the REST API)
 * ---------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'testimonial', array(
		'labels'       => array( 'name' => 'Testimonials', 'singular_name' => 'Testimonial', 'add_new_item' => 'Add testimonial', 'edit_item' => 'Edit testimonial' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'testimonials',
		'menu_icon'    => 'dashicons-format-quote',
		'menu_position'=> 4,
		'supports'     => array( 'title', 'editor', 'page-attributes' ),
	) );
	register_post_meta( 'testimonial', 'city', array( 'type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'sanitize_text_field' ) );

	register_post_type( 'aurelo_faq', array(
		'labels'       => array( 'name' => 'FAQs', 'singular_name' => 'FAQ', 'add_new_item' => 'Add FAQ', 'edit_item' => 'Edit FAQ' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'faqs',
		'menu_icon'    => 'dashicons-editor-help',
		'menu_position'=> 5,
		'supports'     => array( 'title', 'editor', 'page-attributes' ),
		'taxonomies'   => array( 'faq_category' ),
	) );
	register_taxonomy( 'faq_category', 'aurelo_faq', array(
		'labels'       => array( 'name' => 'FAQ categories', 'singular_name' => 'FAQ category' ),
		'public'       => false,
		'show_ui'      => true,
		'show_in_rest' => true,
		'rest_base'    => 'faq_categories',
		'hierarchical' => true,
	) );

	register_nav_menus( array(
		'primary'        => 'Primary (header)',
		'footer_shop'    => 'Footer: Shop',
		'footer_help'    => 'Footer: Help',
		'footer_company' => 'Footer: Company',
		'footer_legal'   => 'Footer: Legal (bottom line)',
	) );
} );

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'aurelo_city', 'Customer city', function ( $post ) {
		echo '<input type="text" name="aurelo_city" value="' . esc_attr( get_post_meta( $post->ID, 'city', true ) ) . '" class="widefat" placeholder="Mumbai" />';
		echo '<p class="description">Title = customer name. Content = the quote.</p>';
	}, 'testimonial', 'side' );
} );

add_action( 'save_post_testimonial', function ( $post_id ) {
	if ( isset( $_POST['aurelo_city'] ) ) {
		update_post_meta( $post_id, 'city', sanitize_text_field( wp_unslash( $_POST['aurelo_city'] ) ) );
	}
} );

/* -------------------------------------------------------------------------
 * 4. REST endpoint: options + menus in one request
 * ---------------------------------------------------------------------- */
function aurelo_menu( $location ) {
	$locations = get_nav_menu_locations();
	if ( empty( $locations[ $location ] ) ) {
		return null;
	}
	$items = wp_get_nav_menu_items( $locations[ $location ] );
	if ( ! $items ) {
		return array();
	}
	return array_map( function ( $i ) {
		return array(
			'id'     => (int) $i->ID,
			'parent' => (int) $i->menu_item_parent,
			'title'  => $i->title,
			'url'    => $i->url,
		);
	}, $items );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'aurelo/v1', '/site', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$opts = aurelo_get_options();
			foreach ( aurelo_fields() as $group ) {
				foreach ( $group as $key => $f ) {
					if ( 'image' === $f[1] ) {
						$id            = isset( $opts[ $key ] ) ? absint( $opts[ $key ] ) : 0;
						$opts[ $key ] = $id ? wp_get_attachment_image_url( $id, 'full' ) : '';
					}
				}
			}
			return array(
				'options' => $opts,
				'menus'   => array(
					'primary'        => aurelo_menu( 'primary' ),
					'footer_shop'    => aurelo_menu( 'footer_shop' ),
					'footer_help'    => aurelo_menu( 'footer_help' ),
					'footer_company' => aurelo_menu( 'footer_company' ),
					'footer_legal'   => aurelo_menu( 'footer_legal' ),
				),
			);
		},
	) );
} );
