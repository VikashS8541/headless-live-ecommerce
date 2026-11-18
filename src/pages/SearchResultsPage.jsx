import { Link, useSearchParams } from 'react-router'
import Layout from '../components/layout/Layout.jsx'
import ProductGrid from '../components/ui/ProductGrid.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Pagination from '../components/ui/Pagination.jsx'
import { useProducts } from '../api/hooks.js'
import { useText } from '../lib/text.js'



export default function SearchResultsPage() {
  const tx = useText()
  const [sp, setSp] = useSearchParams()
  const q = (sp.get('q') || '').trim()
  const page = Number(sp.get('page')) || 1
  const { data, isLoading, isError } = useProducts({ search: q, per_page: 12, page }, { enabled: !!q })

  const submit = e => {
    e.preventDefault()
    const value = new FormData(e.currentTarget).get('q').toString().trim()
    setSp(value ? { q: value } : {})
  }

  return (
    <Layout>
      <section className="pb-12 pt-12 md:pb-16 md:pt-16 lg:pb-24 lg:pt-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          <form onSubmit={submit} role="search" className="flex h-16 items-center gap-4 border-b-2 border-ink">
            <svg className="ic" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
              name="q"
              key={q}
              defaultValue={q}
              autoFocus
              placeholder={tx('search_placeholder')}
              aria-label={tx('search_placeholder')}
              className="h-full flex-1 border-0 bg-transparent text-[22px] outline-none placeholder:text-ink-muted lg:text-[28px]"
            />
            <button className="btn btn-primary">{tx('search_button')}</button>
          </form>

          {!q && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm leading-[22px] text-ink-muted">{tx('search_try')}</span>
              {tx('search_suggestions').split(',').map(s => s.trim()).filter(Boolean).map(s => <Link key={s} className="chip no-underline" to={`/search?q=${s}`}>{s}</Link>)}
            </div>
          )}

          {q && !isLoading && !isError && data?.items?.length > 0 && (
            <p className="mt-4 text-sm leading-[22px] text-ink-muted">{tx('search_results', { count: data.total, query: q })}</p>
          )}

          {q && (
            <div className="mt-12">
              {!isLoading && !isError && data?.items?.length === 0 ? (
                <EmptyState kind="search_empty" vars={{ query: q }} actionTo="/shop" />
              ) : (
                <ProductGrid products={data?.items} loading={isLoading} error={isError} skeletons={8} />
              )}
              <Pagination page={page} totalPages={data?.totalPages} onChange={n => setSp({ q, page: String(n) })} />
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
