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
          {BRANCHES.map((b) => {
            const soon = b.comingSoon || b.needsData
            const cls = soon ? 'branch-card--soon' : b.premium ? 'branch-card--premium' : 'branch-card--silver'
            return (
              <Link to={`/${b.slug}`} className={`branch-card ${cls}`} key={b.slug}>
                <div
                  className="branch-card__image"
                  style={soon ? undefined : { backgroundImage: `url(/images/overview/${b.overview || b.slug}.jpg)` }}
                >
                  {soon ? (
                    <span className="branch-card__soon-badge">{t('Скоро откроется')}</span>
                  ) : (
                    b.premium && <span className="branch-card__premium-tag">Premium</span>
                  )}
                </div>
                <div className="branch-card__body">
                  <span className="branch-card__city">{t(b.city)}</span>
                  <h3>{b.name || b.address}</h3>
                  <p>{soon ? t('Открытие совсем скоро') : t(b.hours)}</p>
                  <span className="branch-card__link">
                    {soon ? t('Скоро') : t('Перейти')} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
