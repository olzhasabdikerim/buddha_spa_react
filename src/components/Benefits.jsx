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
  return (
    <section className="benefits">
      <div className="wrap">
        <p className="eyebrow section-label">{t('Почему Buddha Spa — лучшая идея')}</p>
        <h2 className="section-title">{t('Три момента вашего визита')}</h2>
        <div className="benefits__grid">
          {STEPS.map((s) => (
            <div className="benefit-card" key={s.n}>
              <span className="benefit-card__n">{s.n}</span>
              <h3>{t(s.title)}</h3>
              <p>{t(s.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
