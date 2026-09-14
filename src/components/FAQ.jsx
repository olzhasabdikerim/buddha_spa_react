import { useState } from 'react'
import { useT } from '../i18n.jsx'
import { FAQ_ITEMS } from '../data/faq.js'
import { useBooking } from '../booking.jsx'
import { EditableText } from './EditableText.jsx'
import { useContentContext } from '../contexts/ContentContext.jsx'
import { useEditMode } from '../contexts/EditModeContext.jsx'

export default function FAQ() {
  const t = useT()
  const openBooking = useBooking()
  const [open, setOpen] = useState(-1)
  const { content, update } = useContentContext()
  const { isEditMode } = useEditMode()

  const totalCount = parseInt(content['faq.count'] || String(FAQ_ITEMS.length), 10)
  const indices = Array.from({ length: totalCount }, (_, i) => i)
    .filter((i) => content[`faq.item.${i}.deleted`] !== '1')

  const addItem = async () => {
    await update('faq.count', String(totalCount + 1))
  }

  const deleteItem = async (i) => {
    await update(`faq.item.${i}.deleted`, '1')
    setOpen(-1)
  }

  return (
    <section id="faq" className="faq">
      <div className="wrap faq__wrap">
        <aside className="faq__aside">
          <p className="eyebrow">FAQ</p>
          <EditableText as="h2" contentKey="faq.title" fallback={t('Часто задаваемые вопросы')} className="faq__title serif" />
          <EditableText as="p" contentKey="faq.subtitle" fallback={t('Собрали ответы на самые популярные вопросы. Не нашли нужный — напишите нам, и мы поможем.')} className="faq__sub" />
          <button type="button" className="btn btn-gold faq__cta" onClick={openBooking}>
            {t('Записаться')}
          </button>
        </aside>

        <div className="faq__list">
          {indices.map((i, renderIdx) => {
            const isOpen = open === i || isEditMode
            return (
              <div
                className={`faq__item ${isOpen ? 'is-open' : ''}`}
                key={i}
                style={{ position: 'relative' }}
              >
                {isEditMode && (
                  <button
                    onClick={() => deleteItem(i)}
                    style={{
                      position: 'absolute', top: 10, right: 10, background: '#8b0000',
                      color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer',
                      fontSize: 11, padding: '2px 8px', zIndex: 10,
                    }}
                  >
                    − Удалить
                  </button>
                )}
                <button
                  type="button"
                  className="faq__trigger"
                  aria-expanded={isOpen}
                  onClick={isEditMode ? undefined : () => setOpen(isOpen ? -1 : i)}
                >
                  <span className="faq__num">{String(renderIdx + 1).padStart(2, '0')}</span>
                  <EditableText
                    as="span"
                    contentKey={`faq.item.${i}.q`}
                    fallback={FAQ_ITEMS[i]?.q || `Вопрос ${i + 1}`}
                    className="faq__q"
                  />
                  {!isEditMode && <span className="faq__icon" aria-hidden="true" />}
                </button>
                <div className="faq__panel">
                  <div className="faq__panel-inner">
                    <EditableText
                      as="p"
                      contentKey={`faq.item.${i}.a`}
                      fallback={FAQ_ITEMS[i]?.a || ''}
                    />
                    {FAQ_ITEMS[i]?.cta && !isEditMode && (
                      <a
                        className="faq__answer-cta"
                        href={FAQ_ITEMS[i].cta.href}
                        {...(/^https?:/i.test(FAQ_ITEMS[i].cta.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {t(FAQ_ITEMS[i].cta.label)} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {isEditMode && (
            <button
              onClick={addItem}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                background: 'rgba(201,169,110,0.08)', border: '2px dashed #c9a96e',
                borderRadius: 8, padding: '12px 20px', color: '#c9a96e',
                cursor: 'pointer', fontSize: 14, marginTop: 8,
              }}
            >
              + Добавить вопрос
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
