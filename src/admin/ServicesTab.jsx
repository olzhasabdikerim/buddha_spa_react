import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { Toast, useToast } from './Toast.jsx'
import { SECTIONS, inferSection, resolveServiceImage } from '../data/catalog.js'

const EMPTY = { name: '', price: '', duration: '', category: null, section: '', description: '', image_url: '' }

// "60" → "60 мин"   "60/90/120" → "60 / 90 / 120 мин"   "60 мин" → untouched
function fmtDuration(val) {
  const v = (val || '').trim()
  if (!v) return v
  if (/[а-яёА-ЯЁa-zA-Z]/.test(v)) return v  // already has units
  const parts = v.split('/').map(p => p.trim()).filter(Boolean)
  if (!parts.length) return v
  return parts.join(' / ') + ' мин'
}

// "45000" → "45 000 тг."   "22 000 тг." → untouched
function fmtPrice(val) {
  const v = (val || '').trim()
  if (!v) return v
  if (/тг|₸/i.test(v)) return v  // already has units
  const digits = v.replace(/\D/g, '')
  if (!digits) return v
  return Number(digits).toLocaleString('ru-RU') + ' тг.'
}

function SectionSelect({ value, onChange, className }) {
  return (
    <select className={className || 'adm-select'} value={value || ''} onChange={e => onChange(e.target.value || null)}>
      <option value="">— авто (по названию)</option>
      {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  )
}

// preview = computed photo for display (read-only hint); value = explicit override stored in DB
function PhotoField({ preview, value, onChange }) {
  const displayImg = value || preview
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      {displayImg && (
        <img
          src={displayImg}
          alt=""
          style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: value ? '2px solid #c9a96e' : '1px solid #444', opacity: value ? 1 : 0.5 }}
          onError={e => { e.target.style.display = 'none' }}
          title={value ? 'Явно задано' : 'Авто (по названию, не сохраняется)'}
        />
      )}
      <div style={{ flex: 1 }}>
        <input
          className="adm-field"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Оставь пустым — фото подбирается автоматически"
          style={{ fontSize: 12, width: '100%' }}
        />
        {!value && preview && (
          <div style={{ fontSize: 10, color: '#555', marginTop: 3 }}>Авто-фото (полупрозрачное) — введи URL чтобы заменить</div>
        )}
      </div>
    </div>
  )
}

export default function ServicesTab({ branchId }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState({})
  const [saving, setSaving] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newSvc, setNewSvc] = useState(EMPTY)
  const [adding, setAdding] = useState(false)
  const { toast, show } = useToast()

  useEffect(() => {
    if (!branchId) return
    setLoading(true)
    supabase.from('services').select('*').eq('branch_id', branchId).order('sort_order')
      .then(({ data }) => { setServices(data || []); setLoading(false) })
  }, [branchId])

  const startEdit = (s) => setEditing(prev => ({
    ...prev,
    [s.id]: {
      name:         s.name,
      price:        s.price,
      duration:     s.duration,
      section:      inferSection(s),
      image_url:    s.image_url || '',          // only the explicit DB value
      image_auto:   resolveServiceImage(s) || '', // computed preview (never saved)
    }
  }))
  const cancelEdit = (id) => setEditing(prev => { const n = { ...prev }; delete n[id]; return n })

  const setField = (id, field, val) =>
    setEditing(p => ({ ...p, [id]: { ...p[id], [field]: val } }))

  const saveEdit = async (id) => {
    setSaving(id)
    const e = editing[id]
    const patch = {
      name:      e.name,
      price:     fmtPrice(e.price),
      duration:  fmtDuration(e.duration),
      section:   e.section || null,
      image_url: e.image_url || null,
    }
    const { error } = await supabase.from('services').update(patch).eq('id', id)
    if (error) { show('Ошибка сохранения', 'err') }
    else {
      setServices(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
      cancelEdit(id)
      show('Сохранено ✓')
    }
    setSaving(null)
  }

  const addService = async () => {
    if (!newSvc.name.trim() || !newSvc.price.trim()) { show('Заполни название и цену', 'err'); return }
    setAdding(true)
    const { data, error } = await supabase.from('services').insert({
      branch_id:   branchId,
      name:        newSvc.name.trim(),
      price:       fmtPrice(newSvc.price),
      duration:    fmtDuration(newSvc.duration),
      category:    newSvc.category,
      section:     newSvc.section || null,
      description: newSvc.description.trim() || null,
      image_url:   newSvc.image_url.trim() || null,
      sort_order:  services.length,
    }).select().single()
    if (error) show('Ошибка добавления', 'err')
    else { setServices(prev => [...prev, data]); setNewSvc(EMPTY); setShowAdd(false); show('Услуга добавлена ✓') }
    setAdding(false)
  }

  const deleteService = async (id) => {
    if (!confirm('Удалить услугу?')) return
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) show('Ошибка', 'err')
    else { setServices(prev => prev.filter(s => s.id !== id)); show('Удалено') }
  }

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="adm-empty">Загрузка...</div>

  return (
    <>
      <div className="adm-toolbar">
        <input className="adm-search" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)} />
        <span style={{ color: '#666', fontSize: 13 }}>{filtered.length} услуг</span>
        <button className="adm-btn adm-btn--gold" style={{ marginLeft: 'auto' }} onClick={() => setShowAdd(v => !v)}>
          {showAdd ? '✕ Отмена' : '+ Добавить услугу'}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#1a1a1a', border: '1px solid #c9a96e44', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, color: '#c9a96e' }}>Новая услуга</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Название *</label>
              <input className="adm-field" value={newSvc.name} onChange={e => setNewSvc(p => ({ ...p, name: e.target.value }))} placeholder="Арома массаж" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Раздел</label>
              <SectionSelect value={newSvc.section} onChange={v => setNewSvc(p => ({ ...p, section: v }))} className="adm-field" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Цена * (напр. 22000)</label>
              <input
                className="adm-field"
                value={newSvc.price}
                onChange={e => setNewSvc(p => ({ ...p, price: e.target.value }))}
                onBlur={e => setNewSvc(p => ({ ...p, price: fmtPrice(e.target.value) }))}
                placeholder="22 000 тг."
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Длительность (напр. 60)</label>
              <input
                className="adm-field"
                value={newSvc.duration}
                onChange={e => setNewSvc(p => ({ ...p, duration: e.target.value }))}
                onBlur={e => setNewSvc(p => ({ ...p, duration: fmtDuration(e.target.value) }))}
                placeholder="60 мин"
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Описание</label>
            <textarea className="adm-field" rows={2} value={newSvc.description} onChange={e => setNewSvc(p => ({ ...p, description: e.target.value }))} placeholder="Краткое описание..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#888', display: 'block', marginBottom: 4 }}>Фото (URL)</label>
            <PhotoField preview="" value={newSvc.image_url} onChange={v => setNewSvc(p => ({ ...p, image_url: v }))} />
          </div>
          <button className="adm-btn adm-btn--gold" onClick={addService} disabled={adding}>
            {adding ? 'Добавляю...' : 'Добавить услугу'}
          </button>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Раздел</th>
              <th>Услуга</th>
              <th>Длительность</th>
              <th>Цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const ed = editing[s.id]
              const effectiveSection = ed ? ed.section : inferSection(s)
              const sectionLabel = SECTIONS.find(x => x.value === effectiveSection)?.label || '—'
              const isAuto = !s.section
              return (
                <tr key={s.id}>
                  <td>
                    {ed
                      ? <SectionSelect value={ed.section} onChange={v => setField(s.id, 'section', v)} className="adm-field" />
                      : <span className="adm-cat" title={isAuto ? 'Определено автоматически по названию' : 'Задан вручную'}>{sectionLabel}{isAuto && <span style={{ color: '#555', fontSize: 10, marginLeft: 4 }}>авто</span>}</span>}
                  </td>
                  <td>
                    {ed
                      ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <input
                            className="adm-field"
                            value={ed.name}
                            onChange={e => setField(s.id, 'name', e.target.value)}
                            placeholder="Название"
                            style={{ minWidth: 180 }}
                          />
                          <label style={{ fontSize: 11, color: '#666' }}>Фото (оставь пустым — авто)</label>
                          <PhotoField preview={ed.image_auto} value={ed.image_url} onChange={v => setField(s.id, 'image_url', v)} />
                        </div>
                      )
                      : s.name}
                  </td>
                  <td>
                    {ed
                      ? (
                        <input
                          className="adm-field"
                          value={ed.duration}
                          onChange={e => setField(s.id, 'duration', e.target.value)}
                          onBlur={e => setField(s.id, 'duration', fmtDuration(e.target.value))}
                          style={{ width: 110 }}
                          placeholder="60 мин"
                        />
                      )
                      : s.duration}
                  </td>
                  <td>
                    {ed
                      ? (
                        <input
                          className="adm-field"
                          value={ed.price}
                          onChange={e => setField(s.id, 'price', e.target.value)}
                          onBlur={e => setField(s.id, 'price', fmtPrice(e.target.value))}
                          style={{ width: 140 }}
                          placeholder="22 000 тг."
                        />
                      )
                      : <b style={{ color: '#c9a96e' }}>{s.price}</b>}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {ed ? (
                      <>
                        <button className="adm-btn adm-btn--gold" disabled={saving === s.id} onClick={() => saveEdit(s.id)} style={{ marginRight: 6 }}>{saving === s.id ? '...' : 'Сохранить'}</button>
                        <button className="adm-btn adm-btn--ghost" onClick={() => cancelEdit(s.id)}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button className="adm-btn adm-btn--ghost" onClick={() => startEdit(s)} style={{ marginRight: 6 }}>Изменить</button>
                        <button className="adm-btn adm-btn--danger" onClick={() => deleteService(s.id)}>✕</button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="adm-empty">Ничего не найдено</div>}
      </div>
      <Toast toast={toast} />
    </>
  )
}
