import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import CheckoutLayout from '../components/layout/CheckoutLayout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth, useCart, useCartActions } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { formatPrice, stripHtml } from '../lib/format.js'
import { INDIA_STATES } from '../lib/india.js'
import { useText } from '../lib/text.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'

const Step = ({ n, title }) => (
  <div className="step my-8 mb-5"><b>{n}</b><h2 className="h4">{title}</h2></div>
)

// DEMO payment methods. The ids match the demo gateways in WordPress (aurelo-demo-payments.php).
const PAYMENTS = [
  { id: 'aurelo_upi', label: 'pay_upi', hint: 'pay_upi_hint' },
  { id: 'aurelo_card', label: 'pay_card', hint: 'pay_card_hint' },
  { id: 'aurelo_netbanking', label: 'pay_netbanking', hint: 'pay_netbanking_hint' },
  { id: 'aurelo_cod', label: 'pay_cod', hint: 'pay_cod_hint' },
]

const EMPTY = { email: '', first_name: '', last_name: '', phone: '', address_1: '', city: '', state: '', postcode: '' }

function validate(f, tx) {
  const e = {}
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = tx('err_email')
  if (!f.first_name.trim()) e.first_name = tx('err_first_name')
  if (!f.last_name.trim()) e.last_name = tx('err_last_name')
  if (!/^\d{10}$/.test(f.phone.replace(/\D/g, '').slice(-10)) || f.phone.replace(/\D/g, '').length < 10) e.phone = tx('err_phone')
  if (!f.address_1.trim()) e.address_1 = tx('err_street')
  if (!f.city.trim()) e.city = tx('err_city')
  if (!f.state) e.state = tx('err_state')
  if (!/^\d{6}$/.test(f.postcode.trim())) e.postcode = tx('err_pin')
  return e
}

export default function CheckoutPage() {
  const tx = useText()
  const navigate = useNavigate()
  const { user, loggedIn, loading: authLoading } = useAuth()
  const { data: cart, isLoading } = useCart()
  const { setCustomer, selectRate, checkout } = useCartActions()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [payment, setPayment] = useState('aurelo_upi')
  const [note, setNote] = useState('')

  // Pre-fill from the customer's account once it has loaded
  const [prefilled, setPrefilled] = useState(false)
  if (user && !prefilled) {
    setPrefilled(true)
    setForm(f => ({
      ...f,
      email: user.email || '', first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '',
      address_1: user.address?.address_1 || '', city: user.address?.city || '', state: user.address?.state || '', postcode: user.address?.postcode || '',
    }))
  }

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))
  const addr = () => ({ ...form, country: 'IN' })

  // Shipping prices depend on the address, so ask WooCommerce once the address is complete
  const refreshRates = () => {
    if (Object.keys(validate(form, tx)).length === 0) setCustomer.mutate({ billing: addr(), shipping: addr() })
  }

  // Checkout needs an account: send guests to log in, then bring them back here
  if (!authLoading && !loggedIn) return <Navigate to="/login" state={{ from: '/checkout' }} replace />
  if (isLoading || authLoading) return <CheckoutLayout><section className={`${WRAP} py-12`}><div className="sk h-64" /></section></CheckoutLayout>
  if (!cart?.items?.length) {
    return (
      <CheckoutLayout>
        <section className={`${WRAP} py-16`}>
          <EmptyState icon="bag" kind="cart_empty" actionTo="/shop" />
        </section>
      </CheckoutLayout>
    )
  }

  const t = cart.totals
  const pkg = cart.shipping_rates?.[0]
  const rates = pkg?.shipping_rates || []
  const selected = rates.find(r => r.selected)
  const submitError = checkout.error ? errorMessage(checkout.error) : ''
  const hasErrors = Object.keys(errors).length > 0

  const submit = async e => {
    e.preventDefault()
    const v = validate(form, tx)
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      // Make sure WooCommerce has the address (and therefore the shipping rates) before ordering
      await setCustomer.mutateAsync({ billing: addr(), shipping: addr() })
      const res = await checkout.mutateAsync({
        billing_address: addr(),
        shipping_address: addr(),
        customer_note: note,
        payment_method: payment,
      })
      navigate(`/order-success?order=${res.order_id}&key=${encodeURIComponent(res.order_key)}&email=${encodeURIComponent(form.email)}&pay=${payment}`)
    } catch { /* the message is shown from checkout.error */ }
  }

  return (
    <CheckoutLayout>
      <form onSubmit={submit} noValidate className={`${WRAP} pb-16 pt-8 lg:pb-24 lg:pt-12`}>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            {(hasErrors || submitError) && (
              <div className="alert err" role="alert">
                <div>
                  <b>{hasErrors ? tx(Object.keys(errors).length > 1 ? 'chk_fix_n_many' : 'chk_fix_n_one', { count: Object.keys(errors).length }) : tx('chk_fail')}</b>
                  <br />{hasErrors ? tx('chk_fix_hint') : submitError}
                </div>
              </div>
            )}

            <Step n="1" title={tx('chk_step_contact')} />
            <Field label={tx('f_email_address')} error={errors.email}>
              <input className={`input ${errors.email ? 'is-error' : ''}`} type="email" autoComplete="email" value={form.email} onChange={set('email')} />
            </Field>

            <Step n="2" title={tx('chk_step_address')} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label={tx('f_first_name')} error={errors.first_name}><input className={`input ${errors.first_name ? 'is-error' : ''}`} autoComplete="given-name" value={form.first_name} onChange={set('first_name')} /></Field>
              <Field label={tx('f_last_name')} error={errors.last_name}><input className={`input ${errors.last_name ? 'is-error' : ''}`} autoComplete="family-name" value={form.last_name} onChange={set('last_name')} /></Field>
              <Field label={tx('f_mobile')} error={errors.phone} className="md:col-span-2"><input className={`input ${errors.phone ? 'is-error' : ''}`} inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} /></Field>
              <Field label={tx('f_country')} className="md:col-span-2"><select className="select" value="IN" disabled><option value="IN">{tx('country_india')}</option></select></Field>
              <Field label={tx('f_street')} error={errors.address_1} className="md:col-span-2"><input className={`input ${errors.address_1 ? 'is-error' : ''}`} autoComplete="address-line1" value={form.address_1} onChange={set('address_1')} /></Field>
              <Field label={tx('f_city')} error={errors.city}><input className={`input ${errors.city ? 'is-error' : ''}`} autoComplete="address-level2" value={form.city} onChange={set('city')} /></Field>
              <Field label={tx('f_state')} error={errors.state}>
                <select className={`select ${errors.state ? 'is-error' : ''}`} value={form.state} onChange={set('state')} onBlur={refreshRates}>
                  <option value="">{tx('select_state')}</option>
                  {INDIA_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                </select>
              </Field>
              <Field label={tx('f_pin')} error={errors.postcode}><input className={`input ${errors.postcode ? 'is-error' : ''}`} inputMode="numeric" autoComplete="postal-code" value={form.postcode} onChange={set('postcode')} onBlur={refreshRates} /></Field>
            </div>

            <Step n="3" title={tx('chk_step_method')} />
            {rates.length === 0 ? (
              <p className="text-sm leading-[22px] text-ink-muted">{tx('chk_rates_hint')}</p>
            ) : (
              <div className="flex flex-col gap-3">
                {rates.map(r => (
                  <label key={r.rate_id} className="card flex cursor-pointer items-center justify-between gap-3 !p-4">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="rate" checked={!!r.selected} onChange={() => selectRate.mutate({ packageId: pkg.package_id, rateId: r.rate_id })} />
                      <span>{stripHtml(r.name)}</span>
                    </span>
                    <b>{Number(r.price) === 0 ? tx('free') : formatPrice(r.price, r)}</b>
                  </label>
                ))}
              </div>
            )}

            <Step n="4" title={tx('chk_step_payment')} />
            <div className="alert ok mb-4" role="note"><div><b>{tx('chk_demo_title')}</b><br />{tx('chk_demo_text')}</div></div>
            <div className="flex flex-col gap-3">
              {PAYMENTS.map(p => (
                <div key={p.id} className="card !p-4">
                  <label className="flex cursor-pointer items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                      <span>{tx(p.label)}</span>
                    </span>
                    <span className="text-xs leading-[18px] text-ink-muted">{tx(p.hint)}</span>
                  </label>
                  {payment === p.id && p.id === 'aurelo_upi' && (
                    <input className="input mt-3" placeholder={tx('pay_ph_upi')} aria-label={tx('pay_lbl_upi')} />
                  )}
                  {payment === p.id && p.id === 'aurelo_card' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <input className="input col-span-2" inputMode="numeric" placeholder={tx('pay_ph_card')} aria-label={tx('pay_lbl_card')} autoComplete="off" />
                      <input className="input" placeholder={tx('pay_ph_expiry')} aria-label={tx('pay_lbl_expiry')} autoComplete="off" />
                      <input className="input" placeholder={tx('pay_ph_cvv')} aria-label={tx('pay_ph_cvv')} autoComplete="off" />
                    </div>
                  )}
                  {payment === p.id && p.id === 'aurelo_netbanking' && (
                    <select className="select mt-3" aria-label={tx('pay_lbl_bank')} defaultValue="">
                      <option value="">{tx('pay_choose_bank')}</option>
                      {tx('pay_banks').split(',').map(b => b.trim()).filter(Boolean).map(b => <option key={b}>{b}</option>)}
                    </select>
                  )}
                </div>
              ))}
              <p className="text-xs leading-[18px] text-ink-muted">{tx('pay_demo_note')}</p>
            </div>

            <Field label={tx('f_order_note')} className="mt-8">
              <textarea className="textarea" rows="3" value={note} onChange={e => setNote(e.target.value)} />
            </Field>
          </div>

          <aside className="sum lg:sticky lg:top-6">
            <h3 className="h4">{tx('order_summary')}</h3>
            <div className="mt-4">
              {cart.items.map(it => {
                const img = it.images?.[0]
                return (
                  <div key={it.key} className="ci grid-cols-[72px_1fr_auto] !py-4">
                    {img ? <img src={img.thumbnail || img.src} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                    <div>
                      <div className="nm text-sm leading-[22px]">{stripHtml(it.name)}</div>
                      <div className="meta">{[...(it.variation || []).map(v => v.value), `×${it.quantity}`].join(' · ')}</div>
                    </div>
                    <b className="text-sm leading-[22px]">{formatPrice(it.totals.line_subtotal, it.totals)}</b>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <div className="sum-r"><span>{tx('sum_subtotal')}</span><span>{formatPrice(t.total_items, t)}</span></div>
              <div className="sum-r"><span>{tx('sum_shipping')}</span><span>{selected ? (Number(selected.price) === 0 ? tx('free') : formatPrice(selected.price, selected)) : '—'}</span></div>
              {Number(t.total_discount) > 0 && <div className="sum-r"><span>{tx('sum_discount')}</span><span className="disc">−{formatPrice(t.total_discount, t)}</span></div>}
              <div className="sum-r tot"><span>{tx('sum_total')}</span><span>{formatPrice(t.total_price, t)}</span></div>
            </div>
            <button className={`btn btn-primary btn-lg btn-block mt-6 ${checkout.isPending ? 'is-loading' : ''}`} disabled={checkout.isPending}>
              {checkout.isPending ? tx('btn_placing') : tx('btn_place_order', { price: formatPrice(t.total_price, t) })}
            </button>
            <p className="mt-4 text-center text-xs leading-[18px] text-ink-muted">{tx('chk_terms')} <Link to="/policies/terms">{tx('chk_terms_link')}</Link>.</p>
          </aside>
        </div>
      </form>
    </CheckoutLayout>
  )
}
