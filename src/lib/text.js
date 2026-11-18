import { useSite } from '../api/hooks.js'
import { tx } from './textStore.js'

export { tx }

/** Use inside a component: re-draws it when the WordPress text arrives, and returns tx. */
export function useText() {
  useSite()
  return tx
}
