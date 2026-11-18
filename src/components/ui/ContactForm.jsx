import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Field from './Field.jsx'
import { sendContact } from '../../api/account.js'
import { errorMessage } from '../../api/errors.js'
import { useText } from '../../lib/text.js'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', website: '' }

/** Contact form. Messages are saved in WordPress under Messages and e-mailed to the site admin. */
export default function ContactForm() {
  const tx = useText()
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const send = useMutation({ mutationFn: sendContact, onSuccess: () => setF(EMPTY) })
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    const v = {}
    if (!f.name.trim()) v.name = tx('err_name')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = tx('err_email')
    if (!f.message.trim()) v.message = tx('err_message')
    setErrors(v)
    if (!Object.keys(v).length) send.mutate(f)
  }

  return (
    <form onSubmit={submit} noValidate className="card flex flex-col gap-6 p-6 md:p-10">
      {send.isSuccess && <div className="alert ok" role="status"><div><b>{tx('contact_sent_title')}</b><br />{tx('contact_sent_text')}</div></div>}
      {send.isError && <div className="alert err" role="alert"><div>{errorMessage(send.error)}</div></div>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label={tx('f_name')} error={errors.name}><input className={`input ${errors.name ? 'is-error' : ''}`} autoComplete="name" value={f.name} onChange={set('name')} /></Field>
        <Field label={tx('f_email')} error={errors.email}><input className={`input ${errors.email ? 'is-error' : ''}`} type="email" autoComplete="email" placeholder={tx('ph_email')} value={f.email} onChange={set('email')} /></Field>
        <Field label={tx('f_phone')}><input className="input" inputMode="tel" autoComplete="tel" placeholder={tx('ph_phone')} value={f.phone} onChange={set('phone')} /></Field>
        <Field label={tx('f_subject')}><input className="input" placeholder={tx('ph_subject')} value={f.subject} onChange={set('subject')} /></Field>
      </div>
      <Field label={tx('f_message')} error={errors.message}>
        <textarea className={`textarea ${errors.message ? 'is-error' : ''}`} rows="5" placeholder={tx('ph_message')} value={f.message} onChange={set('message')} />
      </Field>
      {/* Hidden from people; bots tend to fill it in and WordPress then ignores the message */}
      <input className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set('website')} />
      <button className={`btn btn-primary btn-lg self-start ${send.isPending ? 'is-loading' : ''}`} disabled={send.isPending}>
        {send.isPending ? tx('contact_sending') : tx('contact_send')}
      </button>
    </form>
  )
}
