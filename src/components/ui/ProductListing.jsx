import { Link, useSearchParams } from 'react-router'
import { useCategories, useProducts } from '../../api/hooks.js'
import { stripHtml } from '../../lib/format.js'
import ProductGrid from './ProductGrid.jsx'
import Pagination from './Pagination.jsx'
import { useText } from '../../lib/text.js'

const PER_PAGE = 9

const SORTS = {
  featured: { label: 'sort_featured', params: { orderby: 'menu_order', order: 'asc' } },
  newest: { label: 'sort_newest', params: { orderby: 'date', order: 'desc' } },
  'price-asc': { label: 'sort_price_asc', params: { orderby: 'price', order: 'asc' } },
  'price-desc': { label: 'sort_price_desc', params: { orderby: 'price', order: 'desc' } },
  rating: { label: 'sort_rating', params: { orderby: 'rating', order: 'desc' } },
}

/**
 * Sidebar filters + toolbar + product grid + pagination.
 * Shared by the Shop page (no category) and Category pages (slug).
 * Filters live in the address bar (?sort=&page=&instock=1&min=&max=) so links can be shared.
 */
export default function ProductListing({ categorySlug }) {
  const tx = useText()
  const [sp, setSp] = useSearchParams()
  const sort = SORTS[sp.get('sort')] ? sp.get('sort') : 'featured'
  const page = Number(sp.get('page')) || 1
  const inStock = sp.get('instock') === '1'
  const min = sp.get('min') || ''
  const max = sp.get('max') || ''

  const { data: cats } = useCategories()
  const topCats = (cats || []).filter(c => !c.parent)

  const params = {
    per_page: PER_PAGE,
    page,
    ...SORTS[sort].params,
    ...(categorySlug === 'sale' ? { on_sale: true } : categorySlug ? { category: categorySlug } : {}),
    ...(inStock ? { stock_status: ['instock'] } : {}),
    // The shop stores prices in paise (minor units), so rupees x 100
    ...(min ? { min_price: Number(min) * 100 } : {}),
    ...(max ? { max_price: Number(max) * 100 } : {}),
  }
  const { data, isLoading, isError, isFetching } = useProducts(params)

  const update = changes => {
    const next = new URLSearchParams(sp)
    for (const [k, v] of Object.entries(changes)) (v === '' || v == null || v === false) ? next.delete(k) : next.set(k, v)
    if (!('page' in changes)) next.delete('page')
    setSp(next)
  }

  return (
    <section className="pb-12 pt-12 md:pb-16 lg:pb-24">
      <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          <aside className="filters">
            <div className="fgrp">
              <h5>{tx('filter_category')}</h5>
              <ul>
                <li><Link to="/shop" className={`no-underline ${!categorySlug ? 'font-semibold' : ''}`}>{tx('filter_all')}</Link></li>
                {topCats.map(c => (
                  <li key={c.id}>
                    <Link to={`/category/${c.slug}`} className={`no-underline ${categorySlug === c.slug ? 'font-semibold' : ''}`}>
                      {stripHtml(c.name)} <span className="text-xs leading-[18px] text-ink-muted">({c.count})</span>
                    </Link>
                  </li>
                ))}
                <li><Link to="/category/sale" className={`no-underline ${categorySlug === 'sale' ? 'font-semibold' : ''}`}>{tx('filter_sale')}</Link></li>
              </ul>
            </div>
            <div className="fgrp">
              <h5>{tx('filter_price')}</h5>
              <div className="flex items-center gap-2">
                <input className="input h-11" type="number" min="0" placeholder={tx('ph_min')} defaultValue={min} key={'min' + min}
                  onBlur={e => update({ min: e.target.value })} />
                <input className="input h-11" type="number" min="0" placeholder={tx('ph_max')} defaultValue={max} key={'max' + max}
                  onBlur={e => update({ max: e.target.value })} />
              </div>
            </div>
            <div className="fgrp">
              <h5>{tx('filter_avail')}</h5>
              <ul>
                <li>
                  <label className="chk">
                    <input type="checkbox" checked={inStock} onChange={e => update({ instock: e.target.checked ? '1' : '' })} />{tx('filter_instock')}
                  </label>
                </li>
              </ul>
            </div>
          </aside>
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm leading-[22px] text-ink-muted">
                {isLoading ? tx('loading_products') : tx('products_count', { count: data?.total ?? 0 })}
              </span>
              <select className="select h-11 w-full sm:w-[220px]" value={sort} onChange={e => update({ sort: e.target.value === 'featured' ? '' : e.target.value })} aria-label={tx('sort_label')}>
                {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{tx('sort_prefix', { label: tx(s.label) })}</option>)}
              </select>
            </div>
            <div className={isFetching && !isLoading ? 'opacity-60 transition-opacity' : ''}>
              <ProductGrid
                products={data?.items}
                loading={isLoading}
                error={isError}
                columns={3}
                skeletons={6}
                emptyTitle={tx('listing_empty_title')}
                emptyText={tx('listing_empty_text')}
              />
            </div>
            <Pagination page={page} totalPages={data?.totalPages} onChange={n => update({ page: String(n) })} />
          </div>
        </div>
      </div>
    </section>
  )
}
