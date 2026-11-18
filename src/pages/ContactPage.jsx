import Layout from '../components/layout/Layout.jsx'
import { Fragment } from 'react'
import { useSite } from '../api/hooks.js'
import ContactForm from '../components/ui/ContactForm.jsx'
import { lines } from '../lib/format.js'
import { useText } from '../lib/text.js'

const multiline = text => lines(text).map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)

export default function ContactPage() {
  const tx = useText()
  const { data: site } = useSite()
  const o = site?.options || {}
  return (
    <Layout>
      {(o.contact_overline || o.contact_title || o.contact_text) && (
        <section className="pg-hero">
          <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
            {o.contact_overline && <span className="font-body text-xs font-semibold leading-4 tracking-[.14em] uppercase text-accent-strong">{o.contact_overline}</span>}
            {o.contact_title && <h1 className="h1 mt-2">{o.contact_title}</h1>}
            {o.contact_text && <p className="text-ink-muted mt-3 max-w-[520px]">{o.contact_text}</p>}
          </div>
        </section>
      )}
      <section className="pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24">
        <div className="mx-auto w-full max-w-[1320px] px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-16">
            <ContactForm />
            <div className="flex flex-col gap-6">
              {o.contact_address && (
                <div className="flex gap-4 items-start">
                  <svg className="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  <div>
                    <b>{tx('contact_address_label')}</b>
                    <p className="text-ink-muted text-sm leading-[22px]">{multiline(o.contact_address)}</p>
                  </div>
                </div>
              )}
              {o.contact_email && (
                <div className="flex gap-4 items-start">
                  <svg className="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                  <div>
                    <b>{tx('contact_email_label')}</b>
                    <p className="text-ink-muted text-sm leading-[22px]">{o.contact_email}</p>
                  </div>
                </div>
              )}
              {o.contact_phone && (
                <div className="flex gap-4 items-start">
                  <svg className="ic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
                  <div>
                    <b>{tx('contact_phone_label')}</b>
                    <p className="text-ink-muted text-sm leading-[22px]">{multiline(o.contact_phone)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
