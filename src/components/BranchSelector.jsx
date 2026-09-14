import { Link } from 'react-router-dom'
import { useBranches } from '../contexts/BranchesContext.jsx'
import { useT } from '../i18n.jsx'
import { EditableText } from './EditableText.jsx'

// Real per-branch interior photos supplied by the owner (one per branch).
const CARD_IMG = {
  nursat: '/images/branches/cards/nursat.jpg',        // ресепшн
  taukehana: '/images/branches/cards/taukehana.jpg',  // статуэтка Будды
  kunaeva: '/images/branches/cards/kunaeva.jpg',      // серое лицо Будды (Иляева)
  tulpar: '/images/branches/cards/tulpar.jpg?v=3',    // Будда со свечами у колонны
  turan: '/images/branches/cards/turan.jpg',          // чёрная голова Будды (Астана)
  taraz: '/images/branches/cards/taraz.jpg',          // лаунж-зона
  aktobe: '/images/branches/interior-warm.jpg',       // «Скоро» — интерьер под затемнением
}

export default function BranchSelector() {
  const t = useT()
  const branches = useBranches()
  return (
    <section id="branches" className="branch-select">
      <div className="wrap">
        <EditableText as="p" contentKey="branches.eyebrow" fallback={t('Наши адреса')} className="eyebrow section-label" />
        <EditableText as="h2" contentKey="branches.title" fallback={t('Выберите удобный для вас филиал')} className="section-title" />
        <EditableText as="p" contentKey="branches.subtitle" fallback={t('Сеть SPA-салонов, где тайская атмосфера и мастерство превращают массаж в полноценный отдых и восстановление.')} className="section-intro" />

        <div className="branch-select__grid">
          {(branches || []).map((b) => {
            const soon = b.comingSoon
            const cls = soon ? 'branch-card--soon' : b.premium ? 'branch-card--premium' : 'branch-card--silver'
            return (
              <Link to={`/${b.slug}`} className={`branch-card ${cls}`} key={b.slug}>
                <div
                  className="branch-card__image"
                  style={{ backgroundImage: `url(${CARD_IMG[b.slug] || `/images/overview/${b.overview || b.slug}.jpg`})` }}
                >
                  {soon ? (
                    <span className="branch-card__soon-badge">{t('Скоро откроется')}</span>
                  ) : (
                    b.premium && <span className="branch-card__premium-tag">Premium</span>
                  )}
                </div>
                <div className="branch-card__body">
                  <span className="branch-card__city">{t(b.city)}</span>
                  <h3>{b.name ? t(b.name) : b.address}</h3>
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
