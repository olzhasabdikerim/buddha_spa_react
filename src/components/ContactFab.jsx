import { useEffect, useRef, useState } from 'react'
import { BRANCHES } from '../data/branches.js'
import { useT } from '../i18n.jsx'

// Floating "Связаться с нами" button (bottom-right). Opens a branch list; each
// branch links to its own WhatsApp with a pre-filled message.
export default function ContactFab() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [open])

  const waLink = (b) => {
    const label = `${b.city}, ${b.name || b.address}`
    const text = encodeURIComponent(`Здравствуйте! Пишу с сайта BuddhaSpa — ${label}.`)
    return `https://wa.me/${b.whatsapp}?text=${text}`
  }

  return (
    <div className={`contact-fab ${open ? 'is-open' : ''}`} ref={ref}>
      {open && (
        <div className="contact-fab__menu" role="menu">
          <p className="contact-fab__title">{t('Выберите филиал')}</p>
          <ul>
            {BRANCHES.map((b) => (
              <li key={b.slug}>
                <a href={waLink(b)} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={() => setOpen(false)}>
                  <span className="contact-fab__branch">{t(b.city)}, {b.name || b.address}</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className="contact-fab__wa">
                    <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.3.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1l1.9.9c.3.2.5.2.5.4.1.2.1.9-.1 1.5z"/>
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" className="contact-fab__btn" aria-expanded={open} aria-label={t('Связаться с нами')} onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .3-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.3.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1c.2-.2.4-.2.6-.1l1.9.9c.3.2.5.2.5.4.1.2.1.9-.1 1.5z"/>
        </svg>
        <span className="contact-fab__label">{t('Связаться с нами')}</span>
      </button>
    </div>
  )
}
