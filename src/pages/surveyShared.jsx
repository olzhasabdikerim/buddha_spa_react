import { useState, useRef, useEffect } from 'react'
import { useT, useLang, LANGS } from '../i18n.jsx'

export function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  let d = digits.startsWith('7') ? digits : ('7' + digits).slice(0, 11)
  let out = '+7'
  if (d.length > 1) out += ' (' + d.slice(1, 4)
  if (d.length >= 4) out += ') ' + d.slice(4, 7)
  if (d.length >= 7) out += ' ' + d.slice(7, 9)
  if (d.length >= 9) out += ' ' + d.slice(9, 11)
  return out
}

export function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div className={`cselect${open ? ' cselect--open' : ''}`} ref={ref}>
      <button type="button" className="cselect__trigger"
        onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={value ? '' : 'cselect__placeholder'}>{value || placeholder}</span>
        <svg className="cselect__chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <ul className="cselect__list" role="listbox">
          {options.map((opt) => (
            <li key={opt} role="option" aria-selected={value === opt}
              className={`cselect__option${value === opt ? ' cselect__option--active' : ''}`}
              onMouseDown={() => { onChange(opt); setOpen(false) }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Stars({ value, onChange, max = 5 }) {
  const t = useT()
  const [hovered, setHovered] = useState(null)
  const active = hovered ?? value
  return (
    <div className="stars" onMouseLeave={() => setHovered(null)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button"
          className={`star${active !== null && active >= n ? ' star--filled' : ''}`}
          onMouseEnter={() => setHovered(n)} onClick={() => onChange(n)}
          aria-label={`${n} ${t('из')} ${max}`}>★</button>
      ))}
      {value !== null && <span className="stars-value">{value} {t('из')} {max}</span>}
    </div>
  )
}

export function StarField({ label, subLabel, required, value, onChange }) {
  return (
    <div className="survey-field">
      <label className="survey-label">
        {label}
        {required && <span className="survey-req"> *</span>}
        {subLabel && <span className="survey-sublabel">{subLabel}</span>}
      </label>
      <Stars value={value} onChange={onChange} />
    </div>
  )
}

export function NpsRow({ value, onChange }) {
  const t = useT()
  const [hovered, setHovered] = useState(null)
  return (
    <div className="survey-field">
      <label className="survey-label">
        {t('Насколько вероятно, что Вы порекомендуете Buddha Spa друзьям?')} <span className="survey-req">*</span>
        <span className="survey-sublabel">{t('0 — точно не порекомендую · 10 — обязательно порекомендую')}</span>
      </label>
      <div className="nps-row" onMouseLeave={() => setHovered(null)}>
        {Array.from({ length: 11 }, (_, i) => i).map((n) => {
          const isSelected = value !== null && n <= value
          const isHovering = hovered !== null && n <= hovered && !isSelected
          return (
            <button key={n} type="button"
              className={`nps-btn${isSelected ? ' nps-btn--active' : ''}${isHovering ? ' nps-btn--hover' : ''}`}
              onMouseEnter={() => setHovered(n)} onClick={() => onChange(n)}>
              {n}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function SurveyLangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="survey-lang-switch">
      {LANGS.map(({ code, short }) => (
        <button key={code} type="button"
          className={`survey-lang-btn${lang === code ? ' survey-lang-btn--active' : ''}`}
          onClick={() => setLang(code)}>
          {short}
        </button>
      ))}
    </div>
  )
}
