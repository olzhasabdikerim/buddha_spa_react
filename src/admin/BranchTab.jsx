import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { Toast, useToast } from './Toast.jsx'

const FIELDS = [
  { key: 'name',         label: 'Название' },
  { key: 'phone',        label: 'Телефон' },
  { key: 'hours',        label: 'Часы работы' },
  { key: 'address',      label: 'Адрес (короткий)' },
  { key: 'full_address', label: 'Полный адрес' },
  { key: 'about_text',   label: 'О филиале', textarea: true },
]

export default function BranchTab({ branch, onUpdate }) {
  const [form, setForm] = useState({
    name:         branch.name || '',
    phone:        branch.phone || '',
    hours:        branch.hours || '',
    address:      branch.address || '',
    full_address: branch.full_address || '',
    about_text:   branch.about_text || '',
  })
  const [saving, setSaving] = useState(false)
  const { toast, show } = useToast()

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('branches').update(form).eq('id', branch.id)
    if (error) show('Ошибка сохранения', 'err')
    else { show('Сохранено ✓'); onUpdate?.({ ...branch, ...form }) }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      {FIELDS.map(f => (
        <div key={f.key} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6 }}>{f.label}</label>
          {f.textarea
            ? <textarea className="adm-field" rows={3} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ resize: 'vertical' }} />
            : <input className="adm-field" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          }
        </div>
      ))}
      <button className="adm-btn adm-btn--gold" onClick={save} disabled={saving}>
        {saving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
      <Toast toast={toast} />
    </div>
  )
}
