import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { subscribe } from '../../api/account.js'
import { errorMessage } from '../../api/errors.js'
import { useText } from '../../lib/text.js'

/** Email sign-up. Saved in WordPress under Subscribers. buttonClass picks the button style. */
export default function NewsletterForm({ buttonClass = 'btn btn-primary', buttonLabel, inputClass = 'input', className = '' }) {
  const tx = useText()
  const [email, setEmail] = useState('')
  const sub = useMutation({ mutationFn: subscribe, onSuccess: () => setEmail('') })

  if (sub.isSuccess) return <p className={`text-sm leading-[22px] ${className}`} role="status">{tx('news_thanks')}</p>
  return (
    <form
      className={className}
      onSubmit={e => { e.preventDefault(); if (email.trim()) sub.mutate(email.trim()) }}
    >
      <div className="flex items-center gap-2">
        <input className={`${inputClass} h-11`} type="email" required placeholder={tx('news_placeholder')} aria-label={tx('news_placeholder')} value={email} onChange={e => setEmail(e.target.value)} />
        <button className={`${buttonClass} btn-sm`} disabled={sub.isPending}>{sub.isPending ? '…' : (buttonLabel || tx('news_button'))}</button>
      </div>
      {sub.isError && <p className="msg err mt-2" role="alert">{errorMessage(sub.error)}</p>}
    </form>
  )
}
