import axios from 'axios'

// The WordPress address comes from the .env file (VITE_WP_URL).
export const WP_URL = (import.meta.env.VITE_WP_URL || 'https://headless-live-ecommerce.vercel.app/').replace(/\/$/, '')

const http = axios.create({ baseURL: `${WP_URL}/wp-json`, timeout: 15000 })

const get = (url, params) => http.get(url, { params })

/* ---------- WooCommerce products (public "Store API", no login needed) ---------- */

// params: { category (slug or id), search, page, per_page, orderby, order, on_sale, include, exclude }
export async function fetchProducts(params = {}) {
  const query = { per_page: 12, ...params }
  // The Store API wants a category slug/ID in `category`
  const res = await get('/wc/store/v1/products', query)
  return {
    items: res.data,
    total: Number(res.headers['x-wp-total'] ?? res.data.length),
    totalPages: Number(res.headers['x-wp-totalpages'] ?? 1),
  }
}

export async function fetchProduct(slug) {
  const res = await get('/wc/store/v1/products', { slug })
  return res.data[0] || null
}

export async function fetchCategories() {
  const res = await get('/wc/store/v1/products/categories', { per_page: 100, hide_empty: false })
  return res.data
}

/* ---------- WordPress pages, FAQs, testimonials ---------- */

export async function fetchPage(slug) {
  const res = await get('/wp/v2/pages', { slug, _fields: 'id,slug,title,content,modified' })
  return res.data[0] || null
}

export async function fetchFaqs() {
  const [faqs, cats] = await Promise.all([
    get('/wp/v2/faqs', { per_page: 100, orderby: 'menu_order', order: 'asc' }),
    get('/wp/v2/faq_categories', { per_page: 100 }),
  ])
  return { faqs: faqs.data, categories: cats.data }
}

export async function fetchTestimonials() {
  const res = await get('/wp/v2/testimonials', { per_page: 12, orderby: 'menu_order', order: 'asc' })
  return res.data
}

/* ---------- Site options + menus (from the Aurelo Content admin screen) ---------- */

export async function fetchSite() {
  const res = await get('/aurelo/v1/site')
  return res.data
}

/* ---------- Product reviews (WooCommerce Store API) ---------- */
export async function fetchReviews(productId) {
  const res = await get('/wc/store/v1/products/reviews', { product_id: productId, per_page: 10 })
  return res.data
}

/* ---------- Size / colour variations (each has its own price and stock) ---------- */
export async function fetchVariations(productId) {
  const res = await get('/wc/store/v1/products', { type: 'variation', parent: productId, per_page: 50 })
  return res.data
}
