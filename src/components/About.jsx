import { useT } from '../i18n.jsx'

const ABOUT_IMAGE = '/images/branches/kunaeva/gallery-1.jpg'

export default function About() {
  const t = useT()
  return (
    <section id="about" className="about">
      <div className="wrap about__grid">
        <div className="about__text">
          <p className="eyebrow section-label">{t('Роскошь для души и тела')}</p>
          <h2 className="section-title">
            {t('Большой спа-салон тайского массажа и ухода за собой')}
          </h2>
          <p>{t('Buddha Spa объединяет оздоровительные массажи, программы для релаксации, спа-ритуалы для похудения и пилинги для тонуса кожи — услуги на любой вкус в одном месте.')}</p>
          <p>{t('Вас встретят приветливые сотрудники и предложат чай или воду. Вы познакомитесь с опытными массажистами — мастерами своего дела — и почувствуете заряд энергии благодаря их уникальной технике.')}</p>
          <a href="#branches" className="btn btn-line-dark">
            {t('Выбрать филиал')}
          </a>
        </div>
        <div className="about__frame">
          <img src={ABOUT_IMAGE} alt="Интерьер спа-салона Buddha Spa" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
