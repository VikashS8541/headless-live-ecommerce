import { tx } from '../lib/text.js'
/** Turns any failed request into a short sentence a customer can read. */
export function errorMessage(error, fallback) {
  const msg = error?.response?.data?.message
  if (msg) return String(msg).replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#8377;/g, '₹')
  if (error?.code === 'ERR_NETWORK') return tx('error_network')
  return fallback ?? tx('error_generic')
}
