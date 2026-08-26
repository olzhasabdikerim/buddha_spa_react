import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

// Booking form modal. Opened from a service card ("Подробнее") or a generic
// "Записаться" button. Posts to /api/lead which routes to Bitrix24 + Telegram.
export default function LeadModal({ branch, service, onClose }) {
  const t = useT()
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const [error, setError] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    nameRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      comment: fd.get('comment'),
      company: fd.get('company'), // honeypot
      city: branch?.city || '',
      branchSlug: branch?.slug || '',
      branchLabel: branch ? `${branch.city}, ${branch.address}` : '',
      service: service?.name || '',
      duration: service?.duration || '',
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      source: (typeof document !== 'undefined' && document.referrer) || 'Прямой переход',
    }
    setStatus('sending')
    setError('')
    try {
      const resp = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || !data.ok) throw new Error(data.error || 'error')
      setStatus('ok')
    } catch (err) {
      setError(err.message === 'error' ? '' : err.message)
      setStatus('error')
    }
  }

  return (
    <div className="lead-modal" role="dialog" aria-modal="true" aria-label={t('Оставить заявку')}>
      <div className="lead-modal__backdrop" onClick={onClose} />
      <div className="lead-modal__panel">
        <button type="button" className="lead-modal__close" aria-label={t('Закрыть')} onClick={onClose}>
          ×
        </button>

        {status === 'ok' ? (
          <div className="lead-modal__done">
            <div className="lead-modal__done-ring"><span /></div>
            <h3>{t('Заявка принята')}</h3>
            <p>{t('Мы свяжемся с вами в ближайшее время в рабочее время салона.')}</p>
            <button type="button" className="btn btn-gold" onClick={onClose}>{t('Хорошо')}</button>
          </div>
        ) : (
          <>
            <p className="eyebrow lead-modal__eyebrow">
              {branch ? `${t(branch.city)}, ${branch.address}` : 'Buddha Spa'}
            </p>
            <h2 className="lead-modal__title">
              {service ? t(service.name) : t('Записаться в Buddha Spa')}
            </h2>

            {service && (
              <div className="lead-modal__service">
                {service.description && <p className="lead-modal__service-desc">{t(service.description)}</p>}
                <div className="lead-modal__service-meta">
                  {service.duration && <span>{service.duration}</span>}
                  {service.price && <span className="lead-modal__service-price">{service.price.replace('тг.', t('тг.'))}</span>}
                </div>
              </div>
            )}

            <p className="lead-modal__lead">{t('Оставьте контакты — администратор перезвонит, подберёт удобное время и ответит на вопросы.')}</p>

            <form className="lead-form" onSubmit={onSubmit}>
              {/* honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="lead-form__hp"
                aria-hidden="true"
              />
              <label className="lead-form__field">
                <span>{t('Ваше имя')}</span>
                <input ref={nameRef} type="text" name="name" required placeholder={t('Как к вам обращаться?')} />
              </label>
              <label className="lead-form__field">
                <span>{t('Телефон / WhatsApp')}</span>
                <input type="tel" name="phone" required placeholder="+7 ___ ___ __ __" />
              </label>
              <label className="lead-form__field">
                <span>{t('Комментарий')} <em>{t('(необязательно)')}</em></span>
                <textarea name="comment" rows={2} placeholder={t('Желаемая дата, время или пожелания')} />
              </label>

              {status === 'error' && (
                <p className="lead-form__error">
                  {error || t('Не удалось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp.')}
                </p>
              )}

              <button type="submit" className="btn btn-gold lead-form__submit" disabled={status === 'sending'}>
                {status === 'sending' ? t('Отправляем…') : t('Отправить заявку →')}
              </button>
              <p className="lead-form__note">{t('Нажимая кнопку, вы соглашаетесь на обработку персональных данных.')}</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
