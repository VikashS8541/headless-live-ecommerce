import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Stars from '../components/ui/Stars.jsx'
import Html from '../components/ui/Html.jsx'
import { useCartActions, useProduct, useProducts, useReviews, useSite, useVariations } from '../api/hooks.js'
import { findVariation, normaliseVariations, optionAvailable } from '../lib/variations.js'
import { errorMessage } from '../api/errors.js'
import { useWishlist } from '../lib/wishlist.js'
import { formatPrice, stripHtml } from '../lib/format.js'
import { useText } from '../lib/text.js'

const OVERLINE = 'font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong'
const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'
const Chevron = () => (
  <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
)

const RECENT_KEY = 'aurelo_recent'
function readRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] } catch { return [] }
}

function Skeleton() {
  return (
    <section className={`${WRAP} pb-24 pt-8`}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="sk aspect-[4/5]" />
        <div className="flex flex-col gap-4"><div className="sk h-6 w-1/3" /><div className="sk h-10 w-2/3" /><div className="sk h-8 w-1/4" /></div>
      </div>
    </section>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  // key={slug}: opening another product starts with fresh tab / image / quantity state
  return <ProductDetail key={slug} slug={slug} />
}

function ProductDetail({ slug }) {
  const tx = useText()
  const { data: p, isLoading, isError } = useProduct(slug)
  const { data: site } = useSite()
  const o = site?.options || {}
  const [tab, setTab] = useState('description')
  const [img, setImg] = useState(0)
  const [brokenSrc, setBrokenSrc] = useState('')
  const [qty, setQty] = useState(1)
  const [chosen, setChosen] = useState({})
  const [recent] = useState(readRecent)
  const { add } = useCartActions()
  const wishlist = useWishlist()
  const [added, setAdded] = useState(false)
  const [pickError, setPickError] = useState('')

  const catSlug = p?.categories?.[0]?.slug
  const { data: related, isLoading: relLoading } = useProducts(
    { per_page: 5, category: catSlug },
    { enabled: !!catSlug },
  )
  const { data: reviews } = useReviews(p?.id)
  const { data: variationData } = useVariations(p?.id, p?.type === 'variable')
  const { data: recentData } = useProducts({ include: recent.filter(id => id !== p?.id).slice(0, 4), per_page: 4 }, { enabled: recent.filter(id => id !== p?.id).length > 0 })

  // Remember this product for "Recently viewed"
  useEffect(() => {
    if (!p) return
    const next = [p.id, ...readRecent().filter(id => id !== p.id)].slice(0, 8)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch { /* private mode: ignore */ }
  }, [p])

  if (isLoading) return <Layout><Skeleton /></Layout>
  if (isError || !p) {
    return (
      <Layout>
        <section className={`${WRAP} py-16`}>
          <EmptyState title={tx('product_not_found_title')} text={tx('product_not_found_text')} actionLabel={tx('continue_shopping')} actionTo="/shop" />
        </section>
      </Layout>
    )
  }

  const variations = normaliseVariations(variationData)
  const picked = findVariation(variations, chosen)
  const allChosen = (p.attributes || []).filter(a => a.has_variations).every(a => chosen[a.name])
  // The price shown follows the chosen size/colour. Until one is chosen a variable product shows "From".
  const prices = (allChosen && picked?.prices) || p.prices
  const range = p.prices.price_range
  const showFrom = p.type === 'variable' && !(allChosen && picked) && range && range.min_amount !== range.max_amount
  const unit = Number(prices.price)
  const onSale = Number(prices.regular_price) > Number(prices.price)
  const name = stripHtml(p.name)
  // No photo in WordPress yet? Show a demo photo so the page still looks finished
  const images = (p.images || []).filter(im => im.src || im.thumbnail)
  // Some products return an empty full-size src but still have a thumbnail, so fall back to it
  const mainSrc = images[img]?.src || images[img]?.thumbnail
  const variationAttrs = (p.attributes || []).filter(a => a.has_variations)
  const specAttrs = (p.attributes || []).filter(a => !a.has_variations)
  const reviewCount = p.review_count || 0
  const addToCart = () => {
    const missing = variationAttrs.filter(a => !chosen[a.name])
    if (missing.length) { setPickError(tx('pick_first', { options: missing.map(a => a.name.toLowerCase()).join(' ' + tx('and') + ' ') })); return }
    setPickError('')
    add.mutate(
      {
        id: p.id,
        quantity: qty,
        variation: variationAttrs.map(a => ({ attribute: a.name, value: a.terms.find(t => t.name === chosen[a.name]).slug })),
      },
      { onSuccess: () => { setAdded(true); setTimeout(() => setAdded(false), 2500) } },
    )
  }
  const relatedItems = (related?.items || []).filter(x => x.id !== p.id).slice(0, 4)

  const available = allChosen && picked ? picked.inStock : p.is_in_stock
  const stock = !available
    ? { cls: 'msg err', text: tx('stock_out') }
    : p.low_stock_remaining
      ? { cls: 'msg ok', text: tx('stock_low', { count: p.low_stock_remaining }) }
      : { cls: 'msg ok', text: tx('stock_in') }

  return (
    <Layout>
      <div className={`${WRAP} pt-6`}>
        <nav className="crumbs" aria-label={tx('bc_label')}>
          <Link to="/">{tx('bc_home')}</Link><Chevron />
          {catSlug && <><Link to={`/category/${catSlug}`}>{stripHtml(p.categories[0].name)}</Link><Chevron /></>}
          <span aria-current="page">{name}</span>
        </nav>
      </div>

      <section className={`${WRAP} pb-12 pt-8 md:pb-16 lg:pb-24`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[88px_1fr]">
            {images.length > 1 && (
              <div className="thumbs order-2 lg:order-1">
                {images.map((im, i) => (
                  <button key={im.id} className={`th ${i === img ? 'on' : ''}`} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`}>
                    <img src={im.thumbnail || im.src} alt="" className="aspect-[1/1] w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative order-1 lg:order-2">
              {mainSrc && mainSrc !== brokenSrc ? (
                <img src={mainSrc} alt={images[img]?.alt || name} onError={() => setBrokenSrc(mainSrc)} className="aspect-[4/5] w-full rounded-sm object-cover" />
              ) : (
                <div className="ph t1 aspect-[4/5]"><span className="ph-l">{name}</span></div>
              )}
              {onSale && <span className="badge b-sale absolute left-4 top-4">Sale</span>}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className={OVERLINE}>{p.categories.map(c => stripHtml(c.name)).join(' · ')}</span>
              <h1 className="h2 mt-2">{name}</h1>
              <div className="mt-3">
                {reviewCount > 0
                  ? <button className="bg-transparent p-0" onClick={() => { setTab('reviews'); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }) }}><Stars value={p.average_rating} label={`${Number(p.average_rating).toFixed(1)} (${reviewCount} ${reviewCount === 1 ? tx('review_one') : tx('review_many')})`} /></button>
                  : <Stars value={0} label={tx('reviews_none')} />}
              </div>
            </div>
            <span className="prices">
              <span className="price price-lg">{formatPrice(prices.price, prices)}</span>
              {onSale && <span className="was">{formatPrice(prices.regular_price, prices)}</span>}
              {onSale && <span className="off">−{Math.round((1 - Number(prices.price) / Number(prices.regular_price)) * 100)}%</span>}
            </span>
            {p.short_description && <Html className="text-ink-muted" html={p.short_description} />}

            {variationAttrs.map(a => (
              <div key={a.id || a.name}>
                <span className="lbl">{a.name}{chosen[a.name] ? ` · ${chosen[a.name]}` : ''}</span>
                <div className="sz-l mt-3">
                  {a.terms.map(t => (
                    <button
                      key={t.id}
                      className={`sz ${chosen[a.name] === t.name ? 'is-sel' : ''} ${variations.length && !optionAvailable(variations, a.name, t.name, chosen) ? 'is-off' : ''}`}
                      disabled={variations.length > 0 && !optionAvailable(variations, a.name, t.name, chosen)}
                      onClick={() => { setChosen(c => ({ ...c, [a.name]: t.name })); setPickError('') }}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <span className={stock.cls}>{stock.text}</span>
            {available && (!showFrom) && (
              <p className="text-sm leading-[22px]" aria-live="polite">
                {qty > 1 && <span className="text-ink-muted">{formatPrice(unit, prices)} × {qty} = </span>}
                <b>{tx('prod_total', { price: formatPrice(unit * qty, prices) })}</b>
              </p>
            )}

            <div className="flex items-center gap-3">
              <div className="qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label={tx('qty_dec')}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} aria-label={tx('qty_inc')}>+</button>
              </div>
              <button className={`btn btn-primary btn-lg flex-1 ${add.isPending ? 'is-loading' : ''}`} disabled={!available || add.isPending} onClick={addToCart}>
                {!available ? tx('btn_soldout') : add.isPending ? tx('btn_adding') : added ? tx('btn_added') : !showFrom ? tx('btn_add_price', { price: formatPrice(unit * qty, prices) }) : tx('btn_add')}
              </button>
              <button
                className="icon-btn border border-border-strong"
                aria-label={wishlist.has(p.id) ? tx('wishlist_remove') : tx('wishlist_add')}
                aria-pressed={wishlist.has(p.id)}
                onClick={() => wishlist.toggle(p.id)}
              >
                <svg className={`ic ${wishlist.has(p.id) ? 'fill-error text-error' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill={wishlist.has(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-9-9.2C1.7 7.2 3.8 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.200 0 5.3 3.2 4 6.800C19 15.600 12 20 12 20z" /></svg>
              </button>
            </div>
            {(pickError || add.isError) && <p className="msg err" role="alert">{pickError || errorMessage(add.error)}</p>}
            {added && (
              <p className="msg ok" role="status">{tx('added_msg')} <Link to="/cart">{tx('view_cart')}</Link></p>
            )}
            <Link className="btn btn-secondary btn-lg btn-block" to="/cart">{tx('go_cart')}</Link>
            {(o.product_note1 || o.product_note2) && (
              <div className="card flex flex-col gap-3">
                {o.product_note1 && <span className="text-sm leading-[22px]">{o.product_note1}</span>}
                {o.product_note2 && <span className="text-sm leading-[22px]">{o.product_note2}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="reviews" className="bg-surface-warm py-12 md:py-16">
        <div className={WRAP}>
          <div className="tabs" role="tablist">
            {[['description', tx('tab_description')], ['specs', tx('tab_specs')], ...(o.product_shipping_text ? [['shipping', tx('tab_shipping')]] : []), ['reviews', tx('tab_reviews', { count: reviewCount })]].map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'on' : ''}`} onClick={() => setTab(k)}>{label}</button>
            ))}
          </div>
          <div className="mt-8">
            {tab === 'description' && (p.description
              ? <Html className="max-w-[760px] text-[17px] leading-[28px] text-ink-muted" html={p.description} />
              : null)}
            {tab === 'specs' && (
              <table className="tbl max-w-[760px]">
                <tbody>
                  {p.sku && <tr><td className="text-ink-muted">{tx('spec_sku')}</td><td>{p.sku}</td></tr>}
                  {specAttrs.map(a => <tr key={a.name}><td className="text-ink-muted">{a.name}</td><td>{a.terms.map(t => t.name).join(', ')}</td></tr>)}
                  {p.weight && <tr><td className="text-ink-muted">{tx('spec_weight')}</td><td>{p.weight}</td></tr>}
                  {p.dimensions?.length ? <tr><td className="text-ink-muted">{tx('spec_size')}</td><td>{p.dimensions.length} × {p.dimensions.width} × {p.dimensions.height}</td></tr> : null}
                </tbody>
              </table>
            )}
            {tab === 'shipping' && o.product_shipping_text && (
              <div className="max-w-[760px] text-ink-muted">
                {o.product_shipping_text.split(/\r?\n/).filter(Boolean).map((para, i) => <p key={i} className={i ? 'mt-3' : ''}>{para}</p>)}
              </div>
            )}
            {tab === 'reviews' && (
              <div className="flex max-w-[760px] flex-col gap-6">
                {reviews?.length ? reviews.map(r => (
                  <div key={r.id} className="border-b border-border pb-6">
                    <Stars value={r.rating} />
                    <Html className="mt-2 text-ink-muted" html={r.review} />
                    <p className="mt-2 text-xs leading-[18px] text-ink-muted">{r.reviewer}{r.verified ? ' · ' + tx('verified_buyer') : ''}</p>
                  </div>
                )) : <p className="text-ink-muted">{tx('reviews_none')}</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      {(relLoading || relatedItems.length > 0) && (
        <section className="py-12 md:py-16 lg:py-24">
          <div className={WRAP}>
            <div className="mb-10">
              <span className={OVERLINE}>{tx('related_overline')}</span>
              <h2 className="h2 mt-2">{tx('related_title')}</h2>
            </div>
            <ProductGrid products={relatedItems} loading={relLoading} />
          </div>
        </section>
      )}

      {recentData?.items?.length > 0 && (
        <section className="bg-surface-warm py-12 md:py-16 lg:py-24">
          <div className={WRAP}>
            <div className="mb-10">
              <span className={OVERLINE}>{tx('recent_overline')}</span>
              <h2 className="h2 mt-2">{tx('recent_title')}</h2>
            </div>
            <ProductGrid products={recentData.items} />
          </div>
        </section>
      )}
    </Layout>
  )
}
