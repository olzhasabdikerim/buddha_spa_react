import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import { FAQ_ITEMS } from '../data/faq.js'
import { handleHashNav } from '../lib/hashNav.js'

// Homepage FAQ — a two-column block: a sticky intro aside on the left and a
// numbered accordion of question cards on the right (one open at a time).
export default function FAQ() {
  const t = useT()
  const [open, setOpen] = useState(-1)

  return (
    <section id="faq" className="faq">
      <div className="wrap faq__wrap">
        <aside className="faq__aside">
          <p className="eyebrow">FAQ</p>
          <h2 className="faq__title serif">{t('Часто задаваемые вопросы')}</h2>
          <p className="faq__sub">
            {t('Собрали ответы на самые популярные вопросы. Не нашли нужный — напишите нам, и мы поможем.')}
          </p>
          <Link
            to="/#branches"
            className="btn btn-gold faq__cta"
            onClick={(e) => handleHashNav(e, '/#branches')}
          >
            {t('Записаться')}
          </Link>
        </aside>

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
                  <span className="faq__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="faq__q">{t(item.q)}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div className="faq__panel">
                  <div className="faq__panel-inner">
                    <p>{t(item.a)}</p>
                    {item.cta && (
                      <a
                        className="faq__answer-cta"
                        href={item.cta.href}
                        {...(/^https?:/i.test(item.cta.href)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {t(item.cta.label)} <span aria-hidden="true">→</span>
                      </a>
                    )}
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
