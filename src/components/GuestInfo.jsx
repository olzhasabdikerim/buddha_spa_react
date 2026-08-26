import { useState } from 'react'
import { useT } from '../i18n.jsx'
import { GUEST_INFO as ITEMS } from '../data/company.js'

export default function GuestInfo() {
  const t = useT()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="guest-info" className="guest-info">
      <div className="wrap">
        <p className="eyebrow section-label">{t('Информация для наших гостей')}</p>
        <h2 className="section-title">{t('Перед визитом в Buddha Spa')}</h2>

        <div className="accordion">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={item.title}>
                <button
                  type="button"
                  className="accordion__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span>{t(item.title)}</span>
                  <span className="accordion__icon" aria-hidden="true" />
                </button>
                <div className="accordion__panel">
                  <div className="accordion__panel-inner">
                    {item.body.map((p) => (
                      <p key={p}>{t(p)}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
