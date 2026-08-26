import { useEffect } from 'react'
import { useT } from '../i18n.jsx'

// "Подробнее" detail view for a single service. Shows the full, real data for
// that service — photo, description, every duration/price variant and (when the
// service has one) its "что входит" composition — then hands off to the booking
// form via onBook.
export default function ServiceDetailModal({ service, onClose, onBook }) {
  const t = useT()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!service) return null

  return (
    <div className="svc-modal" role="dialog" aria-modal="true" aria-label={t(service.name)}>
      <div className="svc-modal__backdrop" onClick={onClose} />
      <div className="svc-modal__panel">
        <button type="button" className="svc-modal__close" aria-label={t('Закрыть')} onClick={onClose}>
          ×
        </button>

        <div
          className="svc-modal__photo"
          style={{ backgroundImage: `url(${service.image})` }}
        >
          {service.premium && <span className="svc-modal__badge">Premium</span>}
        </div>

        <div className="svc-modal__body">
          <h2 className="svc-modal__title serif">{t(service.name)}</h2>

          {service.description && service.composition.length === 0 && (
            <p className="svc-modal__desc">{t(service.description)}</p>
          )}

          <div className="svc-modal__prices">
            <p className="svc-modal__lbl">{t('Длительность и стоимость')}</p>
            <ul>
              {service.variants.map((v, i) => (
                <li key={i}>
                  <span>{v.duration || t('Сеанс')}</span>
                  <b>{v.from ? t('от') + ' ' : ''}{v.price}</b>
                </li>
              ))}
            </ul>
          </div>

          {service.composition.length > 0 && (
            <div className="svc-modal__incl">
              <p className="svc-modal__lbl">{t('Что входит')}</p>
              <ul>
                {service.composition.map((c, i) => (
                  <li key={i}><span>◇</span>{t(c)}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="svc-modal__actions">
            <button className="btn btn-gold" onClick={() => onBook(service)}>
              {t('Записаться')}
            </button>
            <button className="btn btn-ghost" onClick={onClose}>
              {t('Закрыть')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
