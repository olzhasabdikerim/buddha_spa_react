import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { Toast, useToast } from './Toast.jsx'

export default function MastersTab({ branchId }) {
  const [masters, setMasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState({})
  const [saving, setSaving] = useState(null)
  const [newName, setNewName] = useState('')
  const { toast, show } = useToast()

  useEffect(() => {
    if (!branchId) return
    setLoading(true)
    supabase.from('masters').select('*').eq('branch_id', branchId).order('id')
      .then(({ data }) => { setMasters(data || []); setLoading(false) })
  }, [branchId])

  const saveEdit = async (id) => {
    setSaving(id)
    const patch = editing[id]
    const { error } = await supabase.from('masters').update(patch).eq('id', id)
    if (error) show('Ошибка', 'err')
    else {
      setMasters(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
      setEditing(prev => { const n = { ...prev }; delete n[id]; return n })
      show('Сохранено ✓')
    }
    setSaving(null)
  }

  const addMaster = async () => {
    if (!newName.trim()) return
    const { data, error } = await supabase.from('masters').insert({ branch_id: branchId, name: newName.trim(), photo: '' }).select().single()
    if (error) show('Ошибка', 'err')
    else { setMasters(prev => [...prev, data]); setNewName(''); show('Мастер добавлен ✓') }
  }

  const deleteMaster = async (id) => {
    if (!confirm('Удалить мастера?')) return
    const { error } = await supabase.from('masters').delete().eq('id', id)
    if (error) show('Ошибка', 'err')
    else { setMasters(prev => prev.filter(m => m.id !== id)); show('Удалено') }
  }

  if (loading) return <div className="adm-empty">Загрузка...</div>

  return (
    <>
      <div className="adm-table-wrap" style={{ marginBottom: 24 }}>
        <table className="adm-table">
          <thead>
            <tr><th>Имя мастера</th><th>Фото (URL)</th><th></th></tr>
          </thead>
          <tbody>
            {masters.map(m => {
              const ed = editing[m.id]
              return (
                <tr key={m.id}>
                  <td>
                    {ed
                      ? <input className="adm-field" value={ed.name} onChange={e => setEditing(p => ({ ...p, [m.id]: { ...p[m.id], name: e.target.value } }))} />
                      : m.name}
                  </td>
                  <td>
                    {ed
                      ? <input className="adm-field" value={ed.photo} placeholder="/images/..." onChange={e => setEditing(p => ({ ...p, [m.id]: { ...p[m.id], photo: e.target.value } }))} />
                      : <span style={{ color: '#666', fontSize: 12 }}>{m.photo || '—'}</span>}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {ed ? (
                      <>
                        <button className="adm-btn adm-btn--gold" disabled={saving === m.id} onClick={() => saveEdit(m.id)} style={{ marginRight: 6 }}>{saving === m.id ? '...' : 'Сохранить'}</button>
                        <button className="adm-btn adm-btn--ghost" onClick={() => setEditing(p => { const n={...p}; delete n[m.id]; return n })}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button className="adm-btn adm-btn--ghost" onClick={() => setEditing(p => ({ ...p, [m.id]: { name: m.name, photo: m.photo || '' } }))} style={{ marginRight: 6 }}>Изменить</button>
                        <button className="adm-btn adm-btn--danger" onClick={() => deleteMaster(m.id)}>Удалить</button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
            {masters.length === 0 && (
              <tr><td colSpan={3} className="adm-empty">Мастеров нет</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input className="adm-search" placeholder="Имя нового мастера" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMaster()} />
        <button className="adm-btn adm-btn--gold" onClick={addMaster}>+ Добавить</button>
      </div>
      <Toast toast={toast} />
    </>
  )
}
