import { useEffect, useState } from 'react'
import './admin.css'
import { useAuth } from './useAuth.js'
import Login from './Login.jsx'
import ServicesTab from './ServicesTab.jsx'
import MastersTab from './MastersTab.jsx'
import BranchTab from './BranchTab.jsx'
import SiteEditorTab from './SiteEditorTab.jsx'
import { supabase } from '../lib/supabase.js'

export default function AdminApp() {
  const { session, loading, signIn, signOut } = useAuth()
  const [branches, setBranches] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('services')

  useEffect(() => {
    if (!session) return
    supabase.from('branches').select('id,slug,city,name,premium,coming_soon').order('sort_order')
      .then(({ data }) => {
        setBranches(data || [])
        if (data?.length && !selectedId) setSelectedId(data[0].id)
      })
  }, [session])

  if (loading) return <div className="adm-login"><div style={{ color: '#666' }}>Загрузка...</div></div>
  if (!session) return <Login onSignIn={signIn} />

  const branch = branches.find(b => b.id === selectedId)

  return (
    <div className="adm">
      {/* Sidebar */}
      <aside className="adm-side">
        <div className="adm-side__logo">
          BuddhaSpa
          <span>Панель управления</span>
        </div>
        <ul className="adm-nav">
          <li><a href="#" className={tab === 'editor' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('editor') }}>🌐 Редактор сайта</a></li>
          <li><a href="#" className={tab === 'services' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('services') }}>💆 Услуги и цены</a></li>
          <li><a href="#" className={tab === 'masters' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('masters') }}>👤 Мастера</a></li>
          <li><a href="#" className={tab === 'branch' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('branch') }}>🏢 Информация</a></li>
        </ul>
        <div className="adm-side__bottom">
          <div style={{ fontSize: 11, color: '#555', marginBottom: 8 }}>{session.user.email}</div>
          <button className="adm-logout" onClick={signOut}>Выйти</button>
        </div>
      </aside>

      {/* Main */}
      <div className="adm-main">
        <div className="adm-topbar">
          <h1>
            {tab === 'editor'   && 'Редактор сайта'}
            {tab === 'services' && 'Услуги и цены'}
            {tab === 'masters'  && 'Мастера'}
            {tab === 'branch'   && 'Информация о филиале'}
          </h1>
          {tab !== 'editor' && (
            <select
              className="adm-branch-sel"
              value={selectedId || ''}
              onChange={e => setSelectedId(Number(e.target.value))}
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.city} — {b.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={`adm-content${tab === 'editor' ? ' adm-content--editor' : ''}`}>
          {tab === 'editor' && <SiteEditorTab />}
          {selectedId && tab === 'services' && <ServicesTab branchId={selectedId} key={selectedId} />}
          {selectedId && tab === 'masters'  && <MastersTab  branchId={selectedId} key={selectedId} />}
          {selectedId && tab === 'branch'   && branch && (
            <BranchTab
              branch={branch}
              onUpdate={updated => setBranches(prev => prev.map(b => b.id === updated.id ? updated : b))}
              key={selectedId}
            />
          )}
        </div>
      </div>
    </div>
  )
}
