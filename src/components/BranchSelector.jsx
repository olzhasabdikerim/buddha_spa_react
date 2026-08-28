import { Link } from 'react-router-dom'
import { BRANCHES } from '../data/branches.js'
import { useT } from '../i18n.jsx'

export default function BranchSelector() {
  const t = useT()
  return (
    <section id="branches" className="branch-select">
      <div className="wrap">
        <p className="eyebrow section-label">{t('Наши адреса')}</p>
        <h2 className="section-title">{t('Выберите удобный для вас филиал')}</h2>
        <p className="section-intro">
          {t('Сеть спа-салонов в городах Казахстана — в каждом та же тайская забота, приветливые мастера и спокойная атмосфера.')}
        </p>

        <div className="branch-select__grid">
          {BRANCHES.map((b) => (
            <Link to={`/${b.slug}`} className={`branch-card ${b.premium ? 'branch-card--premium' : 'branch-card--silver'}`} key={b.slug}>
              <div
                className="branch-card__image"
                style={{ backgroundImage: `url(/images/overview/${b.overview || b.slug}.jpg)` }}
              />
              <div className="branch-card__body">
                <span className="branch-card__city">
                  {t(b.city)}
                  {b.premium && <span className="branch-card__tier">Premium</span>}
                </span>
                <h3>{b.name || b.address}</h3>
                <p>{t(b.hours)}</p>
                <span className="branch-card__link">
                  {t('Перейти')} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
