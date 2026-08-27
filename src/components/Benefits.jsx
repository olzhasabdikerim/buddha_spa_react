import { useEffect, useRef } from 'react'
import { useT } from '../i18n.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Тёплая встреча',
    text: 'Вас встретят приветливые сотрудники, которые предложат лучшие спа-процедуры на выбор, а также чай или воду.',
  },
  {
    n: '02',
    title: 'Мастера своего дела',
    text: 'Вы познакомитесь с опытными массажистами, годами оттачивавшими искусство тайского массажа.',
  },
  {
    n: '03',
    title: 'Заряд энергии',
    text: 'Вы почувствуете бодрость и лёгкость — мастера применяют уникальную, проверенную технику.',
  },
]

export default function Benefits() {
  const t = useT()
  const trackRef = useRef(null)

  // Reveal each step (and grow the connecting path) as it scrolls into view.
  useEffect(() => {
    const root = trackRef.current
    if (!root) return
    const els = [...root.querySelectorAll('.journey__step')]
    const reveal = (el) => el.classList.add('is-in')
    if (!('IntersectionObserver' in window)) { els.forEach(reveal); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal(e.target)),
      { threshold: 0.25 }
    )
    els.forEach((el) => io.observe(el))
    // Safety net: never leave steps invisible if the observer doesn't fire.
    const fallback = setTimeout(() => els.forEach(reveal), 2200)
    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [])

  return (
    <section className="journey">
      <div className="wrap">
        <p className="eyebrow section-label">{t('Почему Buddha Spa — лучшая идея')}</p>
        <h2 className="section-title">{t('Три момента вашего визита')}</h2>

        <ol className="journey__track" ref={trackRef}>
          <span className="journey__spine" aria-hidden="true" />
          {STEPS.map((s) => (
            <li className="journey__step" key={s.n}>
              <div className="journey__node" aria-hidden="true">
                <span className="journey__num">{s.n}</span>
              </div>
              <div className="journey__card">
                <h3>{t(s.title)}</h3>
                <p>{t(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
