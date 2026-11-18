import { Link } from 'react-router'
import Logo from '../Logo.jsx'
import { useText } from '../../lib/text.js'

export default function AuthLayout({ children }) {
  const tx = useText()
  return (
    <>
      <div className="flex h-[76px] items-center border-b border-border">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between px-4 md:px-6 lg:px-8">
          <Logo />
          <Link className="text-sm leading-[22px]" to="/">{tx('back_to_store')}</Link>
        </div>
      </div>
      <section className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-10 md:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="mx-auto max-w-[440px]">{children}</div>
      </section>
    </>
  )
}
