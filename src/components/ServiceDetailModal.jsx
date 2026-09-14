import { useEffect, useState } from 'react'
import { useT } from '../i18n.jsx'
import { useEditMode } from '../contexts/EditModeContext.jsx'
import { useContentContext } from '../contexts/ContentContext.jsx'
import { useLang } from '../i18n.jsx'
import { EditableServiceField } from './EditableServiceField.jsx'
import { EditorModal } from './EditableText.jsx'

// "Подробнее" detail view for a single service. In edit mode admins can update
// the service name, description/composition, and per-variant prices directly here.
export default function ServiceDetailModal({ service, onClose, onBook }) {
  const t = useT()
  const { lang } = useLang()
  const { isEditMode } = useEditMode()
  const { content, update } = useContentContext()

  const [desc, setDesc] = useState(service?.description || '')
  useEffect(() => { setDesc(service?.description || '') }, [service])

  // Multilingual description editing state
  const [editingDesc, setEditingDesc] = useState(false)
  const [descDrafts, setDescDrafts] = useState({ ru: '', kk: '', en: '' })
  const [descSaving, setDescSaving] = useState(false)

  const descBaseKey = service ? `svc.desc.${service.id}` : null
  const descKkKey = descBaseKey ? `${descBaseKey}.kk` : null
  const descEnKey = descBaseKey ? `${descBaseKey}.en` : null

  // Get localised composition override from content
  const getLocalDesc = () => {
    if (!service) return ''
    if (lang === 'kk' && descKkKey && content[descKkKey]) return content[descKkKey]
    if (lang === 'en' && descEnKey && content[descEnKey]) return content[descEnKey]
    if (descBaseKey && content[descBaseKey]) return content[descBaseKey]
    return service.description || service.composition.join('; ')
  }

  const openDescEdit = () => {
    setDescDrafts({
      ru: (descBaseKey && content[descBaseKey]) || service?.description || service?.composition.join('; ') || '',
      kk: (descKkKey && content[descKkKey]) || '',
      en: (descEnKey && content[descEnKey]) || '',
    })
    setEditingDesc(true)
  }
  const saveDesc = async () => {
    setDescSaving(true)
    if (descDrafts.ru.trim()) await update(descBaseKey, descDrafts.ru.trim())
    if (descDrafts.kk.trim()) await update(descKkKey, descDrafts.kk.trim())
    if (descDrafts.en.trim()) await update(descEnKey, descDrafts.en.trim())
    setDescSaving(false)
    setEditingDesc(false)
  }

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!service) return null

  return (
    <div className="svc-modal" role="dialog" aria-modal="true" aria-label={t(service.name)}>
      <div className="svc-modal__backdrop" onClick={onClose} />
      <div className="svc-modal__panel">
        <button type="button" className="svc-modal__close" aria-label={t('Закрыть')} onClick={onClose}>
          ×
        </button>

        <div
          className="svc-modal__photo"
          style={{ backgroundImage: `url(${service.image})` }}
        >
          {service.premium && <span className="svc-modal__badge">Premium</span>}
        </div>

        <div className="svc-modal__body">
          {/* Name */}
          <EditableServiceField
            as="h2" className="svc-modal__title serif"
            branchId={service.branchId} serviceName={service.name} field="name"
            value={service.name}
          />

          {/* Description (plain blurb — shown when no composition) */}
          {service.description && service.composition.length === 0 && !isEditMode && (
            <p className="svc-modal__desc">{t(service.description)}</p>
          )}

          {/* Prices */}
          <div className="svc-modal__prices">
            <p className="svc-modal__lbl">{t('Длительность и стоимость')}</p>
            <ul>
              {service.variants.map((v, i) => (
                <li key={i}>
                  <span>{v.duration || t('Сеанс')}</span>
                  {isEditMode ? (
                    <EditableServiceField
                      as="b"
                      serviceId={v.id} branchId={service.branchId} serviceName={service.name}
                      field="price" value={v.rawPrice}
                    />
                  ) : (
                    <b>{v.from ? t('от') + ' ' : ''}{v.price}</b>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Composition — "что входит" — uses content override if available */}
          {(service.composition.length > 0 || (descBaseKey && content[descBaseKey])) && (
            <div className="svc-modal__incl">
              <p className="svc-modal__lbl">{t('Что входит')}</p>
              <ul>
                {(getLocalDesc() || service.composition.join('; ')).split(';').map((c, i) => c.trim() ? (
                  <li key={i}><span>◇</span>{c.trim()}</li>
                ) : null)}
              </ul>
            </div>
          )}

          {/* Edit description/composition with multilingual support */}
          {isEditMode && (
            <div style={{ marginTop: 20 }}>
              <button
                onClick={openDescEdit}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,169,110,0.08)', border: '1px dashed rgba(201,169,110,0.4)', borderRadius: 8, padding: '10px 16px', color: '#c9a96e', cursor: 'pointer', fontSize: 13, fontWeight: 600, width: '100%' }}
              >
                ✏️ {t('Редактировать состав «Что входит»')}
              </button>
            </div>
          )}

          {/* Multilingual description modal */}
          {editingDesc && (
            <EditorModal title="Состав «Что входит»" onSave={saveDesc} onCancel={() => setEditingDesc(false)} saving={descSaving} hint="Разделяйте пункты символом ; для отображения списком">
              {[['ru', '🇷🇺 Русский'], ['kk', '🇰🇿 Қазақша'], ['en', '🇬🇧 English']].map(([lg, lbl]) => (
                <div key={lg} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 6, fontWeight: 700 }}>{lbl}</div>
                  <textarea
                    value={descDrafts[lg]}
                    onChange={(e) => setDescDrafts((d) => ({ ...d, [lg]: e.target.value }))}
                    rows={5}
                    placeholder={lg === 'ru' ? 'Пункты через ; например: Тайский массаж 60 мин; Ароматерапия; Чай' : ''}
                    style={{ display: 'block', width: '100%', background: '#0f0d0b', color: '#eee', border: '1px solid #2e2c28', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
            </EditorModal>
          )}

          <div className="svc-modal__actions">
            {!isEditMode && (
              <button className="btn btn-gold" onClick={() => onBook(service)}>
                {t('Записаться')}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              {t('Закрыть')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
