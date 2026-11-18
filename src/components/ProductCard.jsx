import { Link } from 'react-router'
import { memo } from 'react'
import Icon from './Icon.jsx'
import Stars from './ui/Stars.jsx'
import { useWishlist } from '../lib/wishlist.js'
import { useText } from '../lib/text.js'

const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/**
 * One product tile. Works with WordPress data (pass `slug` and `image`)
 * or with plain text props (the slug is then made from the name).
 */
function ProductCard({ id, name, slug, image, imageSrcSet, category, tone = 't1', badges = [], wished = false, swatches = [], price, rating = 0, reviews = 0, was, off, className = '' }) {
  const tx = useText()
  const wishlist = useWishlist()
  const saved = id != null ? wishlist.has(id) : wished
  const to = `/product/${slug || slugify(name)}`
  return (
    <article className={`pc ${className}`.trim()}>
      <div className="media">
        <Link to={to} aria-label={name}>
          {image ? (
            <img src={image} srcSet={imageSrcSet} sizes="(min-width:1024px) 25vw, 50vw" alt={name} loading="lazy" decoding="async" className="block aspect-[4/5] w-full rounded-sm object-cover" />
          ) : (
            <div className={`ph ${tone} aspect-[4/5]`} />
          )}
        </Link>
        {badges.length > 0 && (
          <div className="badges">
            {badges.map(b => <span key={b.text} className={`badge ${b.kind}`}>{b.text}</span>)}
          </div>
        )}
        <button
          className={`wish ${saved ? 'is-on' : ''}`.trim()}
          aria-label={saved ? tx('wishlist_remove') : tx('wishlist_add')}
          aria-pressed={saved}
          onClick={() => id != null && wishlist.toggle(id)}
        >
          <Icon name="heart" size={18} />
        </button>
        <Link to={to} className="quick grid place-items-center no-underline">{tx('quick_view')}</Link>
      </div>
      <div className="pc-b">
        <span className="cat">{category}</span>
        <h3 className="pc-n"><Link to={to} className="no-underline">{name}</Link></h3>
        {reviews > 0 && <Stars value={rating} label={`(${reviews})`} />}
        {swatches.length > 0 && (
          <div className="swatches">{swatches.map(c => <i key={c} className={c} />)}</div>
        )}
        <span className="prices">
          <span className="price">{price}</span>
          {was && <span className="was">{was}</span>}
          {off && <span className="off">{off}</span>}
        </span>
      </div>
    </article>
  )
}

export default memo(ProductCard)
