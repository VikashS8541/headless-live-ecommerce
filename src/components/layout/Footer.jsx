import { Link } from 'react-router'
import Logo from '../Logo.jsx'
import Icon from '../Icon.jsx'
import SmartLink from '../ui/SmartLink.jsx'
import NewsletterForm from '../ui/NewsletterForm.jsx'
import { useSite } from '../../api/hooks.js'
import { menuItems } from '../../lib/menus.js'


const Col = ({ title, links }) => (links.length === 0 ? null : (
  <div>
    {title && <h4 className="ft-h">{title}</h4>}
    <ul>{links.map(l => <li key={l.title + l.to}><SmartLink to={l.to}>{l.title}</SmartLink></li>)}</ul>
  </div>
))

export default function Footer() {
  const { data } = useSite()
  const o = data?.options || {}
  const m = data?.menus || {}
  const legal = menuItems(m.footer_legal)
  const hasNews = o.footer_news_title || o.footer_news_text
  return (
    <footer className="ft">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-8 px-4 md:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.6fr] lg:gap-12 lg:px-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo size={30} inverse />
          {o.footer_about && <p>{o.footer_about}</p>}
          {o.instagram_handle && <div className="flex items-center gap-2"><Icon name="insta" /><span className="text-sm leading-[22px]">{o.instagram_handle}</span></div>}
        </div>
        <Col title={o.footer_shop_title} links={menuItems(m.footer_shop)} />
        <Col title={o.footer_help_title} links={menuItems(m.footer_help)} />
        <Col title={o.footer_company_title} links={menuItems(m.footer_company)} />
        {hasNews && (
          <div className="col-span-2 lg:col-span-1">
            {o.footer_news_title && <h4 className="ft-h">{o.footer_news_title}</h4>}
            {o.footer_news_text && <p className="text-sm leading-[22px]">{o.footer_news_text}</p>}
            <NewsletterForm className="mt-3" buttonClass="btn btn-light" buttonLabel={o.ui_news_button_footer} />
          </div>
        )}
      </div>
      {(o.copyright || legal.length > 0 || o.payment_text) && (
        <div className="mx-auto mt-16 flex w-full max-w-[1320px] flex-col gap-2 border-t border-[#3b403c] px-4 py-6 text-[13px] opacity-85 md:px-6 lg:flex-row lg:justify-between lg:px-8">
          <span>{o.copyright}</span>
          <span>
            {legal.map((l, i) => <span key={l.to + l.title}>{i > 0 && ' · '}<Link to={l.to}>{l.title}</Link></span>)}
          </span>
          <span>{o.payment_text}</span>
        </div>
      )}
    </footer>
  )
}
