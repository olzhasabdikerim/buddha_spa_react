import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

const API_URL = '/api/ai-chat'

function getProfileId() {
  try {
    let id = localStorage.getItem('buddha_profile_id')
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('buddha_profile_id', id) }
    return id
  } catch {
    return 'guest-' + Math.random().toString(36).slice(2)
  }
}

export default function AiChat() {
  const t = useT()
  const [open, setOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: getProfileId(),
          phone: '',
          message: text,
          guest_name: null,
        }),
      })
      const data = await res.json()
      const reply = data.reply ?? data.message ?? data.text ?? data.response ?? '—'
      setMessages((m) => [...m, { role: 'bot', text: reply }])
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: t('Ошибка соединения. Попробуйте ещё раз.') }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="ai-chat-wrap">
      {open && (
        <div className="ai-chat-panel" role="dialog" aria-label={t('AI-ассистент Buddha Spa')}>
          {/* Header */}
          <div className="ai-chat-panel__head">
            <div className="ai-chat-panel__title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3h1V7a5 5 0 0 1 5-5z"/>
                <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/>
                <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
              </svg>
              <span>{t('Дана ИИ')}</span>
            </div>
            <button className="ai-chat-panel__close" onClick={() => setOpen(false)} aria-label={t('Закрыть чат')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chat-panel__msgs">
            <div className="ai-chat-msg ai-chat-msg--bot">
              {t('Привет! Я Дана ИИ — ассистент Buddha Spa. Задайте любой вопрос — помогу с записью, услугами и ценами.')}
            </div>
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-msg ai-chat-msg--${m.role}`}>{m.text}</div>
            ))}
            {loading && (
              <div className="ai-chat-msg ai-chat-msg--bot ai-chat-msg--typing" aria-label={t('Печатает...')}>
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="ai-chat-panel__input">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={t('Напишите вопрос...')}
              disabled={loading}
              aria-label={t('Сообщение')}
            />
            <button onClick={send} disabled={loading || !input.trim()} aria-label={t('Отправить')}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        className={`ai-chat-fab ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t('Дана ИИ')}
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M12 2a5 5 0 0 1 5 5v1h1a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-5a3 3 0 0 1 3-3h1V7a5 5 0 0 1 5-5z"/>
          <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none"/>
          <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none"/>
        </svg>
      </button>
    </div>
  )
}
