import { useEffect, useMemo, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

// Format a raw phone input into the Kazakhstan mask: +7 (XXX) XXX-XX-XX.
function formatKzPhone(input) {
  let d = String(input).replace(/\D/g, '')
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  const p = d.slice(1)
  let out = '+7'
  if (p.length > 0) out += ' (' + p.slice(0, 3)
  if (p.length >= 3) out += ')'
  if (p.length > 3) out += ' ' + p.slice(3, 6)
  if (p.length > 6) out += '-' + p.slice(6, 8)
  if (p.length > 8) out += '-' + p.slice(8, 10)
  return out
}

function money(n) {
  return `${Number(n || 0).toLocaleString('ru-RU')} ₸`
}

// Premium booking drawer. Opened from a service card or a generic "Записаться"
// button. Shows the chosen service with a quantity stepper and a live total,
// then collects name / phone / comment. Posts to /api/lead (Telegram).
export default function LeadModal({ branch, service, onClose }) {
  const t = useT()
  const [status, setStatus] = useState('idle') // idle | sending | ok | error
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [phone, setPhone] = useState('')
  const nameRef = useRef(null)

  const unitPrice = service?.priceNum || 0
  const total = useMemo(() => unitPrice * qty, [unitPrice, qty])
  const hasPrice = unitPrice > 0

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
    const userComment = String(fd.get('comment') || '').trim()
    // Fold the order (qty + total) into the comment so it reaches Telegram
    // without changing the serverless API contract.
    const orderLine = service
      ? `Услуга: ${service.name}${qty > 1 ? ` × ${qty}` : ''}${hasPrice ? ` · Итого: ${money(total)}` : ''}`
      : ''
    const comment = [orderLine, userComment].filter(Boolean).join('\n')

    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      comment,
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
    <div className="lead-modal" role="dialog" aria-modal="true" aria-label={t('Записаться в BuddhaSpa')}>
      <div className="lead-modal__backdrop" onClick={onClose} />
      <div className="lead-modal__panel">
        <button type="button" className="lead-modal__close" aria-label={t('Закрыть')} onClick={onClose}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {status === 'ok' ? (
          <div className="lead-modal__done">
            <div className="lead-modal__done-ring"><span /></div>
            <h3>{t('Заявка принята')}</h3>
            <p>{t('Мы свяжемся с вами в ближайшее время в рабочее время салона.')}</p>
            <button type="button" className="btn btn-gold" onClick={onClose}>{t('Хорошо')}</button>
          </div>
        ) : (
          <div className="lead-modal__scroll">
            <p className="eyebrow lead-modal__eyebrow">
              {branch ? `${t(branch.city)}, ${branch.address}` : 'BuddhaSpa'}
            </p>
            <h2 className="lead-modal__title">{t('Записаться в BuddhaSpa')}</h2>

            {service && (
              <div className="lead-order">
                <div
                  className="lead-order__img"
                  style={service.image ? { backgroundImage: `url(${service.image})` } : undefined}
                  aria-hidden="true"
                />
                <div className="lead-order__body">
                  <div className="lead-order__name">{t(service.name)}</div>
                  {service.duration && <div className="lead-order__dur">{service.duration}</div>}
                  <div className="lead-order__row">
                    <div className="lead-qty" role="group" aria-label={t('Количество')}>
                      <button
                        type="button"
                        className="lead-qty__btn"
                        aria-label={t('Меньше')}
                        disabled={qty <= 1}
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                      >−</button>
                      <span className="lead-qty__val" aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        className="lead-qty__btn"
                        aria-label={t('Больше')}
                        onClick={() => setQty((q) => Math.min(20, q + 1))}
                      >+</button>
                    </div>
                    {hasPrice && <div className="lead-order__price">{money(unitPrice)}</div>}
                  </div>
                </div>
              </div>
            )}

            <form className="lead-form" onSubmit={onSubmit}>
              {/* honeypot */}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="lead-form__hp" aria-hidden="true" />

              <label className="lead-form__field">
                <span>{t('Имя')}</span>
                <input ref={nameRef} type="text" name="name" required placeholder={t('Ваше имя')} />
              </label>
              <label className="lead-form__field">
                <span>{t('Телефон')}</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  inputMode="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(formatKzPhone(e.target.value))}
                  onFocus={(e) => { if (!phone) { setPhone('+7 ('); requestAnimationFrame(() => e.target.setSelectionRange(4, 4)) } }}
                />
              </label>
              <label className="lead-form__field">
                <span>{t('Комментарий')} <em>{t('(необязательно)')}</em></span>
                <textarea
                  name="comment"
                  rows={2}
                  placeholder={t('Есть пожелания по массажу или важная информация для мастера?')}
                />
              </label>

              {status === 'error' && (
                <p className="lead-form__error">
                  {error || t('Не удалось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp.')}
                </p>
              )}

              <div className="lead-total">
                <span className="lead-total__label">{t('Итого')}</span>
                <span className="lead-total__value">{hasPrice ? money(total) : t('по запросу')}</span>
              </div>

              <button type="submit" className="btn btn-gold lead-form__submit" disabled={status === 'sending'}>
                {status === 'sending' ? t('Отправляем…') : t('Записаться в BuddhaSpa')}
              </button>
              <p className="lead-form__note">{t('Нажимая кнопку, вы соглашаетесь на обработку персональных данных.')}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
