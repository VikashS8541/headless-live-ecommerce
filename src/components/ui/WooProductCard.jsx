import ProductCard from '../ProductCard.jsx'
import { cardProps } from '../../lib/products.js'
import { useText } from '../../lib/text.js'

export default function WooProductCard({ product }) {
  useText()
  return <ProductCard {...cardProps(product)} />
}
