import { useEffect, useRef } from 'react'
import { useT } from '../i18n.jsx'
import { EditableText } from './EditableText.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Тёплая встреча',
    text: 'Вас встретят приветливые сотрудники, которые предложат лучшие спа-процедуры на выбор, а также чай или воду.',
    img: '/images/journey/masters.jpg',
  },
  {
    n: '02',
    title: 'Чай и настрой',
    text: 'Вы устроитесь в уютной чайной зоне, выдохнете и настроитесь на отдых перед процедурой.',
    img: '/images/journey/tea.jpg?v=2',
  },
  {
    n: '03',
    title: 'Мастера своего дела',
    text: 'Вы познакомитесь с опытными массажистами, годами оттачивавшими искусство тайского массажа.',
    img: '/images/journey/ritual.jpg',
  },
  {
    n: '04',
    title: 'Ритуал заботы',
    text: 'Мастера проведут выбранную программу — прогрев, массаж и уход по тайским традициям.',
    img: '/images/journey/care.jpg',
  },
  {
    n: '05',
    title: 'Заряд энергии',
    text: 'Вы почувствуете бодрость и лёгкость — мастера применяют уникальную, проверенную технику.',
    img: '/images/journey/energy.jpg',
    pos: 'center 80%',
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
        <EditableText as="p" contentKey="journey.eyebrow" fallback={t('Почему Buddha Spa — лучшая идея')} className="eyebrow section-label" />
        <EditableText as="h2" contentKey="journey.title" fallback={t('Как проходит ваш визит')} className="section-title" />

        <ol className="journey__track" ref={trackRef}>
          <span className="journey__spine" aria-hidden="true" />
          {STEPS.map((s) => (
            <li className="journey__step" key={s.n}>
              <div className="journey__node" aria-hidden="true">
                <span className="journey__num">{s.n}</span>
              </div>
              <div className="journey__card">
                {s.img && <div className="journey__photo" style={{ backgroundImage: `url(${s.img})`, backgroundPosition: s.pos || 'center' }} aria-hidden="true" />}
                <div className="journey__card-body">
                  <EditableText as="h3" contentKey={`journey.step${s.n}.title`} fallback={t(s.title)} />
                  <EditableText as="p" contentKey={`journey.step${s.n}.text`} fallback={t(s.text)} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
