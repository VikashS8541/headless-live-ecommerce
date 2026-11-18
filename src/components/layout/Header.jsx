import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import Logo from '../Logo.jsx'
import Icon from '../Icon.jsx'
import { useCart, useSite } from '../../api/hooks.js'
import { useWishlist } from '../../lib/wishlist.js'
import { menuItems } from '../../lib/menus.js'
import { useText } from '../../lib/text.js'

export default function Header() {
  const tx = useText()
  const [open, setOpen] = useState(false)
  const { data } = useSite()
  const { data: cart } = useCart()
  const wishlist = useWishlist()
  const NAV = menuItems(data?.menus?.primary).map(i => ({ label: i.title, to: i.to }))
  return (
    <header className="relative z-40 border-b border-border bg-surface">
      <div className="grid h-[76px] grid-cols-[1fr_auto] items-center px-4 md:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="flex items-center gap-1">
          <button
            className="icon-btn lg:hidden"
            aria-label={open ? tx('menu_close') : tx('menu_open')}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <svg className="ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <Logo />
        </div>
        <nav className="hidden gap-8 lg:flex" aria-label={tx('nav_primary')}>
          {NAV.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) => `border-b border-transparent py-2 font-heading text-sm font-medium leading-5 no-underline hover:border-ink ${item.to === '/category/sale' ? 'text-error' : ''} ${isActive && item.to !== '/shop' ? '!border-ink' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center justify-end">
          <Link className="icon-btn" to="/search" aria-label={tx('nav_search')}><Icon name="search" /></Link>
          <Link className="icon-btn hidden sm:grid" to="/account" aria-label={tx('nav_account')}><Icon name="user" /></Link>
          <Link className="icon-btn" to="/wishlist" aria-label={tx('nav_wishlist')}><Icon name="heart" />{wishlist.ids.length > 0 && <span className="count">{wishlist.ids.length}</span>}</Link>
          <Link className="icon-btn" to="/cart" aria-label={tx('nav_cart')}><Icon name="bag" />{cart?.items_count > 0 && <span className="count">{cart.items_count}</span>}</Link>
        </div>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col border-b border-border bg-surface px-4 py-2 shadow-md md:px-6 lg:hidden" aria-label={tx('nav_mobile')}>
          {[...NAV, { label: tx('nav_account'), to: '/account' }].map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              onClick={() => setOpen(false)}
              className={`flex h-12 items-center border-b border-border font-heading text-sm font-medium no-underline last:border-b-0 ${item.to === '/category/sale' ? 'text-error' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
