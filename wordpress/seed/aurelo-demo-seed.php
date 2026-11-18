<?php
/**
 * Plugin Name: Aurelo Demo Seed (one-time)
 * Description: Fills the demo shop with Aurelo products, categories, pages, FAQs, testimonials, menus and images.
 *              Runs only when https://headless-live-ecommerce.vercel.app//?aurelo_seed=aurelo-demo-2026 is opened from this
 *              computer. Safe to run again: it updates by SKU / slug instead of duplicating.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	if ( empty( $_GET['aurelo_seed'] ) || 'aurelo-demo-2026' !== $_GET['aurelo_seed'] ) {
		return;
	}
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';
	if ( ! in_array( $ip, array( '127.0.0.1', '::1' ), true ) ) {
		wp_die( 'Local only.' );
	}
	if ( ! class_exists( 'WooCommerce' ) ) {
		wp_die( 'WooCommerce is not active.' );
	}
	@set_time_limit( 600 );
	@ini_set( 'memory_limit', '512M' );
	wp_set_current_user( 1 );
	header( 'Content-Type: text/plain; charset=utf-8' );
	aurelo_seed_run();
	exit;
}, 99 );

function aurelo_log( $m ) {
	echo $m . "\n";
	flush();
}

/** Copy a local file into the Media Library once; returns the attachment id. */
function aurelo_media( $name, $title ) {
	$map = get_option( 'aurelo_seed_media', array() );
	if ( ! empty( $map[ $name ] ) && get_post( $map[ $name ] ) ) {
		return (int) $map[ $name ];
	}
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$src = __DIR__ . '/aurelo-seed/images/' . $name;
	if ( ! file_exists( $src ) ) {
		return 0;
	}
	$tmp = wp_tempnam( $name );
	copy( $src, $tmp );
	$id = media_handle_sideload( array( 'name' => $name, 'tmp_name' => $tmp ), 0, $title );
	if ( is_wp_error( $id ) ) {
		@unlink( $tmp );
		aurelo_log( 'image failed: ' . $name . ' ' . $id->get_error_message() );
		return 0;
	}
	update_post_meta( $id, '_wp_attachment_image_alt', $title );
	$map[ $name ] = $id;
	update_option( 'aurelo_seed_media', $map );
	return (int) $id;
}

function aurelo_term( $name, $taxonomy = 'product_cat', $parent = 0 ) {
	$t = term_exists( $name, $taxonomy );
	if ( ! $t ) {
		$t = wp_insert_term( $name, $taxonomy, array( 'parent' => $parent ) );
	}
	return is_wp_error( $t ) ? 0 : (int) ( is_array( $t ) ? $t['term_id'] : $t );
}

function aurelo_seed_run() {
	// v2: replace the first (generic) photos with the clothing illustrations
	if ( get_option( 'aurelo_seed_version' ) !== 'v3' ) {
		foreach ( (array) get_option( 'aurelo_seed_media', array() ) as $att ) {
			if ( $att && get_post( $att ) ) {
				wp_delete_attachment( $att, true );
			}
		}
		update_option( 'aurelo_seed_media', array() );
		update_option( 'aurelo_seed_version', 'v3' );
		aurelo_log( 'old images removed' );
	}
	/* ---------------- categories ---------------- */
	$cat = array();
	foreach ( array( 'Clothing', 'Women', 'Men', 'Footwear', 'Accessories', 'Lifestyle' ) as $n ) {
		$cat[ $n ] = aurelo_term( $n );
	}
	$cat_images = array( 'Clothing' => 'cat-clothing.jpg', 'Footwear' => 'cat-footwear.jpg', 'Accessories' => 'cat-accessories.jpg', 'Lifestyle' => 'cat-lifestyle.jpg', 'Women' => 'cat-women.jpg', 'Men' => 'cat-men.jpg' );
	$descs      = array(
		'Clothing'    => 'Linen, cotton and merino pieces cut for everyday wear.',
		'Women'       => 'Dresses, trousers and layers in natural fabrics.',
		'Men'         => 'Overshirts, knits and easy trousers made to last.',
		'Footwear'    => 'Leather sneakers, suede boots and canvas slip-ons, resoled and repaired in Jaipur.',
		'Accessories' => 'Bags, belts, scarves and small things that finish an outfit.',
		'Lifestyle'   => 'Candles, ceramics and textiles for slow mornings at home.',
	);
	foreach ( $cat as $n => $id ) {
		if ( ! $id ) {
			continue;
		}
		wp_update_term( $id, 'product_cat', array( 'description' => $descs[ $n ] ) );
		if ( isset( $cat_images[ $n ] ) ) {
			$mid = aurelo_media( $cat_images[ $n ], $n );
			if ( $mid ) {
				update_term_meta( $id, 'thumbnail_id', $mid );
			}
		}
	}
	aurelo_log( 'categories ok' );

	/* ---------------- products ---------------- */
	$S = array( 'S', 'M', 'L', 'XL' );
	$UK = array( 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11' );
	// slug_existing => null when it is a brand-new product
	$defs = array(
		// New products
		array( 'sku' => 'AUR-001', 'name' => 'Linen Overshirt', 'cats' => array( 'Clothing', 'Men' ), 'price' => 3499, 'regular' => 4499, 'sizes' => $S, 'stock' => 25, 'featured' => 1, 'short' => 'A relaxed overshirt in washed European linen with a soft collar and chest pocket.', 'desc' => 'A relaxed overshirt in washed European linen with a soft collar, chest pocket and corozo buttons. Cut slightly boxy; layer it over a tee or wear it open in summer. Machine wash cold.' ),
		array( 'sku' => 'AUR-002', 'name' => 'Merino Crew Sweater', 'cats' => array( 'Clothing', 'Men' ), 'price' => 4299, 'sizes' => $S, 'stock' => 18, 'short' => 'A fine-gauge merino crew that layers under everything.', 'desc' => 'Knitted from extra-fine merino wool that stays soft against the skin and does not pill easily. Ribbed cuffs and hem. Wash cold on the wool cycle.' ),
		array( 'sku' => 'AUR-004', 'name' => 'Pleated Wide Trousers', 'cats' => array( 'Clothing', 'Women' ), 'price' => 3799, 'sizes' => $S, 'stock' => 14, 'short' => 'High-waisted wide trousers with soft front pleats.', 'desc' => 'A wide, easy leg in a cotton-linen blend with front pleats, side pockets and a hidden hook closure. Falls just above the ankle.' ),
		array( 'sku' => 'AUR-005', 'name' => 'Wrap Midi Dress', 'cats' => array( 'Clothing', 'Women' ), 'price' => 4999, 'regular' => 6299, 'sizes' => $S, 'stock' => 9, 'featured' => 1, 'short' => 'A wrap midi dress in washed cotton with a tie waist.', 'desc' => 'A midi-length wrap dress in washed cotton with a tie waist, flutter sleeves and a gently flared skirt. Easy to dress up or down.' ),
		array( 'sku' => 'AUR-006', 'name' => 'Relaxed Denim Jacket', 'cats' => array( 'Clothing', 'Men', 'Women' ), 'price' => 5499, 'sizes' => $S, 'stock' => 3, 'short' => 'A softly washed denim jacket with a relaxed fit.', 'desc' => 'Mid-weight organic denim, washed for a lived-in feel. Metal shank buttons, two chest pockets and a relaxed, slightly cropped cut.' ),
		array( 'sku' => 'AUR-007', 'name' => 'Leather Court Sneaker', 'cats' => array( 'Footwear' ), 'price' => 6999, 'sizes' => $UK, 'stock' => 20, 'featured' => 1, 'short' => 'A minimal court sneaker in smooth vegetable-tanned leather.', 'desc' => 'Hand-finished in Jaipur from vegetable-tanned leather with a cushioned insole and a stitched rubber sole that can be resoled.' ),
		array( 'sku' => 'AUR-008', 'name' => 'Suede Chelsea Boot', 'cats' => array( 'Footwear', 'Men' ), 'price' => 8999, 'regular' => 10999, 'sizes' => $UK, 'stock' => 12, 'short' => 'A classic Chelsea boot in soft sand suede.', 'desc' => 'Soft suede upper, elastic side panels and a pull tab. Leather-lined with a stacked heel. Brush gently and keep away from heavy rain.' ),
		array( 'sku' => 'AUR-009', 'name' => 'Canvas Slip-on', 'cats' => array( 'Footwear' ), 'price' => 2799, 'sizes' => $UK, 'stock' => 30, 'short' => 'A lightweight canvas slip-on for warm days.', 'desc' => 'Washed organic canvas with a cushioned footbed and flexible rubber sole. Slips on easily and packs flat.' ),
		array( 'sku' => 'AUR-011', 'name' => 'Everyday Tote', 'cats' => array( 'Accessories' ), 'price' => 3299, 'stock' => 22, 'featured' => 1, 'short' => 'A roomy tote in heavy cotton canvas with leather handles.', 'desc' => 'Fits a laptop, a book and a water bottle. Heavy cotton canvas, an inside zip pocket and vegetable-tanned leather handles that darken with age.' ),
		array( 'sku' => 'AUR-012', 'name' => 'Wool Scarf', 'cats' => array( 'Accessories' ), 'price' => 2199, 'regular' => 2799, 'stock' => 0, 'short' => 'A generous scarf in brushed lambswool.', 'desc' => 'Brushed lambswool in a soft herringbone weave with hand-knotted fringe. Wide enough to wrap twice.' ),
		array( 'sku' => 'AUR-014', 'name' => 'Ceramic Mug Set', 'cats' => array( 'Lifestyle' ), 'price' => 1599, 'stock' => 40, 'short' => 'A set of two hand-glazed stoneware mugs.', 'desc' => 'Two hand-glazed stoneware mugs in speckled oat. Each holds 300 ml. Dishwasher and microwave safe.' ),
		array( 'sku' => 'AUR-015', 'name' => 'Soy Wax Candle', 'cats' => array( 'Lifestyle' ), 'price' => 899, 'stock' => 60, 'short' => 'A hand-poured soy candle with a cotton wick.', 'desc' => 'Poured by hand in small batches with a cotton wick and a quiet cedar and fig scent. Burns for about 40 hours.' ),
		array( 'sku' => 'AUR-016', 'name' => 'Linen Throw', 'cats' => array( 'Lifestyle' ), 'price' => 3999, 'stock' => 15, 'short' => 'A stonewashed linen throw for sofas and beds.', 'desc' => 'Stonewashed European linen that gets softer with every wash. Finished with a simple hem. 130 x 180 cm.' ),
		// Existing demo products, edited (matched by their current slug)
		array( 'old' => 'polo', 'sku' => 'AUR-021', 'name' => 'Pique Polo Shirt', 'cats' => array( 'Clothing', 'Men' ), 'price' => 1899, 'sizes' => $S, 'stock' => 35, 'short' => 'A soft cotton pique polo with a clean collar.', 'desc' => 'Breathable cotton pique with a two-button placket and ribbed collar. A smart everyday polo.' ),
		array( 'old' => 'long-sleeve-tee', 'sku' => 'AUR-022', 'name' => 'Organic Cotton Long Sleeve', 'cats' => array( 'Clothing', 'Women' ), 'price' => 1599, 'regular' => 1999, 'sizes' => $S, 'stock' => 28, 'short' => 'A long sleeve tee in soft organic cotton jersey.', 'desc' => 'Mid-weight organic cotton jersey with a relaxed neckline. Pre-washed to keep its shape.' ),
		array( 'old' => 'hoodie', 'sku' => 'AUR-023', 'name' => 'Brushed Cotton Hoodie', 'cats' => array( 'Clothing', 'Men' ), 'price' => 3199, 'sizes' => $S, 'stock' => 16, 'featured' => 1, 'short' => 'A heavyweight hoodie, brushed soft on the inside.', 'desc' => 'Heavyweight cotton fleece, brushed inside, with a double-layer hood and a roomy kangaroo pocket.' ),
		array( 'old' => 'hoodie-with-zipper', 'sku' => 'AUR-024', 'name' => 'Zip Hoodie', 'cats' => array( 'Clothing', 'Women' ), 'price' => 3499, 'sizes' => $S, 'stock' => 13, 'short' => 'A full-zip hoodie in dense, soft fleece.', 'desc' => 'A full-zip hoodie with metal zip, side pockets and ribbed cuffs. Cut to sit just below the hip.' ),
		array( 'old' => 'hoodie-with-pocket', 'sku' => 'AUR-025', 'name' => 'Relaxed Pocket Hoodie', 'cats' => array( 'Clothing', 'Men' ), 'price' => 2999, 'regular' => 3699, 'sizes' => $S, 'stock' => 11, 'short' => 'A relaxed hoodie with a large front pocket.', 'desc' => 'Soft loopback cotton in a relaxed fit with a big front pocket and drawcord hood.' ),
		array( 'old' => 't-shirt', 'sku' => 'AUR-026', 'name' => 'Everyday Cotton Tee', 'cats' => array( 'Clothing', 'Women', 'Men' ), 'price' => 999, 'sizes' => $S, 'stock' => 80, 'short' => 'The tee you will reach for first.', 'desc' => 'Organic cotton jersey, garment dyed and pre-washed. A simple crew neck that goes with everything.' ),
		array( 'old' => 't-shirt-with-logo', 'sku' => 'AUR-003', 'name' => 'Organic Cotton Tee', 'cats' => array( 'Clothing', 'Women' ), 'price' => 1299, 'sizes' => $S, 'stock' => 50, 'featured' => 1, 'short' => 'A boxy tee in heavy organic cotton.', 'desc' => 'Heavy organic cotton with a boxy fit, dropped shoulders and a clean neckline.' ),
		array( 'old' => 'v-neck-t-shirt', 'sku' => 'AUR-027', 'name' => 'Soft V-Neck Tee', 'cats' => array( 'Clothing', 'Men' ), 'price' => 1199, 'keep_variations' => 1, 'stock' => 40, 'short' => 'A soft V-neck tee in fine jersey.', 'desc' => 'Fine cotton jersey with a flattering V neckline. Available in three colours and three sizes.' ),
		array( 'old' => 'cap', 'sku' => 'AUR-028', 'name' => 'Canvas Cap', 'cats' => array( 'Accessories' ), 'price' => 999, 'stock' => 45, 'short' => 'A six-panel cap in washed canvas.', 'desc' => 'Six-panel washed cotton canvas with a curved brim and a brass adjuster at the back.' ),
		array( 'old' => 'belt', 'sku' => 'AUR-010', 'name' => 'Woven Leather Belt', 'cats' => array( 'Accessories' ), 'price' => 1899, 'stock' => 26, 'short' => 'A hand-woven leather belt with a brass buckle.', 'desc' => 'Strips of vegetable-tanned leather woven by hand and finished with a solid brass buckle.' ),
		array( 'old' => 'sunglasses', 'sku' => 'AUR-013', 'name' => 'Round Sunglasses', 'cats' => array( 'Accessories' ), 'price' => 2499, 'regular' => 2999, 'stock' => 33, 'short' => 'Round acetate sunglasses with UV400 lenses.', 'desc' => 'Light acetate frames with UV400 lenses and a soft case included.' ),
		array( 'old' => 'beanie', 'sku' => 'AUR-029', 'name' => 'Merino Beanie', 'cats' => array( 'Accessories' ), 'price' => 1299, 'stock' => 4, 'short' => 'A ribbed merino beanie that keeps its shape.', 'desc' => 'Ribbed extra-fine merino with a folded cuff. Warm without being bulky.' ),
		array( 'old' => 'hoodie-with-logo', 'sku' => 'AUR-031', 'name' => 'Fleece Pullover Hoodie', 'cats' => array( 'Clothing', 'Women' ), 'price' => 2799, 'sizes' => $S, 'stock' => 20, 'short' => 'A pullover hoodie in soft cotton fleece.', 'desc' => 'Soft cotton fleece with a relaxed fit, ribbed hem and a deep hood. Washes well and keeps its shape.' ),
		array( 'old' => 'beanie-with-logo', 'sku' => 'AUR-030', 'name' => 'Ribbed Wool Beanie', 'cats' => array( 'Accessories' ), 'price' => 999, 'regular' => 1399, 'stock' => 38, 'short' => 'A chunky ribbed beanie in soft wool.', 'desc' => 'Chunky rib in a soft wool blend with a generous fold. One size.' ),
	);

	$img_n = 0;
	foreach ( $defs as $d ) {
		$img_n++;
		$pid = 0;
		if ( ! empty( $d['old'] ) ) {
			$p = get_page_by_path( $d['old'], OBJECT, 'product' );
			if ( ! $p ) {
				$pid = wc_get_product_id_by_sku( $d['sku'] );
			} else {
				$pid = $p->ID;
			}
		} else {
			$pid = wc_get_product_id_by_sku( $d['sku'] );
		}
		$existing = $pid ? wc_get_product( $pid ) : null;
		$sizes    = isset( $d['sizes'] ) ? $d['sizes'] : array();
		$keep     = ! empty( $d['keep_variations'] ) && $existing && $existing->is_type( 'variable' );

		if ( $existing && $existing->is_type( 'variable' ) ) {
			$product = $existing;
		} elseif ( $sizes ) {
			// A variable product (size picker). If the old one was simple, change its type.
			$product = new WC_Product_Variable( $pid ? $pid : 0 );
		} else {
			$product = $existing && $existing->is_type( 'simple' ) ? $existing : new WC_Product_Simple( $pid ? $pid : 0 );
		}

		$product->set_name( $d['name'] );
		$product->set_slug( sanitize_title( $d['name'] ) );
		$product->set_status( 'publish' );
		$product->set_catalog_visibility( 'visible' );
		$product->set_short_description( $d['short'] );
		$product->set_description( $d['desc'] );
		$product->set_sku( '' ); // clear first so the new SKU never clashes
		$product->set_featured( ! empty( $d['featured'] ) );
		$product->set_category_ids( array_values( array_filter( array_map( function ( $n ) use ( $cat ) { return isset( $cat[ $n ] ) ? $cat[ $n ] : 0; }, $d['cats'] ) ) ) );
		$mid = aurelo_media( 'prod-' . sanitize_title( $d['name'] ) . '.jpg', $d['name'] );
		if ( $mid ) {
			$product->set_image_id( $mid );
			$next = aurelo_media( 'prod-' . sanitize_title( $d['name'] ) . '-2.jpg', $d['name'] . ' detail' );
			if ( $next ) {
				$product->set_gallery_image_ids( array( $next ) );
			}
		}

		if ( $product->is_type( 'variable' ) ) {
			if ( ! $keep ) {
				$attr = new WC_Product_Attribute();
				$attr->set_name( strpos( $sizes[0], 'UK' ) === 0 ? 'Size' : 'Size' );
				$attr->set_options( $sizes );
				$attr->set_visible( true );
				$attr->set_variation( true );
				$product->set_attributes( array( $attr ) );
			}
			$product->set_manage_stock( false );
			$product->set_stock_status( 'instock' );
			$product->set_sku( $d['sku'] );
			$product->save();
			if ( ! $keep ) {
				foreach ( $product->get_children() as $child ) {
					wp_delete_post( $child, true );
				}
				foreach ( $sizes as $i => $size ) {
					$v = new WC_Product_Variation();
					$v->set_parent_id( $product->get_id() );
					$v->set_attributes( array( 'size' => $size ) );
					$v->set_regular_price( isset( $d['regular'] ) ? $d['regular'] : $d['price'] );
					if ( isset( $d['regular'] ) ) {
						$v->set_sale_price( $d['price'] );
					}
					$v->set_manage_stock( true );
					$v->set_stock_quantity( max( 0, $d['stock'] - $i * 2 ) );
					$v->set_stock_status( $d['stock'] - $i * 2 > 0 ? 'instock' : 'outofstock' );
					$v->save();
				}
			} else {
				foreach ( $product->get_children() as $child ) {
					$v = wc_get_product( $child );
					$v->set_regular_price( isset( $d['regular'] ) ? $d['regular'] : $d['price'] );
					$v->set_sale_price( isset( $d['regular'] ) ? $d['price'] : '' );
					$v->save();
				}
			}
			WC_Product_Variable::sync( $product->get_id() );
		} else {
			$product->set_regular_price( isset( $d['regular'] ) ? $d['regular'] : $d['price'] );
			$product->set_sale_price( isset( $d['regular'] ) ? $d['price'] : '' );
			$product->set_manage_stock( true );
			$product->set_stock_quantity( $d['stock'] );
			$product->set_stock_status( $d['stock'] > 0 ? 'instock' : 'outofstock' );
			$product->set_low_stock_amount( 5 );
			$product->set_sku( $d['sku'] );
			$product->save();
		}
		aurelo_log( ( $existing ? 'updated ' : 'created ' ) . $d['name'] . ' #' . $product->get_id() );
		$defs_by_name[ $d['name'] ] = $product->get_id();
	}

	/* Draft the demo items that do not belong to the Aurelo brand (reversible) */
	foreach ( array( 'wordpress-pennant', 'logo-collection', 'single', 'album' ) as $slug ) {
		$p = get_page_by_path( $slug, OBJECT, 'product' );
		if ( $p ) {
			wp_update_post( array( 'ID' => $p->ID, 'post_status' => 'draft' ) );
			aurelo_log( 'drafted ' . $slug );
		}
	}

	/* ---------------- reviews ---------------- */
	$reviews = array(
		'Linen Overshirt'      => array( array( 'Anaya M.', 5, 'Fits exactly as described', 'Soft from day one and drapes well. The olive is deeper than it looks online.' ), array( 'Rohan I.', 4, 'Worth it', 'Good weight, buttons feel solid. Runs slightly boxy as promised.' ) ),
		'Leather Court Sneaker' => array( array( 'Kavya R.', 5, 'Comfortable straight away', 'No break-in needed and the leather looks lovely.' ) ),
		'Everyday Tote'        => array( array( 'Meera S.', 5, 'Holds everything', 'Laptop, lunch and a book fit easily. Handles feel sturdy.' ), array( 'Arjun K.', 5, 'Great canvas', 'Heavy and well stitched.' ) ),
		'Organic Cotton Tee'   => array( array( 'Isha P.', 4, 'Good everyday tee', 'Boxy fit is just right and it washes well.' ) ),
	);
	foreach ( $reviews as $pname => $list ) {
		$pid = isset( $defs_by_name[ $pname ] ) ? $defs_by_name[ $pname ] : 0;
		if ( ! $pid || get_comments( array( 'post_id' => $pid, 'type' => 'review', 'count' => true ) ) ) {
			continue;
		}
		$sum = 0;
		foreach ( $list as $r ) {
			$cid = wp_insert_comment( array(
				'comment_post_ID'      => $pid,
				'comment_author'       => $r[0],
				'comment_author_email' => strtolower( preg_replace( '/[^a-z]/i', '', $r[0] ) ) . '@example.com',
				'comment_content'      => '<strong>' . $r[2] . '</strong> ' . $r[3],
				'comment_type'         => 'review',
				'comment_approved'     => 1,
			) );
			update_comment_meta( $cid, 'rating', $r[1] );
			update_comment_meta( $cid, 'verified', 1 );
			$sum += $r[1];
		}
		$p = wc_get_product( $pid );
		$p->set_average_rating( round( $sum / count( $list ), 2 ) );
		$p->set_review_count( count( $list ) );
		$p->set_rating_counts( array_count_values( array_map( function ( $r ) { return $r[1]; }, $list ) ) );
		$p->save();
	}
	aurelo_log( 'reviews ok' );

	/* ---------------- Aurelo Content images ---------------- */
	$opts = get_option( 'aurelo_options', array() );
	$opts = is_array( $opts ) ? $opts : array();
	foreach ( array( 'hero_image' => 'hero.jpg', 'promo_image' => 'promo.jpg', 'editorial_image' => 'editorial.jpg', 'about_image' => 'about-hero.jpg', 'about_gallery1' => 'about-1.jpg', 'about_gallery2' => 'about-2.jpg', 'about_gallery3' => 'about-3.jpg', 'insta1_image' => 'insta-1.jpg', 'insta2_image' => 'insta-2.jpg', 'insta3_image' => 'insta-3.jpg', 'insta4_image' => 'insta-4.jpg', 'insta5_image' => 'insta-5.jpg', 'insta6_image' => 'insta-6.jpg' ) as $k => $f ) {
		$mid = aurelo_media( $f, ucwords( str_replace( '_', ' ', $k ) ) );
		if ( $mid ) {
			$opts[ $k ] = $mid;
		}
	}
	update_option( 'aurelo_options', $opts );
	aurelo_log( 'content images ok' );

	/* ---------------- Testimonials ---------------- */
	$testimonials = array(
		array( 'Anaya Mehta', 'Mumbai', 'The overshirt fits exactly like the photos and the linen has softened beautifully after two washes.' ),
		array( 'Rohan Iyer', 'Bengaluru', 'Delivery in three days to Bengaluru, and the boots came with a dust bag and care card. Rare.' ),
		array( 'Kavya Reddy', 'Hyderabad', 'Exchanged a size without any back and forth. That is why I keep coming back.' ),
	);
	if ( ! wp_count_posts( 'testimonial' )->publish ) {
		foreach ( $testimonials as $i => $t ) {
			$id = wp_insert_post( array( 'post_type' => 'testimonial', 'post_status' => 'publish', 'post_title' => $t[0], 'post_content' => $t[2], 'menu_order' => $i ) );
			update_post_meta( $id, 'city', $t[1] );
		}
	}
	aurelo_log( 'testimonials ok' );

	/* ---------------- FAQs ---------------- */
	$faqs = array(
		'Orders'   => array( array( 'Can I change or cancel my order?', 'You can change or cancel within two hours of ordering. Write to us from the Contact page with your order number.' ), array( 'How do I track my order?', 'Open My account > My orders to see the status of every order you have placed while logged in.' ) ),
		'Shipping' => array( array( 'How long does delivery take?', 'Standard delivery takes 3-5 working days across India; Express takes 1-2 working days in metro cities.' ), array( 'Is shipping free?', 'Shipping is free on orders above ₹2,999. Below that, standard shipping is ₹99.' ), array( 'Do you deliver to my PIN code?', 'We deliver to most PIN codes in India. Enter your PIN code at checkout to see your delivery options.' ) ),
		'Returns'  => array( array( 'What is your return policy?', 'You can return unworn pieces with their tags within 15 days of delivery for a refund or exchange.' ), array( 'How do I exchange a size?', 'Start an exchange from the Contact page and we will arrange a pickup and send the new size.' ) ),
		'Payments' => array( array( 'Which payment methods do you accept?', 'UPI, cards, netbanking and cash on delivery.' ) ),
	);
	if ( ! wp_count_posts( 'aurelo_faq' )->publish ) {
		$order = 0;
		foreach ( $faqs as $cname => $list ) {
			$tid = aurelo_term( $cname, 'faq_category' );
			foreach ( $list as $f ) {
				$id = wp_insert_post( array( 'post_type' => 'aurelo_faq', 'post_status' => 'publish', 'post_title' => $f[0], 'post_content' => $f[1], 'menu_order' => $order++ ) );
				wp_set_object_terms( $id, array( $tid ), 'faq_category' );
			}
		}
	}
	aurelo_log( 'faqs ok' );

	/* ---------------- Pages ---------------- */
	$para = function ( $t ) { return "<p>$t</p>"; };
	$pages = array(
		'about'    => array( 'Made slowly, worn for years.', '<h2>Our story</h2>' . $para( 'Aurelo began in a Jaipur workshop in 2019 with one linen shirt and a belief that everyday clothes should be made well and last for years.' ) . '<h2>What we stand for</h2>' . $para( 'Natural fabrics, fair work and quiet colours. We make small batches, repair what we sell and tell you where each piece comes from.' ) . '<h2>Made in Jaipur</h2>' . $para( 'Our studio and store are on Bapu Bazaar Road. Visit us, or write to us from the Contact page.' ) ),
		'returns'  => array( 'Return and refund policy', '<h2>Returns window</h2>' . $para( 'You can return unworn pieces with their tags within 15 days of delivery.' ) . '<h2>How to return</h2>' . $para( 'Write to us from the Contact page with your order number. We arrange a free pickup within India.' ) . '<h2>Refunds</h2>' . $para( 'Refunds go back to your original payment method within 5-7 working days of us receiving the piece.' ) . '<h2>Exchanges</h2>' . $para( 'Need a different size? We send the new piece as soon as the pickup is booked.' ) ),
		'shipping' => array( 'Shipping policy', '<h2>Delivery times</h2>' . $para( 'Standard delivery takes 3-5 working days across India. Express takes 1-2 working days in metro cities.' ) . '<h2>Shipping costs</h2>' . $para( 'Shipping is free on orders above ₹2,999. Standard shipping below that is ₹99 and Express is ₹199.' ) . '<h2>Tracking</h2>' . $para( 'You will receive an email as soon as your order ships, and you can follow it in My account.' ) ),
		'privacy'  => array( 'Privacy policy', '<h2>What we collect</h2>' . $para( 'Your name, email, phone number and address so we can deliver your order, and the messages you send us.' ) . '<h2>How we use it</h2>' . $para( 'Only to fulfil orders, answer questions and, if you subscribe, send occasional offers. We never sell your data.' ) . '<h2>Your choices</h2>' . $para( 'Write to us at any time to see, correct or delete your information.' ) ),
		'terms'    => array( 'Terms of service', '<h2>Using the store</h2>' . $para( 'By placing an order you agree to these terms and to our returns policy.' ) . '<h2>Prices and payment</h2>' . $para( 'Prices are in Indian rupees and include applicable taxes. This is a demo store: no real payments are taken.' ) . '<h2>Changes</h2>' . $para( 'We may update these terms. The date at the top of the page shows the latest version.' ) ),
	);
	foreach ( $pages as $slug => $pg ) {
		$ex = get_page_by_path( $slug );
		$arr = array( 'post_type' => 'page', 'post_status' => 'publish', 'post_title' => $pg[0], 'post_name' => $slug, 'post_content' => $pg[1] );
		if ( $ex ) {
			$arr['ID'] = $ex->ID;
			wp_update_post( $arr );
		} else {
			wp_insert_post( $arr );
		}
	}
	aurelo_log( 'pages ok' );

	/* ---------------- Menus ---------------- */
	$menus = array(
		'primary'        => array( 'Main menu', array( array( 'New In', '/shop' ), array( 'Women', '/category/women' ), array( 'Men', '/category/men' ), array( 'Footwear', '/category/footwear' ), array( 'Accessories', '/category/accessories' ), array( 'Lifestyle', '/category/lifestyle' ), array( 'Sale', '/category/sale' ) ) ),
		'footer_shop'    => array( 'Footer: Shop', array( array( 'New In', '/shop' ), array( 'Women', '/category/women' ), array( 'Men', '/category/men' ), array( 'Footwear', '/category/footwear' ), array( 'Accessories', '/category/accessories' ), array( 'Lifestyle', '/category/lifestyle' ) ) ),
		'footer_help'    => array( 'Footer: Help', array( array( 'Shipping', '/policies/shipping' ), array( 'Returns & Refunds', '/policies/returns' ), array( 'Track order', '/account/orders' ), array( 'FAQ', '/faq' ) ) ),
		'footer_company' => array( 'Footer: Company', array( array( 'About Aurelo', '/about' ), array( 'Contact', '/contact' ), array( 'Privacy', '/policies/privacy' ), array( 'Terms', '/policies/terms' ) ) ),
		'footer_legal'   => array( 'Footer: Legal', array( array( 'Privacy', '/policies/privacy' ), array( 'Terms', '/policies/terms' ), array( 'Shipping', '/policies/shipping' ), array( 'Returns', '/policies/returns' ) ) ),
	);
	$locations = get_theme_mod( 'nav_menu_locations', array() );
	foreach ( $menus as $loc => $m ) {
		$menu = wp_get_nav_menu_object( $m[0] );
		$mid  = $menu ? $menu->term_id : wp_create_nav_menu( $m[0] );
		if ( is_wp_error( $mid ) ) {
			continue;
		}
		foreach ( (array) wp_get_nav_menu_items( $mid ) as $it ) {
			wp_delete_post( $it->ID, true );
		}
		foreach ( $m[1] as $pos => $item ) {
			wp_update_nav_menu_item( $mid, 0, array( 'menu-item-title' => $item[0], 'menu-item-url' => $item[1], 'menu-item-type' => 'custom', 'menu-item-status' => 'publish', 'menu-item-position' => $pos + 1 ) );
		}
		$locations[ $loc ] = $mid;
	}
	set_theme_mod( 'nav_menu_locations', $locations );
	aurelo_log( 'menus ok' );

	if ( function_exists( 'wc_delete_product_transients' ) ) {
		wc_delete_product_transients();
	}
	delete_transient( 'wc_products_onsale' );
	aurelo_log( 'DONE' );
}
