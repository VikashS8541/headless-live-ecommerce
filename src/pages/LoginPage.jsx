import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import Field from '../components/ui/Field.jsx'
import { useAuth } from '../api/hooks.js'
import { errorMessage } from '../api/errors.js'
import { useText } from '../lib/text.js'

export default function LoginPage() {
  const tx = useText()
  const { login } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state
  const from = state?.from || '/account'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = e => {
    e.preventDefault()
    if (!email.trim() || !password) { setError(tx('login_err')); return }
    setError('')
    login.mutate({ email: email.trim(), password }, { onSuccess: () => navigate(from, { replace: true }), onError: err => setError(errorMessage(err)) })
  }

  return (
    <AuthLayout>
      <form onSubmit={submit} noValidate className="card flex flex-col gap-4 p-8">
        <div><Logo /></div>
        <div>
          <h2 className="h3">{tx('login_title')}</h2>
          <p className="mt-2 text-sm leading-[22px] text-ink-muted">{tx('login_text')}</p>
        </div>
        {error && <div className="alert err" role="alert"><div>{error}</div></div>}
        <Field label={tx('f_email')}><input className="input" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
        <Field label={tx('f_password')}><input className="input" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
        <div className="flex items-center justify-end">
          <Link className="text-sm leading-[22px]" to="/forgot-password">{tx('login_forgot')}</Link>
        </div>
        <button className={`btn btn-primary btn-block ${login.isPending ? 'is-loading' : ''}`} disabled={login.isPending}>{login.isPending ? tx('login_busy') : tx('login_btn')}</button>
        <p className="text-center text-sm leading-[22px] text-ink-muted">{tx('login_new')} <Link to="/register" state={state}>{tx('login_create')}</Link></p>
      </form>
    </AuthLayout>
  )
}
