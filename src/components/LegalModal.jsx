import { useEffect } from 'react'
import { LEGAL_PAGES } from '../data/company.js'

export default function LegalModal({ slug, onClose }) {
  const page = LEGAL_PAGES.find((p) => p.slug === slug)

  useEffect(() => {
    if (!page) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [page, onClose])

  if (!page) return null

  return (
    <div className="legal-modal" role="dialog" aria-modal="true" aria-label={page.title}>
      <div className="legal-modal__backdrop" onClick={onClose} />
      <div className="legal-modal__panel">
        <button type="button" className="legal-modal__close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        <h2 className="legal-modal__title">{page.title}</h2>
        <div className="legal-modal__body">
          {page.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
