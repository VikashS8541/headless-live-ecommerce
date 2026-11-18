import { readCache } from '../api/persist.js'

// Interface text (buttons, form labels, messages) is edited in WordPress: Aurelo Content > "Interface text" groups.
// Each piece of text has a key (without the "ui_" prefix); {name} style markers are replaced with the values passed in.
const store = { options: readCache('site')?.options || {} }

/** Called when fresh site content arrives from WordPress. */
export function setTextOptions(options) {
  if (options) store.options = options
}

export function tx(key, vars) {
  let s = store.options['ui_' + key] ?? ''
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split('{' + k + '}').join(String(v ?? ''))
  return s
}
