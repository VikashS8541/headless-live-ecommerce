import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Html from '../components/ui/Html.jsx'
import { usePage } from '../api/hooks.js'
import { cleanHtml, stripHtml } from '../lib/format.js'
import { useText } from '../lib/text.js'

const WRAP = 'mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8'

/** Gives every <h2> an id and returns the "on this page" list. */
function prepare(html) {
  const doc = new DOMParser().parseFromString(cleanHtml(html), 'text/html')
  const toc = []
  doc.querySelectorAll('h2').forEach((h, i) => {
    const id = `s${i + 1}-` + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    h.id = id
    h.className = 'h3'
    toc.push({ id, text: h.textContent })
  })
  return { html: doc.body.innerHTML, toc }
}

/**
 * Policy pages come from WordPress Pages. The page "slug" is the last part of the address:
 *   /policies/returns  ->  WordPress page with slug "returns"
 */
export default function PolicyPage() {
  const tx = useText()
  const { slug } = useParams()
  const { data: page, isLoading } = usePage(slug)
  const title = page ? stripHtml(page.title.rendered) : ''
  const { html, toc } = useMemo(() => (page ? prepare(page.content.rendered) : { html: '', toc: [] }), [page])

  if (!isLoading && !page) {
    return (
      <Layout>
        <section className={`${WRAP} py-16`}>
          <EmptyState kind="notfound" actionTo="/" />
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="pg-hero">
        <div className={WRAP}>
          <nav className="crumbs" aria-label={tx('bc_label')}>
            <Link to="/">{tx('bc_home')}</Link>
            <svg className="ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span aria-current="page">{title || '…'}</span>
          </nav>
          <h1 className="h1 mt-4">{title || ' '}</h1>
          {page?.modified && (
            <p className="mt-2 text-ink-muted">Last updated {new Date(page.modified).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          )}
        </div>
      </section>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-24 lg:pt-24">
        <div className={WRAP}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
            {toc.length > 0 && (
              <nav className="snav h-fit" aria-label={tx('policy_toc')}>
                {toc.map((t, i) => <a key={t.id} className={i === 0 ? 'on' : 'x'} href={`#${t.id}`}>{t.text}</a>)}
              </nav>
            )}
            <Html className="legal" html={html} />
          </div>
        </div>
      </section>
    </Layout>
  )
}
