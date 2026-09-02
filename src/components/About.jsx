import { useT } from '../i18n.jsx'
import { BRANCHES } from '../data/branches.js'

const ABOUT_IMAGE = '/images/about-interior.jpg'

// "О бренде" — compact brand intro placed right after the branch selector.
// Photo + short story + headline stats + a link through to the full About page.
export default function About() {
  const t = useT()
  const masters = BRANCHES.reduce((n, b) => n + (b.team?.length || 0), 0)

  const stats = [
    ['4', 'города Казахстана'],
    ['6+', 'лет на рынке'],
    ['80 000+', 'клиентов в сети'],
    [`${masters}`, 'мастера из Таиланда и Индонезии'],
  ]

  return (
    <section id="about" className="brandintro">
      <div className="wrap brandintro__grid">
        <figure className="brandintro__media">
          <img src={ABOUT_IMAGE} alt="Интерьер зоны отдыха BuddhaSpa" loading="lazy" />
        </figure>

        <div className="brandintro__text">
          <p className="eyebrow section-label">{t('О нас')}</p>
          <h2 className="section-title">{t('Забота, которая стала сетью спа-салонов')}</h2>
          <p className="brandintro__lead">
            {t('BuddhaSpa начинался с одного салона и желания подарить казахстанцам подлинную тайскую традицию заботы о теле. Сегодня это развивающаяся сеть с едиными стандартами сервиса и мастерами из Юго-Восточной Азии в каждом городе.')}
          </p>

          <div className="brandintro__stats">
            {stats.map(([n, l]) => (
              <div className="brandintro__stat" key={l}>
                <div className="brandintro__num">{n}</div>
                <div className="brandintro__lbl">{t(l)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
