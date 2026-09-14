import { useEffect, useState } from 'react'
import { useEditMode } from '../contexts/EditModeContext.jsx'
import { useContentContext, useContent } from '../contexts/ContentContext.jsx'
import { useLang } from '../i18n.jsx'

const LANG_LABELS = { ru: '🇷🇺 Русский', kk: '🇰🇿 Қазақша', en: '🇬🇧 English' }

// Shared floating modal — used by EditableText and exported for EditableServiceField
export function EditorModal({ title, hint, onSave, onCancel, saving, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') onSave()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onSave, onCancel])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(0,0,0,0.78)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{
        background: '#1a1612', border: '1px solid rgba(201,169,110,0.5)',
        borderRadius: 14, padding: 28, width: '100%', maxWidth: 520,
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: '#c9a96e', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            ✏️ {title || 'Редактировать'}
          </span>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 24, lineHeight: 1, padding: '0 4px' }}
            aria-label="Закрыть"
          >×</button>
        </div>

        {children}

        {hint && (
          <p style={{ fontSize: 11, color: '#555', marginBottom: 16, lineHeight: 1.5 }}>{hint}</p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button
            onClick={onSave} disabled={saving}
            style={{
              flex: 1, padding: '12px 0', background: saving ? '#8a7040' : '#c9a96e',
              color: '#000', border: 'none', borderRadius: 8, fontWeight: 700,
              fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', transition: '.2s',
            }}
          >
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px 0', background: 'transparent', color: '#888',
              border: '1px solid #333', borderRadius: 8, fontWeight: 600,
              fontSize: 14, cursor: 'pointer',
            }}
          >
            Отменить
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#3a3a3a', textAlign: 'center', marginTop: 10 }}>
          Ctrl + Enter — сохранить · Escape — отменить
        </p>
      </div>
    </div>
  )
}

function LangTextarea({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 6, fontWeight: 700 }}>{label}</div>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
          const el = e.target
          el.style.height = 'auto'
          el.style.height = el.scrollHeight + 'px'
        }}
        rows={3}
        style={{
          display: 'block', width: '100%', background: '#0f0d0b', color: '#eee',
          border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px',
          fontSize: 14, fontFamily: 'inherit', lineHeight: 1.6,
          resize: 'vertical', outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={(e) => { e.target.style.borderColor = '#c9a96e' }}
        onBlur={(e) => { e.target.style.borderColor = '#2e2c28' }}
      />
    </div>
  )
}

// Renders any HTML element. In edit mode: gold dashed border, click opens
// a floating modal. Pass translate={false} for numbers/prices (single field).
export function EditableText({ contentKey, fallback = '', translate = true, as: Tag = 'span', children, style, ...props }) {
  const { isEditMode } = useEditMode()
  const { content, update } = useContentContext()
  const { lang } = useLang()
  const value = useContent(contentKey, fallback)

  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState({ ru: '', kk: '', en: '' })
  const [saving, setSaving] = useState(false)

  if (!isEditMode) {
    return <Tag style={style} {...props}>{value || children}</Tag>
  }

  const openEditor = () => {
    setDrafts({
      ru: content[contentKey] ?? (lang === 'ru' ? fallback : ''),
      kk: content[`${contentKey}.kk`] ?? (lang === 'kk' ? fallback : ''),
      en: content[`${contentKey}.en`] ?? (lang === 'en' ? fallback : ''),
    })
    setEditing(true)
  }

  const save = async () => {
    setSaving(true)
    if (translate) {
      const ru = drafts.ru.trim()
      const kk = drafts.kk.trim()
      const en = drafts.en.trim()
      if (ru) await update(contentKey, ru)
      if (kk) await update(`${contentKey}.kk`, kk)
      if (en) await update(`${contentKey}.en`, en)
    } else {
      const v = drafts.ru.trim()
      if (v) await update(contentKey, v)
    }
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => setEditing(false)

  return (
    <>
      <Tag
        style={{ ...style, outline: '2px dashed rgba(201,169,110,0.4)', outlineOffset: 3, cursor: 'text', borderRadius: 4 }}
        title="✏️ Кликни чтобы редактировать"
        onClick={() => openEditor()}
        {...props}
      >
        {value || children}
      </Tag>

      {editing && (
        <EditorModal
          title={translate ? 'Редактировать текст' : 'Редактировать значение'}
          onSave={save} onCancel={cancel} saving={saving}
        >
          {translate ? (
            <>
              <LangTextarea label={LANG_LABELS.ru} value={drafts.ru} onChange={(v) => setDrafts((d) => ({ ...d, ru: v }))} placeholder="Текст на русском…" />
              <LangTextarea label={LANG_LABELS.kk} value={drafts.kk} onChange={(v) => setDrafts((d) => ({ ...d, kk: v }))} placeholder="Мәтін қазақша…" />
              <LangTextarea label={LANG_LABELS.en} value={drafts.en} onChange={(v) => setDrafts((d) => ({ ...d, en: v }))} placeholder="Text in English…" />
            </>
          ) : (
            <LangTextarea label="Значение" value={drafts.ru} onChange={(v) => setDrafts((d) => ({ ...d, ru: v }))} placeholder="Введите значение…" />
          )}
        </EditorModal>
      )}
    </>
  )
}
