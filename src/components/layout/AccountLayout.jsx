import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import Layout from './Layout.jsx'
import { useAuth } from '../../api/hooks.js'
import { useText } from '../../lib/text.js'

const ITEMS = [
  { label: 'acc_dashboard', to: '/account', icon: <><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></> },
  { label: 'acc_profile', to: '/account/profile', icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></> },
  { label: 'acc_orders', to: '/account/orders', icon: <><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></> },
  { label: 'acc_addresses', to: '/account/profile#addresses', icon: <><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
  { label: 'acc_wishlist', to: '/wishlist', icon: <path d="M12 20s-7-4.4-9-9.2C1.7 7.2 3.8 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.2 0 5.3 3.2 4 6.8C19 15.6 12 20 12 20z" /> },
  { label: 'acc_settings', to: '/account/profile#password', icon: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></> },
]

const Ico = ({ children }) => (
  <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

/** Account screens: sends visitors who are not logged in to the login page. */
export default function AccountLayout({ children }) {
  const tx = useText()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const { loggedIn, loading, logout } = useAuth()

  if (!loading && !loggedIn) return <Navigate to="/login" state={{ from: pathname }} replace />

  const isOn = to => {
    const [p, h = ''] = to.split('#')
    return pathname === p && (h ? hash === '#' + h : !hash || (hash !== '#addresses' && hash !== '#password'))
  }

  return (
    <Layout>
      <section className="pb-12 pt-12 md:pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-12">
            <aside className="snav flex gap-1 overflow-x-auto lg:block">
              {ITEMS.map(i => (
                <Link key={i.label} to={i.to} className={`shrink-0 whitespace-nowrap ${isOn(i.to) ? 'on' : ''}`}><Ico>{i.icon}</Ico>{tx(i.label)}</Link>
              ))}
              <hr className="hidden lg:block" />
              <button
                className="flex h-12 shrink-0 items-center gap-3 whitespace-nowrap rounded-sm px-4 font-heading text-sm font-medium hover:bg-surface-warm"
                onClick={() => { logout(); navigate('/login') }}
              >
                <Ico><path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9" /></Ico>{tx('acc_logout')}
              </button>
            </aside>
            <div className="min-w-0">{loading ? <div className="sk h-48" /> : children}</div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
