import { day, money, orderTitle, statusLabel } from '../../lib/orders.js'
import { useText } from '../../lib/text.js'

/** A table of the customer's orders. onSelect(order) is called by the "View details" button. */
export default function OrdersTable({ orders, onSelect, selectedId }) {
  const tx = useText()
  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr><th>{tx('th_order')}</th><th>{tx('th_date')}</th><th>{tx('th_products')}</th><th>{tx('th_total')}</th><th>{tx('th_payment')}</th><th>{tx('th_status')}</th>{onSelect && <th />}</tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td><b>#{o.number}</b></td>
              <td>{day(o.date)}</td>
              <td>{orderTitle(o)}</td>
              <td>{money(o.total, o.currency)}</td>
              <td><span className={`pill ${o.paid ? 'ok' : 'warn'}`}><i />{o.paid ? tx('paid') : o.payment || tx('due')}</span></td>
              <td><span className={`pill ${o.status === 'completed' ? 'ok' : o.status === 'cancelled' || o.status === 'failed' ? 'err' : ''}`}><i />{statusLabel(o.status)}</span></td>
              {onSelect && (
                <td><button className="btn btn-secondary btn-sm" aria-expanded={selectedId === o.id} onClick={() => onSelect(o)}>{selectedId === o.id ? tx('hide') : tx('view_details')}</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

