import Layout from '../components/layout/Layout.jsx'
import { Link, useParams } from 'react-router'
import { useCategories } from '../api/hooks.js'
import { stripHtml } from '../lib/format.js'
import ProductListing from '../components/ui/ProductListing.jsx'
import { useText } from '../lib/text.js'

export default function CategoryPage() {
  const tx = useText()
  const { slug } = useParams()
  const { data: cats } = useCategories()
  const cat = (cats || []).find(c => c.slug === slug)
  const title = slug === 'sale' ? tx('filter_sale') : cat ? stripHtml(cat.name) : slug.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())
  const description = stripHtml(cat?.description || '')
  const image = cat?.image?.src // the category picture set in WooCommerce

  return (
    <Layout>
      <section className="bg-surface-beige">
        <div className={`mx-auto grid min-h-[360px] w-full max-w-[1320px] grid-cols-1 items-center gap-8 px-4 md:px-6 lg:gap-12 lg:px-8 ${image ? 'lg:grid-cols-[1fr_1fr]' : ''}`}>
          <div className="flex flex-col items-start gap-4 py-8">
            <nav className="crumbs" aria-label={tx('bc_label')}>
              <Link to="/">{tx('bc_home')}</Link>
              <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 6 6 6-6 6" />
              </svg>
              <Link to="/shop">{tx('bc_shop')}</Link>
              <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 6 6 6-6 6" />
              </svg>
              <span aria-current="page">{title}</span>
            </nav>
            <h1 className="display text-[39px] leading-[47px] lg:text-[56px] lg:leading-[62px]">{title}</h1>
            {description && <p className="max-w-[440px] text-ink-muted">{description}</p>}
          </div>
          {image && (
            <div className="pb-8 lg:py-8">
              <img src={image} alt={title} width="1280" height="720" decoding="async" className="h-auto aspect-[16/9] max-h-[420px] w-full rounded-md object-cover" />
            </div>
          )}
        </div>
      </section>
      <ProductListing key={slug} categorySlug={slug} />
    </Layout>
  )
}
