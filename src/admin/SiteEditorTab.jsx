import { useRef, useState } from 'react'

const PAGES = [
  { label: 'Главная', path: '/' },
  { label: 'Нурсат (Шымкент)', path: '/nursat' },
  { label: 'Тулпар (Шымкент)', path: '/tulpar' },
  { label: 'Иляева (Шымкент)', path: '/kunaeva' },
  { label: 'Таукехан (Шымкент)', path: '/taukehana' },
  { label: 'Тараз', path: '/taraz' },
  { label: 'Астана (Туран)', path: '/turan' },
  { label: 'Актобе', path: '/aktobe' },
  { label: 'О нас', path: '/about' },
  { label: 'Франшиза', path: '/franchise' },
]

const DEFAULT_PATH = '/nursat'

export default function SiteEditorTab() {
  const iframeRef = useRef(null)
  const [currentPath, setCurrentPath] = useState(DEFAULT_PATH)
  const [iframeLoading, setIframeLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const origin = window.location.origin

  const sendEditMode = (value) => {
    iframeRef.current?.contentWindow?.postMessage({ type: 'SET_EDIT_MODE', value }, origin)
  }

  const toggleEditMode = () => {
    const next = !editMode
    setEditMode(next)
    sendEditMode(next)
  }

  // Re-send edit mode state after iframe reloads
  const handleLoad = () => {
    setIframeLoading(false)
    if (editMode) {
      // Small delay to let React context initialise in the iframe
      setTimeout(() => sendEditMode(true), 300)
    }
  }

  const navigate = (path) => {
    setCurrentPath(path)
    setIframeLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = `${origin}${path}`
    }
  }

  const reload = () => {
    setIframeLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = `${origin}${currentPath}`
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        background: '#111',
        borderBottom: '1px solid #222',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <button onClick={reload} title="Обновить" style={navBtnStyle}>↺</button>

        {/* Edit mode toggle */}
        <button
          onClick={toggleEditMode}
          title={editMode ? 'Выключить редактирование' : 'Включить редактирование'}
          style={{
            ...navBtnStyle,
            background: editMode ? '#c9a96e' : '#1e1e1e',
            color: editMode ? '#000' : '#888',
            border: `1px solid ${editMode ? '#c9a96e' : '#2a2a2a'}`,
            fontWeight: 600,
            fontSize: 14,
            gap: 6,
            display: 'flex',
            alignItems: 'center',
            padding: '5px 12px',
          }}
        >
          ✏️ {editMode ? 'Редактирование ВКЛ' : 'Редактирование'}
        </button>

        <div style={{ width: 1, height: 24, background: '#2a2a2a', flexShrink: 0 }} />

        {/* Page navigation */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flex: 1 }}>
          {PAGES.map(p => (
            <button
              key={p.path}
              onClick={() => navigate(p.path)}
              style={{
                ...pageBtnStyle,
                background: currentPath === p.path ? '#c9a96e' : '#1e1e1e',
                color: currentPath === p.path ? '#000' : '#888',
                border: `1px solid ${currentPath === p.path ? '#c9a96e' : '#2a2a2a'}`,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {editMode && (
          <div style={{ fontSize: 11, color: '#c9a96e', whiteSpace: 'nowrap', opacity: 0.8, flexShrink: 0 }}>
            Кликай на тексты с рамкой чтобы изменить
          </div>
        )}
      </div>

      {/* Iframe */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {iframeLoading && (
          <div style={{
            position: 'absolute', inset: 0, background: '#0d0d0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#555', fontSize: 14, zIndex: 2,
          }}>
            Загрузка…
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`${origin}${DEFAULT_PATH}`}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          title="Редактор сайта"
          onLoad={handleLoad}
        />
      </div>
    </div>
  )
}

const navBtnStyle = {
  background: '#1e1e1e',
  border: '1px solid #2a2a2a',
  color: '#888',
  padding: '5px 10px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 1,
  flexShrink: 0,
}

const pageBtnStyle = {
  padding: '4px 10px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 500,
  transition: 'all 0.15s',
}
