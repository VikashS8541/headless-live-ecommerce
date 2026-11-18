import { useState } from 'react'
import Layout from '../components/layout/Layout.jsx'
import Accordion from '../components/Accordion.jsx'
import { useFaqs, useSite } from '../api/hooks.js'
import { stripHtml } from '../lib/format.js'
import { useText } from '../lib/text.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'

export default function FAQPage() {
  const tx = useText()
  const { data, isLoading } = useFaqs()
  const { data: site } = useSite()
  const o = site?.options || {}
  const [cat, setCat] = useState(0) // 0 = all questions
  const categories = data?.categories?.filter(c => data.faqs.some(f => f.faq_category?.includes(c.id))) || []
  const list = (data?.faqs || []).filter(f => !cat || f.faq_category?.includes(cat))
  const items = list.map((f, i) => ({ open: i === 0, q: stripHtml(f.title.rendered), a: stripHtml(f.content.rendered) }))
  const activeName = cat ? stripHtml(categories.find(c => c.id === cat)?.name || '') : ''

  return (
    <Layout>
      <section className="pg-hero">
        <div className={WRAP}>
          {o.faq_title && <h1 className="h1">{o.faq_title}</h1>}
          {o.faq_text && <p className="mt-3 text-ink-muted">{o.faq_text}</p>}
        </div>
      </section>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-24 lg:pt-24">
        <div className={WRAP}>
          {!isLoading && items.length === 0 && !cat ? null : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
              <nav className="snav flex gap-1 overflow-x-auto lg:block" aria-label={tx('faq_categories')}>
                <button className={`flex h-12 shrink-0 items-center whitespace-nowrap rounded-sm px-4 text-left font-heading text-sm font-medium ${cat === 0 ? 'bg-brand text-on-brand' : 'hover:bg-surface-warm'}`} onClick={() => setCat(0)}>{tx('faq_all')}</button>
                {categories.map(c => (
                  <button key={c.id} className={`flex h-12 shrink-0 items-center whitespace-nowrap rounded-sm px-4 text-left font-heading text-sm font-medium ${cat === c.id ? 'bg-brand text-on-brand' : 'hover:bg-surface-warm'}`} onClick={() => setCat(c.id)}>{stripHtml(c.name)}</button>
                ))}
              </nav>
              <div>
                {activeName && <h2 className="h3 mb-4">{activeName}</h2>}
                {isLoading ? <div className="sk h-16" /> : <Accordion key={cat} items={items} />}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
