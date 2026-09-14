import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useBranches } from '../contexts/BranchesContext.jsx'
import { useT } from '../i18n.jsx'
import { formatPhone, CustomSelect, StarField, SurveyLangSwitcher } from './surveyShared.jsx'
import '../survey.css'

const INITIAL = {
  name: '',
  phone: '',
  master: '',
  masterRating: null,
  masterQualRating: null,
  comment: '',
}

export default function MasterPage() {
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
    if (!form.master) return setErrorMsg(t('Выберите мастера, который Вас обслуживал'))
    if (form.masterRating === null) return setErrorMsg(t('Поставьте оценку мастеру'))
    if (form.masterQualRating === null) return setErrorMsg(t('Оцените профессионализм мастера'))

    setStatus('sending')
    try {
      const res = await fetch('/api/master', {
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

  const masters = branch.team?.map((m) => m.name) ?? []

  if (status === 'success') {
    return (
      <div className="survey-page">
        <div className="survey-bg-deco" aria-hidden="true" />
        <div className="survey-wrap">
          <div className="survey-success">
            <div className="survey-success__lotus">✦</div>
            <h2>{t('Спасибо за оценку мастера')}</h2>
            <p>{t('Ваша оценка помогает нам поддерживать высокий уровень мастерства. Мы ценим каждый отзыв.')}</p>
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
          <div className="survey-eyebrow">{t('Оцените вашего мастера')}</div>
          <h1 className="survey-hero-title">
            {t('Мастер — это')}<br />{t('сердце BuddhaSpa')}
          </h1>
          <p className="survey-hero-sub">
            {t('Филиал')} <strong>{branch.city} · {branch.name}</strong>
          </p>
          <p className="survey-hero-desc">
            {t('Каждая оценка мастера помогает нам поддерживать высокий уровень сервиса и профессионализма.')}
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
            <div className="survey-section-title">{t('Ваш мастер')}</div>
            <div className="survey-section-body">
              <div className="survey-field">
                <label className="survey-label">{t('Кто Вас обслуживал?')} <span className="survey-req">*</span></label>
                {masters.length > 0 ? (
                  <CustomSelect value={form.master} onChange={(v) => set('master', v)}
                    options={masters} placeholder={t('— выберите мастера —')} />
                ) : (
                  <input className="survey-input" type="text" value={form.master}
                    onChange={(e) => set('master', e.target.value)}
                    placeholder={t('Имя мастера')} />
                )}
              </div>

              <StarField label={t('Общая оценка мастера')} required
                value={form.masterRating} onChange={(v) => set('masterRating', v)} />

              <StarField label={t('Профессионализм и качество массажа')} required
                value={form.masterQualRating} onChange={(v) => set('masterQualRating', v)} />

              <div className="survey-field">
                <label className="survey-label">
                  {t('Комментарий о мастере')}
                  <span className="survey-sublabel">{t('Необязательно, но очень важно для нас')}</span>
                </label>
                <textarea className="survey-textarea" value={form.comment}
                  onChange={(e) => set('comment', e.target.value)} rows={3}
                  placeholder={t('Что вам особенно понравилось или что можно улучшить?')} />
              </div>
            </div>
          </section>

          {errorMsg && <p className="survey-error">⚠ {errorMsg}</p>}

          <button type="submit" className="survey-submit" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <span className="survey-submit__inner">
                <span className="survey-submit__spinner" /> {t('Отправка…')}
              </span>
            ) : t('Отправить оценку')}
          </button>

          <p className="survey-footer-note">
            {t('Ваши ответы конфиденциальны и не передаются персоналу филиала')}
          </p>
        </form>
      </div>
    </div>
  )
}
