import Logo from '../Logo.jsx'
import { useText } from '../../lib/text.js'

export default function CheckoutLayout({ children }) {
  const tx = useText()
  return (
    <>
      <div className="flex h-[76px] items-center border-b border-border">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 md:px-6 lg:px-8">
          <Logo />
          <span className="flex items-center gap-2 text-sm leading-[22px] text-ink-muted">
            <svg className="ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg> {tx('secure_checkout')}
          </span>
        </div>
      </div>
      {children}
    </>
  )
}
