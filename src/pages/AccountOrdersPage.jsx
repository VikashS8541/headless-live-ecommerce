import { useState } from 'react'
import AccountLayout from '../components/layout/AccountLayout.jsx'
import OrdersTable from '../components/ui/OrdersTable.jsx'
import { day, money, statusLabel } from '../lib/orders.js'
import EmptyState from '../components/ui/EmptyState.jsx'
import { useAuth, useOrders } from '../api/hooks.js'
import { useText } from '../lib/text.js'

// The steps a customer sees while an order moves along

const stepIndex = s => (s === 'completed' ? 2 : s === 'processing' ? 1 : 0)

export default function AccountOrdersPage() {
  const tx = useText()
  const { user } = useAuth()
  const { data: orders = [], isLoading } = useOrders(!!user)
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)

  const list = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const selected = orders.find(o => o.id === openId)

  return (
    <AccountLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h2">{tx('orders_title')}</h1>
          <p className="text-ink-muted">{orders.length === 1 ? tx('orders_count_one', { count: orders.length }) : tx('orders_count_many', { count: orders.length })}</p>
        </div>
        <select className="select h-11 w-full sm:w-[200px]" value={filter} onChange={e => setFilter(e.target.value)} aria-label={tx('orders_filter')}>
          <option value="all">{tx('orders_all')}</option>
          {[...new Set(orders.map(o => o.status))].map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      <div className="card mt-6 p-2">
        {isLoading ? <div className="sk m-4 h-24" /> : list.length ? (
          <OrdersTable orders={list} selectedId={openId} onSelect={o => setOpenId(openId === o.id ? null : o.id)} />
        ) : (
          <EmptyState icon="bag" kind="orders_empty" actionTo="/shop" />
        )}
      </div>

      {selected && (
        <div className="mt-8">
          <h2 className="h3">{tx('order_heading', { number: selected.number })}</h2>
          <div className="card mt-4 flex flex-col gap-5">
            <p className="text-sm leading-[22px]">
              {tx('order_placed_on', { date: day(selected.date) })} · {selected.payment || tx('payment_due')} · {money(selected.total, selected.currency)}
              {selected.shipping && <><br />{tx('delivering_to', { address: selected.shipping })}</>}
            </p>
            <ol className="grid grid-cols-3 gap-2 text-center text-sm leading-[22px]">
              {[tx('order_step1'), tx('order_step2'), tx('order_step3')].map((s, i) => (
                <li key={s} className={`border-t-2 pt-2 ${i <= stepIndex(selected.status) ? 'border-accent-strong font-semibold text-ink' : 'border-border text-ink-muted'}`}>{s}</li>
              ))}
            </ol>
            <div>
              {selected.items.map((it, i) => (
                <div key={i} className="ci grid-cols-[72px_1fr_auto] !py-4">
                  {it.image ? <img src={it.image} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover" /> : <div className="aspect-[4/5] w-full rounded-sm bg-surface-beige" />}
                  <div className="nm text-sm leading-[22px]">{it.name}</div>
                  <span className="text-sm leading-[22px] text-ink-muted">×{it.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  )
}
