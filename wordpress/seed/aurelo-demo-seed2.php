<?php
/**
 * One-time demo update: size-based prices and customer reviews (star ratings) on the demo products.
 * Run once from this computer: https://headless-live-ecommerce.vercel.app//?aurelo_seed2=aurelo-demo-2026
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	if ( empty( $_GET['aurelo_seed2'] ) || 'aurelo-demo-2026' !== $_GET['aurelo_seed2'] ) {
		return;
	}
	if ( ! in_array( isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '', array( '127.0.0.1', '::1' ), true ) ) {
		wp_die( 'Local only.' );
	}
	if ( ! class_exists( 'WooCommerce' ) ) {
		wp_die( 'WooCommerce is not active.' );
	}
	@set_time_limit( 300 );
	header( 'Content-Type: text/plain; charset=utf-8' );

	/* ---------- 1. Prices that change with size ---------- */
	// extra rupees per size position (S, M, L, XL) or (UK 6 ... UK 11)
	$clothing = array( 0, 0, 150, 300 );
	$shoes    = array( 0, 0, 0, 200, 300, 400 );
	$products = wc_get_products( array( 'status' => 'publish', 'type' => 'variable', 'limit' => -1 ) );
	foreach ( $products as $p ) {
		$children = $p->get_children();
		$base     = null;
		$vars     = array();
		foreach ( $children as $cid ) {
			$v = wc_get_product( $cid );
			if ( ! $v ) {
				continue;
			}
			$vars[] = $v;
		}
		// keep a stable order by size label
		$first   = ! empty( $vars ) ? $vars[0]->get_attributes() : array();
		$is_shoe = isset( $first['size'] ) && 0 === strpos( $first['size'], 'UK' );
		$order   = $is_shoe ? array( 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11' ) : array( 'S', 'M', 'L', 'XL' );
		foreach ( $vars as $v ) {
			$attrs = $v->get_attributes();
			$size  = isset( $attrs['size'] ) ? $attrs['size'] : '';
			$pos   = array_search( $size, $order, true );
			if ( false === $pos ) {
				continue; // e.g. the V-Neck tee keeps its colour/size variations unchanged
			}
			$extra = $is_shoe ? $shoes[ $pos ] : $clothing[ $pos ];
			$reg   = (float) $p->get_variation_regular_price( 'min', false );
			$sale  = (float) $p->get_variation_sale_price( 'min', false );
			if ( null === $base ) {
				$base = array( $reg, $sale );
			}
			$v->set_regular_price( $base[0] + $extra );
			if ( $base[1] > 0 && $base[1] < $base[0] ) {
				$v->set_sale_price( $base[1] + $extra );
			}
			// make one large size sold out on a few products so the picker shows it
			if ( in_array( $p->get_name(), array( 'Merino Crew Sweater', 'Brushed Cotton Hoodie', 'Leather Court Sneaker' ), true ) && ( 'XL' === $size || 'UK 11' === $size ) ) {
				$v->set_stock_quantity( 0 );
				$v->set_stock_status( 'outofstock' );
			}
			$v->save();
		}
		WC_Product_Variable::sync( $p->get_id() );
		echo 'prices ' . $p->get_name() . "\n";
	}

	/* ---------- 2. Reviews so every product shows stars ---------- */
	$people  = array( 'Anaya M.', 'Rohan I.', 'Kavya R.', 'Meera S.', 'Arjun K.', 'Isha P.', 'Vikram T.', 'Neha B.', 'Karan D.', 'Sana H.' );
	$pool    = array(
		array( 5, 'Lovely quality', 'Feels premium and looks exactly like the pictures.' ),
		array( 5, 'Worth every rupee', 'Well made and fits true to size. Already ordered a second one.' ),
		array( 4, 'Very good', 'Great fabric and finish. Delivery was quick too.' ),
		array( 4, 'Happy with it', 'Comfortable and easy to style. Colour is slightly softer than online.' ),
		array( 5, 'Exactly what I wanted', 'Simple, clean and made to last. Packaging was lovely.' ),
		array( 3, 'Good, not perfect', 'Nice product but I would size up. Support exchanged it quickly.' ),
	);
	$all = wc_get_products( array( 'status' => 'publish', 'limit' => -1 ) );
	$i   = 0;
	foreach ( $all as $p ) {
		$pid = $p->get_id();
		if ( get_comments( array( 'post_id' => $pid, 'type' => 'review', 'count' => true ) ) ) {
			continue;
		}
		$n   = 2 + ( $i % 3 ); // 2 to 4 reviews
		$sum = 0;
		$cnt = array();
		for ( $k = 0; $k < $n; $k++ ) {
			$r      = $pool[ ( $i + $k * 2 ) % count( $pool ) ];
			$person = $people[ ( $i * 3 + $k ) % count( $people ) ];
			$cid    = wp_insert_comment( array(
				'comment_post_ID'      => $pid,
				'comment_author'       => $person,
				'comment_author_email' => strtolower( preg_replace( '/[^a-z]/i', '', $person ) ) . $k . '@example.com',
				'comment_content'      => '<strong>' . $r[1] . '</strong> ' . $r[2],
				'comment_type'         => 'review',
				'comment_approved'     => 1,
				'comment_date'         => gmdate( 'Y-m-d H:i:s', time() - ( $i + $k + 1 ) * 86400 * 3 ),
			) );
			update_comment_meta( $cid, 'rating', $r[0] );
			update_comment_meta( $cid, 'verified', 1 );
			$sum += $r[0];
			$cnt[ $r[0] ] = isset( $cnt[ $r[0] ] ) ? $cnt[ $r[0] ] + 1 : 1;
		}
		$p->set_average_rating( round( $sum / $n, 2 ) );
		$p->set_review_count( $n );
		$p->set_rating_counts( $cnt );
		$p->save();
		echo 'reviews ' . $p->get_name() . ' (' . $n . ")\n";
		$i++;
	}
	wc_delete_product_transients();
	echo "DONE\n";
	exit;
}, 99 );
