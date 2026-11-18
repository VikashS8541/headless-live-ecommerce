import { formatPrice, stripHtml } from './format.js'
import { tx } from './text.js'

/** Turns one WooCommerce product (Store API shape) into a ProductCard. */
export function cardProps(p) {
  const prices = p.prices || {}
  const onSale = p.on_sale && Number(prices.regular_price) > Number(prices.price)
  const badges = []
  if (onSale) badges.push({ kind: 'b-sale', text: tx('badge_sale') })
  if (!p.is_in_stock) badges.push({ kind: 'b-out', text: tx('badge_soldout') })
  else if (p.low_stock_remaining) badges.push({ kind: 'b-low', text: tx('badge_low', { count: p.low_stock_remaining }) })
  return {
    id: p.id,
    name: stripHtml(p.name),
    slug: p.slug,
    image: p.images?.[0]?.src,
    imageSrcSet: p.images?.[0]?.srcset,
    category: (p.categories || []).map(c => stripHtml(c.name)).join(' · '),
    tone: `t${(p.id % 6) + 1}`,
    badges,
    price: formatPrice(prices.price, prices),
    rating: Number(p.average_rating) || 0,
    reviews: p.review_count || 0,
    was: onSale ? formatPrice(prices.regular_price, prices) : undefined,
    off: onSale ? `−${Math.round((1 - Number(prices.price) / Number(prices.regular_price)) * 100)}%` : undefined,
  }
}
