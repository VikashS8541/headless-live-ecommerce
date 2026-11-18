import { useText } from '../../lib/text.js'
export default function Pagination({ page, totalPages, onChange }) {
  const tx = useText()
  if (!totalPages || totalPages < 2) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const go = n => { if (n >= 1 && n <= totalPages && n !== page) onChange(n) }
  return (
    <nav className="pag mt-12" aria-label={tx('pag_label')}>
      <button className={`pg-i ${page === 1 ? 'dis' : ''}`} onClick={() => go(page - 1)} aria-label={tx('pag_prev')}>‹</button>
      {pages.map(n => (
        <button key={n} className={`pg-i ${n === page ? 'on' : ''}`} onClick={() => go(n)} aria-current={n === page ? 'page' : undefined}>{n}</button>
      ))}
      <button className={`pg-i ${page === totalPages ? 'dis' : ''}`} onClick={() => go(page + 1)} aria-label={tx('pag_next')}>›</button>
    </nav>
  )
}
