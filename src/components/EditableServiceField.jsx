import { useEffect, useState } from 'react'
import { useEditMode } from '../contexts/EditModeContext.jsx'
import { supabase } from '../lib/supabase.js'
import { EditorModal } from './EditableText.jsx'

const FIELD_LABELS = {
  name: 'Название услуги',
  description: 'Описание / состав',
  price: 'Цена',
}

// Inline editor for services table fields (name, description, price).
// Opens a floating modal on click — consistent with EditableText.
export function EditableServiceField({
  as: Tag = 'span',
  serviceId,
  branchId,
  serviceName,
  field,
  value,
  hint,
  children,
  style,
  ...props
}) {
  const { isEditMode } = useEditMode()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value || '')
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (!editing) setDraft(value || '') }, [value, editing])

  if (!isEditMode) return <Tag style={style} {...props}>{value ?? children}</Tag>

  const save = async () => {
    setSaving(true)
    try {
      const val = draft.trim()
      let q = supabase.from('services').update({ [field]: val })
      if (field === 'price' && serviceId) {
        await q.eq('id', serviceId)
      } else if (branchId && serviceName) {
        await q.eq('branch_id', branchId).eq('name', serviceName)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
    setEditing(false)
  }

  const cancel = () => { setEditing(false); setDraft(value || '') }

  const startEdit = (e) => { e.stopPropagation(); setDraft(value || ''); setEditing(true) }

  return (
    <>
      <Tag
        style={{ ...style, outline: '2px dashed rgba(201,169,110,0.4)', outlineOffset: 3, cursor: 'text', borderRadius: 4 }}
        title="✏️ Нажмите для редактирования"
        onClick={startEdit}
        {...props}
      >
        {value ?? children}
      </Tag>

      {editing && (
        <EditorModal
          title={FIELD_LABELS[field] || 'Редактировать'}
          hint={hint}
          onSave={save}
          onCancel={cancel}
          saving={saving}
        >
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value)
              const el = e.target
              el.style.height = 'auto'
              el.style.height = el.scrollHeight + 'px'
            }}
            rows={field === 'description' ? 6 : 3}
            style={{
              display: 'block', width: '100%', background: '#0f0d0b', color: '#eee',
              border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px',
              fontSize: 14, fontFamily: 'inherit', lineHeight: 1.6,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              marginBottom: 4,
            }}
            onFocus={(e) => { e.target.style.borderColor = '#c9a96e' }}
            onBlur={(e) => { e.target.style.borderColor = '#2e2c28' }}
          />
          {field === 'description' && (
            <p style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
              Разделяйте пункты «что входит» символом <strong style={{ color: '#888' }}>;</strong> — например: <em style={{ color: '#666' }}>Распаривание; Пилинг; Массаж 60 мин</em>
            </p>
          )}
        </EditorModal>
      )}
    </>
  )
}
