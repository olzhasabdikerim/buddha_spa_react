import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { handleHashNav } from '../lib/hashNav.js'

// Brand emblem downloaded from the Tilda CDN into public/images.
export const BRAND_EMBLEM = '/images/brand-emblem.png'

export default function Header() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap site-header__row">
        <Link to="/" className="brand" onClick={close}>
          <img className="brand__logo" src={BRAND_EMBLEM} alt="BuddhaSpa" />
          <span className="brand__name">Buddha<span className="brand__name-accent">Spa</span></span>
        </Link>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          <Link to="/#branches" onClick={(e) => { close(); handleHashNav(e, '/#branches') }}>{t('Филиалы')}</Link>
          <Link to="/about" onClick={close}>{t('О нас')}</Link>
          <Link to="/#faq" onClick={(e) => { close(); handleHashNav(e, '/#faq') }}>FAQ</Link>
          <Link to="/franchise" onClick={close}>{t('Франшиза')}</Link>
          <Link to="/#contacts" onClick={(e) => { close(); handleHashNav(e, '/#contacts') }}>{t('Контакты')}</Link>
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />
          <Link to="/#branches" className="btn btn-coral site-header__cta" onClick={(e) => { close(); handleHashNav(e, '/#branches') }}>
            {t('Записаться')}
          </Link>
          <button
            type="button"
            className="burger"
            aria-label="Открыть меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
