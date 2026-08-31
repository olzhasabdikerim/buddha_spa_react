import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { handleHashNav } from '../lib/hashNav.js'

// Brand emblem downloaded from the Tilda CDN into public/images.
export const BRAND_EMBLEM = '/images/brand-emblem.png'

export default function Header({ onBook }) {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // While the mobile menu is open: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap site-header__row">
        <Link to="/" className="brand" onClick={close}>
          <img className="brand__logo" src={BRAND_EMBLEM} alt="BuddhaSpa" />
          <span className="brand__name">Buddha<span className="brand__name-accent">Spa</span></span>
        </Link>

        {open && <div className="site-nav__backdrop" onClick={close} aria-hidden="true" />}
        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          <button type="button" className="site-nav__close" aria-label={t('Закрыть')} onClick={close}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <Link to="/#branches" onClick={(e) => { close(); handleHashNav(e, '/#branches') }}>{t('Филиалы')}</Link>
          <Link to="/#faq" onClick={(e) => { close(); handleHashNav(e, '/#faq') }}>FAQ</Link>
          <Link to="/franchise" onClick={close}>{t('Франшиза')}</Link>
          <Link to="/#contacts" onClick={(e) => { close(); handleHashNav(e, '/#contacts') }}>{t('Контакты')}</Link>
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />
          <button type="button" className="btn btn-coral site-header__cta" onClick={() => { close(); onBook?.() }}>
            {t('Записаться')}
          </button>
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label={open ? t('Закрыть') : 'Меню'}
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
