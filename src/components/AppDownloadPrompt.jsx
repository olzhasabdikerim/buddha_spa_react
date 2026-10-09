import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'
import { APP_URL } from './AppSection.jsx'
import { BRAND_EMBLEM } from './Header.jsx'

// One-off "download BuddhaSpa App" prompt. Mounted once in App; `eligible` says
// whether the current route may show it. Shows at most once per session, after
// 10s or 35% scroll (never before 3s), and respects 7-day / 30-day caps.

const K_DISMISSED = 'buddha_app_popup_dismissed_at'
const K_CLICKED = 'buddha_app_popup_clicked_at'
const K_SHOWN = 'buddha_app_popup_shown'
const DAY = 24 * 60 * 60 * 1000
const MIN_DELAY = 3000
const TIME_TRIGGER = 10000
const SCROLL_TRIGGER = 0.35
// Interfaces the prompt must never cover; a ready prompt waits until they close.
const BLOCKERS = '.lead-modal, .legal-modal, .svc-modal, .ai-chat-panel, .contact-fab.is-open'

let shownThisSession = false // fallback in case sessionStorage silently resets

function isAndroid() {
  try {
    return navigator.userAgentData?.platform === 'Android' || /Android/i.test(navigator.userAgent)
  } catch {
    return false
  }
}

// Storage unavailable → treat as "not allowed" so the prompt never nags on every load.
function capAllows() {
  try {
    const now = Date.now()
    if (now - (Number(localStorage.getItem(K_DISMISSED)) || 0) < 7 * DAY) return false
    if (now - (Number(localStorage.getItem(K_CLICKED)) || 0) < 30 * DAY) return false
    return !sessionStorage.getItem(K_SHOWN)
  } catch {
    return false
  }
}

function remember(key, storage = localStorage) {
  try { storage.setItem(key, String(Date.now())); return true } catch { return false }
}

export default function AppDownloadPrompt({ eligible, routeKey }) {
  const t = useT()
  const [phase, setPhase] = useState('idle') // idle → pending → open → done
  const [android] = useState(isAndroid)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const returnFocusRef = useRef(null)

  // 1) Arm the triggers on every eligible route until the prompt has been shown.
  useEffect(() => {
    if (!eligible || android || phase !== 'idle' || shownThisSession) return
    const start = Date.now()
    let delayTimer
    const fire = () => { cleanup(); setPhase('pending') }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0 || window.scrollY / max < SCROLL_TRIGGER) return
      window.removeEventListener('scroll', onScroll)
      const wait = MIN_DELAY - (Date.now() - start)
      if (wait > 0) delayTimer = setTimeout(fire, wait)
      else fire()
    }
    const timer = setTimeout(fire, TIME_TRIGGER)
    window.addEventListener('scroll', onScroll, { passive: true })
    function cleanup() {
      clearTimeout(timer)
      clearTimeout(delayTimer)
      window.removeEventListener('scroll', onScroll)
    }
    return cleanup
  }, [eligible, android, phase, routeKey])

  // 2) Triggered: show as soon as nothing blocking is open (light 1s re-check).
  useEffect(() => {
    if (phase !== 'pending') return
    if (!eligible) { setPhase('idle'); return }
    const tryShow = () => {
      if (document.querySelector(BLOCKERS)) return false
      if (!capAllows() || !remember(K_SHOWN, sessionStorage)) { setPhase('done'); return true }
      shownThisSession = true
      returnFocusRef.current = document.activeElement
      setPhase('open')
      return true
    }
    if (tryShow()) return
    const id = setInterval(() => { if (tryShow()) clearInterval(id) }, 1000)
    return () => clearInterval(id)
  }, [phase, eligible])

  // Leaving an eligible route while open simply hides it (still counts as shown).
  useEffect(() => {
    if (phase === 'open' && !eligible) setPhase('done')
  }, [phase, eligible])

  const close = useCallback(() => {
    setPhase('done')
    const el = returnFocusRef.current
    if (el && typeof el.focus === 'function' && document.contains(el)) el.focus()
  }, [])

  const dismiss = useCallback(() => {
    remember(K_DISMISSED)
    close()
  }, [close])

  const onDownload = () => {
    remember(K_CLICKED)
    // let the link's own navigation (new tab) happen before unmounting it
    setTimeout(close, 0)
  }

  // 3) Open: focus the close button, Escape closes, Tab stays inside the dialog.
  useEffect(() => {
    if (phase !== 'open') return
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); dismiss(); return }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = [...dialogRef.current.querySelectorAll('a[href], button')].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [phase, dismiss])

  if (phase !== 'open') return null

  return (
    <div className="app-prompt" onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}>
      <div className="app-prompt__card" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="app-prompt-title">
        <button type="button" className="app-prompt__close" ref={closeRef} onClick={dismiss} aria-label={t('Закрыть')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <p className="eyebrow app-prompt__eyebrow">BuddhaSpa App</p>
        <h2 id="app-prompt-title" className="app-prompt__title">{t('Записывайтесь в Buddha Spa быстрее')}</h2>
        <p className="app-prompt__text">{t('Выбирайте филиал, услуги и удобное время прямо в приложении.')}</p>
        <div className="app-prompt__qr">
          <img src="/images/app/appstore-qr.svg" alt={t('QR-код для скачивания BuddhaSpa App в App Store')} width="200" height="200" />
          <img src={BRAND_EMBLEM} alt="" aria-hidden="true" className="app-prompt__emblem" />
        </div>
        <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-coral app-prompt__cta" onClick={onDownload}>
          {t('Скачать в App Store')}
        </a>
      </div>
    </div>
  )
}
