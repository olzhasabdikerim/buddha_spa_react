import { useEffect, useRef, useState } from 'react'
import { useLang, LANGS } from '../i18n.jsx'

// Globe + current language, opening a small dropdown. Closes on selection,
// outside click and Escape. Muted bronze to match the BuddhaSpa palette.
export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGS.find((l) => l.code === lang) || LANGS[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`lang ${open ? 'is-open' : ''} ${className}`} ref={ref}>
      <button
        type="button"
        className="lang__toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Язык сайта"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="lang__globe" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3 12h18M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className="lang__code">{current.short}</span>
        <svg className="lang__caret" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="lang__menu" role="listbox" aria-label="Язык сайта">
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                className={`lang__item ${l.code === lang ? 'is-active' : ''}`}
                onClick={() => { setLang(l.code); setOpen(false) }}
              >
                <span className="lang__item-short">{l.short}</span>
                <span className="lang__item-label">{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
