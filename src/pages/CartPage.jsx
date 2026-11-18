import { useState } from 'react'
import { Link } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import { useCart, useCartActions, useProducts, useSite } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { formatPrice, stripHtml } from '../lib/format.js'
import { useText } from '../lib/text.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'
const SECTION = 'pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24'
// Tailwind needs full class names written out, so the bar width is picked from this list
const BAR = { 0: 'w-0', 10: 'w-[10%]', 20: 'w-[20%]', 30: 'w-[30%]', 40: 'w-[40%]', 50: 'w-[50%]', 60: 'w-[60%]', 70: 'w-[70%]', 80: 'w-[80%]', 90: 'w-[90%]', 100: 'w-full' }

export default function CartPage() {
  const tx = useText()
  const { data: cart, isLoading, isError } = useCart()
  const { data: site } = useSite()
  const FREE_SHIPPING_ABOVE = Number(site?.options?.free_shipping_threshold) || 0 // set in WordPress: Aurelo Content > Cart
  const { update, remove, applyCoupon, removeCoupon } = useCartActions()
  const [code, setCode] = useState('')
  const { data: more, isLoading: moreLoading } = useProducts({ per_page: 4, orderby: 'popularity', order: 'desc' })

  if (isLoading) return <Layout><section className={`${SECTION} ${WRAP}`}><div className="sk h-64" /></section></Layout>
  if (isError) {
    return <Layout><section className={`${SECTION} ${WRAP}`}><EmptyState icon="bag" title={tx('cart_load_error_title')} text={tx('cart_load_error_text')} /></section></Layout>
  }

  const items = cart.items || []
  if (!items.length) {
    return (
      <Layout>
        <section className={`${SECTION} ${WRAP}`}>
          <EmptyState icon="bag" kind="cart_empty" actionTo="/shop" />
        </section>
      </Layout>
    )
  }

  const t = cart.totals
  const subtotal = Number(t.total_items) / 10 ** t.currency_minor_unit
  const away = Math.max(0, FREE_SHIPPING_ABOVE - subtotal)
  const pct = FREE_SHIPPING_ABOVE > 0 ? Math.min(100, Math.round((subtotal / FREE_SHIPPING_ABOVE) * 100)) : 0
  const busy = update.isPending || remove.isPending
  const error = [update, remove, applyCoupon, removeCoupon].map(m => m.error).find(Boolean)
  const discount = Number(t.total_discount)

  return (
    <Layout>
      <section className={SECTION}>
        <div className={WRAP}>
          <h1 className="h1">{tx('cart_title')} <span className="text-[20px] text-ink-muted">({cart.items_count === 1 ? tx('cart_item_one', { count: cart.items_count }) : tx('cart_item_many', { count: cart.items_count })})</span></h1>
          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_420px] lg:gap-16">
            <div>
              {FREE_SHIPPING_ABOVE > 0 && (
                <>
                  {away > 0 ? (
                    <p className="text-sm leading-[22px]">{tx('cart_ship_away', { amount: (t.currency_symbol ?? '₹') + Math.ceil(away).toLocaleString('en-IN') })}</p>
                  ) : (
                    <p className="text-sm leading-[22px]"><b>{tx('cart_ship_free')}</b></p>
                  )}
                  <div className="ship-bar mt-2"><i className={BAR[Math.floor(pct / 10) * 10]} /></div>
                </>
              )}
              {error && <p className="msg err mt-3" role="alert">{errorMessage(error)}</p>}
              <div className={`mt-4 border-t border-border ${busy ? 'opacity-60' : ''}`}>
                {items.map(it => {
                  const img = it.images?.[0]
                  const slug = it.permalink?.split('/product/')[1]?.replace(/\/$/, '')
                  return (
                    <div key={it.key} className="ci grid-cols-1 items-center gap-6 lg:grid-cols-[120px_1fr_auto_auto]">
                      {img ? <img src={img.thumbnail || img.src} alt={img.alt || ''} loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                      <div>
                        <div className="nm text-[17px]">{slug ? <Link to={`/product/${slug}`} className="no-underline">{stripHtml(it.name)}</Link> : stripHtml(it.name)}</div>
                        {it.variation?.length > 0 && <div className="meta">{it.variation.map(v => v.value).join(' · ')}</div>}
                        <div className="mt-3 flex items-center gap-4">
                          <button className="btn btn-ghost h-8 p-0 text-sm leading-[22px]" onClick={() => remove.mutate(it.key)}>{tx('remove')}</button>
                        </div>
                      </div>
                      <div className="qty">
                        <button aria-label={tx('qty_dec')} disabled={busy || it.quantity <= 1} onClick={() => update.mutate({ key: it.key, quantity: it.quantity - 1 })}>−</button>
                        <span>{it.quantity}</span>
                        <button aria-label={tx('qty_inc')} disabled={busy || it.quantity >= it.quantity_limits.maximum} onClick={() => update.mutate({ key: it.key, quantity: it.quantity + 1 })}>+</button>
                      </div>
                      <b className="price min-w-[90px] text-right">{formatPrice(it.totals.line_subtotal, it.totals)}</b>
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link className="btn btn-ghost" to="/shop">{tx('continue_shopping')}</Link>
              </div>
            </div>

            <div className="sum">
              <h3 className="h4">{tx('order_summary')}</h3>
              <form className="mt-4 flex items-center gap-2" onSubmit={e => { e.preventDefault(); if (code.trim()) applyCoupon.mutate(code.trim(), { onSuccess: () => setCode('') }) }}>
                <input className="input h-11" placeholder={tx('ph_coupon')} value={code} onChange={e => setCode(e.target.value)} aria-label={tx('ph_coupon')} />
                <button className="btn btn-secondary btn-sm" disabled={applyCoupon.isPending}>{tx('coupon_apply')}</button>
              </form>
              {cart.coupons?.map(c => (
                <p key={c.code} className="mt-2 flex items-center justify-between text-sm leading-[22px]">
                  <span>{tx('coupon_label')} <b>{c.code}</b></span>
                  <button className="text-ink-muted underline" onClick={() => removeCoupon.mutate(c.code)}>{tx('remove')}</button>
                </p>
              ))}
              <div className="mt-4">
                <div className="sum-r"><span>{tx('sum_subtotal')}</span><span>{formatPrice(t.total_items, t)}</span></div>
                <div className="sum-r"><span>{tx('sum_shipping')}</span><span>{cart.needs_shipping ? tx('ship_calc') : tx('ship_none')}</span></div>
                <div className="sum-r"><span>{tx('sum_discount')}</span><span className="disc">−{formatPrice(discount, t)}</span></div>
                <div className="sum-r tot"><span>{tx('sum_total')}</span><span>{formatPrice(Number(t.total_price) - Number(t.total_shipping || 0), t)}</span></div>
              </div>
              <Link className="btn btn-primary btn-lg btn-block mt-6" to="/checkout">{tx('btn_checkout')}</Link>
              <p className="mt-3 text-center text-xs leading-[18px] text-ink-muted">{tx('cart_tax_note')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION} bg-surface-warm`}>
        <div className={WRAP}>
          <div className="mb-10">
            <span className="font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong">{tx('cart_more_overline')}</span>
            <h2 className="h2 mt-2">{tx('cart_more_title')}</h2>
          </div>
          <ProductGrid products={more?.items} loading={moreLoading} />
        </div>
      </section>
    </Layout>
  )
}
