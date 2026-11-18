import { Link } from 'react-router'
import { useSite } from '../api/hooks.js'

/** Logo comes from Aurelo Content > Brand in WordPress. Nothing shows if both the text and the image are empty. */
export default function Logo({ size = 28, inverse = false, to = '/' }) {
  const { data } = useSite()
  const o = data?.options || {}
  if (!o.logo_image && !o.logo_text) return null
  const mark = o.logo_image
    ? <img src={o.logo_image} alt={o.logo_text || ''} style={{ height: size, width: 'auto' }} />
    : (
      <>
        <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
          <path d="M3 26V13a11 11 0 0 1 22 0v13z" fill={inverse ? 'var(--ink-inverse)' : 'var(--brand)'} />
          <path d="M14 26V15c0-3 2-5 5-5-.2 4-1.6 6-5 6z" fill="var(--accent)" />
        </svg>
        <span className="logo-t">{o.logo_text}</span>
      </>
    )
  if (!to) return <span className="logo">{mark}</span>
  return (
    <Link to={to} className="logo no-underline" aria-label={o.logo_text || o.ui_home_label}>
      {mark}
    </Link>
  )
}
