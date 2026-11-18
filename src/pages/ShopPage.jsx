import Layout from '../components/layout/Layout.jsx'
import { Link } from 'react-router'
import { useSite } from '../api/hooks.js'
import ProductListing from '../components/ui/ProductListing.jsx'
import { useText } from '../lib/text.js'

export default function ShopPage() {
  const tx = useText()
  const { data } = useSite()
  const o = data?.options || {}
  return (
    <Layout>
      <div className="pg-hero">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          <nav className="crumbs" aria-label={tx('bc_label')}>
            <Link to="/">{tx('bc_home')}</Link>
            <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg>
            <span aria-current="page">{tx('bc_shop')}</span>
          </nav>
          {o.shop_title && <h1 className="h1 mt-4">{o.shop_title}</h1>}
          {o.shop_text && <p className="text-ink-muted mt-3 max-w-[560px]">{o.shop_text}</p>}
        </div>
      </div>
      <ProductListing />
    </Layout>
  )
}
