import WooProductCard from './WooProductCard.jsx'
import EmptyState from './EmptyState.jsx'
import { useText } from '../../lib/text.js'

const GRID = 'grid grid-cols-2 gap-x-3 gap-y-8 lg:gap-x-6 lg:gap-y-12'

/** Grid of product cards with a loading skeleton and an empty state. */
export default function ProductGrid({ products, loading, error, columns = 4, skeletons = 4, emptyTitle, emptyText }) {
  const tx = useText()
  const cols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  if (loading) {
    return (
      <div className={`${GRID} ${cols}`}>
        {Array.from({ length: skeletons }, (_, i) => (
          <div key={i}>
            <div className="sk aspect-[4/5]" />
            <div className="sk mt-3 h-4 w-3/4" />
            <div className="sk mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    )
  }
  if (error) return <EmptyState title={tx('grid_error_title')} text={tx('grid_error_text')} />
  if (!products?.length) return <EmptyState title={emptyTitle ?? tx('grid_empty_title')} text={emptyText ?? tx('grid_empty_text')} />
  return (
    <div className={`${GRID} ${cols}`}>
      {products.map(p => <WooProductCard key={p.id} product={p} />)}
    </div>
  )
}
