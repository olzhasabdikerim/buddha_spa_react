import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang, useT, LANGS } from '../i18n.jsx'

// Brand emblem downloaded from the Tilda CDN into public/images.
export const BRAND_EMBLEM = '/images/brand-emblem.png'

export default function Header() {
  const t = useT()
  const { lang, setLang } = useLang()
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
          <img className="brand__logo" src={BRAND_EMBLEM} alt="Buddha Spa" />
          <span className="brand__name">Buddha<span className="brand__name-accent">Spa</span></span>
        </Link>

        <nav className={`site-nav ${open ? 'is-open' : ''}`}>
          <Link to="/#branches" onClick={close}>{t('Филиалы')}</Link>
          <Link to="/#about" onClick={close}>{t('О спа')}</Link>
          <Link to="/#guest-info" onClick={close}>{t('Гостям')}</Link>
          <Link to="/franchise" onClick={close}>{t('Франшиза')}</Link>
          <Link to="/#contacts" onClick={close}>{t('Контакты')}</Link>
        </nav>

        <div className="site-header__actions">
          <div className="lang-switch" role="group" aria-label="Язык сайта">
            {LANGS.map((l, i) => (
              <span key={l.code}>
                {i > 0 && <span className="lang-switch__divider">/</span>}
                <button
                  type="button"
                  className={lang === l.code ? 'is-active' : ''}
                  onClick={() => setLang(l.code)}
                >
                  {l.short}
                </button>
              </span>
            ))}
          </div>
          <Link to="/#branches" className="btn btn-coral site-header__cta" onClick={close}>
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
