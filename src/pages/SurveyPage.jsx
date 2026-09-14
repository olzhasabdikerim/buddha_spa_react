import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useBranches } from '../contexts/BranchesContext.jsx'
import { useT, useLang, LANGS } from '../i18n.jsx'
import { formatPhone, Stars, StarField, NpsRow, SurveyLangSwitcher } from './surveyShared.jsx'
import '../survey.css'

const VISIT_TYPES = [
  { value: 'первый раз', labelKey: 'Первый визит', icon: '✨' },
  { value: 'по сертификату', labelKey: 'По сертификату', icon: '🎁' },
  { value: 'постоянный гость', labelKey: 'Постоянный гость', icon: '🌿' },
]

const INITIAL = {
  name: '',
  phone: '',
  visitRating: null,
  visitComment: '',
  runnerRating: null,
  cleanRating: null,
  cleanComment: '',
  atmosRating: null,
  atmosComment: '',
  nps: null,
  visitType: '',
  disappointment: '',
}

export default function SurveyPage() {
  const { branchSlug } = useParams()
  const branches = useBranches()
  const branch = (branches || []).find((b) => b.slug === branchSlug)
  const t = useT()

  if (!branches) return <div className="route-fallback" aria-busy="true" />
  if (!branch) return <Navigate to="/" replace />

  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!form.name.trim()) return setErrorMsg(t('Пожалуйста, укажите имя и фамилию'))
    if (form.phone.replace(/\D/g, '').length < 10) return setErrorMsg(t('Укажите корректный номер телефона'))

    const ratings = [
      ['visitRating', 'Оцените общее впечатление от визита'],
      ['runnerRating', 'Оцените работу Раннера'],
      ['cleanRating', 'Оцените чистоту'],
      ['atmosRating', 'Оцените атмосферу'],
    ]
    for (const [key, label] of ratings) {
      if (form[key] === null) return setErrorMsg(t(label))
    }
    if (form.nps === null) return setErrorMsg(t('Укажите, насколько вероятно Вы порекомендуете нас (0–10)'))
    if (!form.visitType) return setErrorMsg(t('Укажите тип визита'))

    setStatus('sending')
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          branchSlug: branch.slug,
          branchName: `${branch.city} · ${branch.name}`,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('success')
      } else {
        setStatus('idle')
        setErrorMsg(data.error || t('Ошибка отправки. Попробуйте позже.'))
      }
    } catch {
      setStatus('idle')
      setErrorMsg(t('Ошибка сети. Проверьте соединение и попробуйте ещё раз.'))
    }
  }

  if (status === 'success') {
    return (
      <div className="survey-page">
        <div className="survey-bg-deco" aria-hidden="true" />
        <div className="survey-wrap">
          <div className="survey-success">
            <div className="survey-success__lotus">✦</div>
            <h2>{t('Спасибо за Ваш отзыв')}</h2>
            <p>{t('В благодарность за ваше мнение мы дарим вам скидку 15% на любую услугу BuddhaSpa при следующем посещении.')}</p>

            <div className="promo-card">
              <div className="promo-card__discount">{t('СКИДКА')} 15%</div>
              <div className="promo-card__label">{t('ВАШ ПРОМОКОД')}</div>
              <div className="promo-card__code">Pikir2026</div>
              <div className="promo-card__branch">📍 {branch.city} · {branch.name}</div>
              <button
                type="button"
                className="promo-card__copy"
                onClick={() => {
                  navigator.clipboard.writeText('Pikir2026').catch(() => {})
                  const el = document.querySelector('.promo-card__copy')
                  if (el) { el.textContent = t('Скопировано!'); setTimeout(() => { el.textContent = t('Скопировать промокод') }, 2000) }
                }}
              >
                {t('Скопировать промокод')}
              </button>
            </div>

            <p className="promo-hint">{t('Сохраните этот экран или сделайте скриншот и предъявите его при следующем посещении.')}</p>
            <p className="promo-hint promo-hint--sub">{t('Промокод действует только в филиале')} {branch.city} · {branch.name}.</p>

            <div className="survey-success__line" />
            <span className="survey-success__brand">🌿 BuddhaSpa · {branch.city}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="survey-page">
      <div className="survey-bg-deco" aria-hidden="true" />

      <div className="survey-hero">
        <div className="survey-wrap">
          <SurveyLangSwitcher />
          <div className="survey-eyebrow">{t('Оцените Ваш визит')}</div>
          <h1 className="survey-hero-title">
            {t('Ваше мнение')}<br />{t('важно для нас')}
          </h1>
          <p className="survey-hero-sub">
            {t('Филиал')} <strong>{branch.city} · {branch.name}</strong>
          </p>
          <p className="survey-hero-desc">
            {t('Каждый ответ остаётся конфиденциальным для персонала и поступает напрямую к руководителю клиентского сервиса.')}
          </p>
        </div>
      </div>

      <div className="survey-wrap">
        <form className="survey-form" onSubmit={handleSubmit} noValidate>

          <section className="survey-section">
            <div className="survey-section-title">{t('Ваши данные')}</div>
            <div className="survey-section-body">
              <div className="survey-field">
                <label className="survey-label">{t('Имя и фамилия')} <span className="survey-req">*</span></label>
                <input className="survey-input" type="text" value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder={t('Например: Айгерим Сейтова')} autoComplete="name" />
              </div>
              <div className="survey-field">
                <label className="survey-label">{t('Номер телефона')} <span className="survey-req">*</span></label>
                <input className="survey-input" type="tel" value={form.phone}
                  onChange={(e) => set('phone', formatPhone(e.target.value))}
                  placeholder="+7 (___) ___ __ __" autoComplete="tel" />
              </div>
            </div>
          </section>

          <section className="survey-section">
            <div className="survey-section-title">{t('Впечатление от визита')}</div>
            <div className="survey-section-body">
              <StarField label={t('Общее впечатление от посещения Buddha Spa')} required
                value={form.visitRating} onChange={(v) => set('visitRating', v)} />
              <div className="survey-field">
                <label className="survey-label">{t('Что повлияло на Вашу оценку?')}</label>
                <textarea className="survey-textarea" value={form.visitComment}
                  onChange={(e) => set('visitComment', e.target.value)} rows={3}
                  placeholder={t('Расскажите, что понравилось или что можно улучшить')} />
              </div>
            </div>
          </section>

          <section className="survey-section">
            <div className="survey-section-title">{t('Сервис и комфорт')}</div>
            <div className="survey-section-body">
              <StarField label={t('Внимание и забота Раннера')} subLabel={t('Встреча, сопровождение, чай')}
                required value={form.runnerRating} onChange={(v) => set('runnerRating', v)} />
              <StarField label={t('Чистота в кабинете и зонах отдыха')} required
                value={form.cleanRating} onChange={(v) => set('cleanRating', v)} />
              <div className="survey-field">
                <label className="survey-label">{t('Комментарий по чистоте')}</label>
                <textarea className="survey-textarea" value={form.cleanComment}
                  onChange={(e) => set('cleanComment', e.target.value)} rows={2}
                  placeholder={t('Если что-то было не так — напишите нам')} />
              </div>
              <StarField label={t('Атмосфера: музыка, аромат, освещение')} required
                value={form.atmosRating} onChange={(v) => set('atmosRating', v)} />
              <div className="survey-field">
                <label className="survey-label">{t('Комментарий по атмосфере')}</label>
                <textarea className="survey-textarea" value={form.atmosComment}
                  onChange={(e) => set('atmosComment', e.target.value)} rows={2}
                  placeholder={t('Что добавить или изменить?')} />
              </div>
            </div>
          </section>

          <section className="survey-section">
            <div className="survey-section-title">{t('Рекомендации')}</div>
            <div className="survey-section-body">
              <NpsRow value={form.nps} onChange={(v) => set('nps', v)} />
              <div className="survey-field">
                <label className="survey-label">{t('Тип визита')} <span className="survey-req">*</span></label>
                <div className="survey-radio-group">
                  {VISIT_TYPES.map(({ value, labelKey, icon }) => (
                    <label key={value} className={`survey-radio${form.visitType === value ? ' active' : ''}`}>
                      <input type="radio" name="visitType" value={value}
                        checked={form.visitType === value} onChange={() => set('visitType', value)} />
                      <span className="survey-radio__icon">{icon}</span>
                      {t(labelKey)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="survey-field">
                <label className="survey-label">
                  {t('Что Вас разочаровало?')}
                  <span className="survey-sublabel">{t('Необязательно, но очень важно для нас')}</span>
                </label>
                <textarea className="survey-textarea" value={form.disappointment}
                  onChange={(e) => set('disappointment', e.target.value)} rows={3}
                  placeholder={t('Любой негативный момент поможет нам стать лучше')} />
              </div>
            </div>
          </section>

          {errorMsg && <p className="survey-error">⚠ {errorMsg}</p>}

          <button type="submit" className="survey-submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <span className="survey-submit__inner">
                <span className="survey-submit__spinner" /> {t('Отправка…')}
              </span>
            ) : t('Отправить отзыв')}
          </button>

          <p className="survey-footer-note">
            {t('Ваши ответы конфиденциальны и не передаются персоналу филиала')}
          </p>
        </form>
      </div>
    </div>
  )
}
