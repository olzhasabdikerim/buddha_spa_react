import { useState } from 'react'
import { useT } from '../i18n.jsx'
import { FAQ_ITEMS } from '../data/faq.js'

// Homepage FAQ — replaces the old "Гостям" block. Big "FAQ" heading + a
// minimalist accordion (one open at a time, closed by default).
export default function FAQ() {
  const t = useT()
  const [open, setOpen] = useState(-1)

  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <div className="faq__head">
          <h2 className="faq__title serif">FAQ</h2>
          <p className="faq__sub">{t('Часто задаваемые вопросы')}</p>
        </div>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                <button
                  type="button"
                  className="faq__trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{t(item.q)}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div className="faq__panel">
                  <div className="faq__panel-inner">
                    <p>{t(item.a)}</p>
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
