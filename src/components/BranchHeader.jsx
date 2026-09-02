import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { BRAND_EMBLEM } from './Header.jsx'

export default function BranchHeader({ tabs, onBook }) {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(tabs[0]?.id || null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track which section is in view to highlight the active nav link
  useEffect(() => {
    const ids = tabs.map((tb) => tb.id)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [tabs])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  const scrollTo = (id) => {
    close()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`site-header site-header--branch ${scrolled ? 'is-scrolled' : ''}`}>
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
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              className={`br-nav-tab ${active === tb.id ? 'is-active' : ''}`}
              onClick={() => scrollTo(tb.id)}
            >
              {t(tb.label)}
            </button>
          ))}
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
