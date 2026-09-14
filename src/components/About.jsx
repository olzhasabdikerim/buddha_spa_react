import { useT } from '../i18n.jsx'
import { useBranches } from '../contexts/BranchesContext.jsx'
import { EditableText } from './EditableText.jsx'


const ABOUT_IMAGE = '/images/about-interior.jpg'

// "О бренде" — compact brand intro placed right after the branch selector.
// Photo + short story + headline stats + a link through to the full About page.
export default function About() {
  const t = useT()
  const branches = useBranches()
  const masters = (branches || []).reduce((n, b) => n + (b.team?.length || 0), 0)

  const statsRaw = [
    ['4', t('города Казахстана'), 'about.stat.0'],
    ['6+', t('лет на рынке'), 'about.stat.1'],
    ['80 000+', t('клиентов в сети'), 'about.stat.2'],
    [`${masters}`, t('мастера из Юго-Восточной Азии'), 'about.stat.3'],
  ]

  return (
    <section id="about" className="brandintro">
      <div className="wrap brandintro__grid">
        <figure className="brandintro__media">
          <img src={ABOUT_IMAGE} alt="Интерьер зоны отдыха BuddhaSpa" loading="lazy" />
        </figure>

        <div className="brandintro__text">
          <EditableText as="p" contentKey="about.eyebrow" fallback={t('О нас')} className="eyebrow section-label" />
          <EditableText as="h2" contentKey="about.title" fallback={t('Забота, которая стала сетью спа-салонов')} className="section-title" />
          <EditableText as="p" contentKey="about.lead" fallback={t('BuddhaSpa начинался с одного салона и желания подарить казахстанцам подлинную тайскую традицию заботы о теле. Сегодня это развивающаяся сеть с едиными стандартами сервиса и мастерами из Юго-Восточной Азии в каждом городе.')} className="brandintro__lead" />

          <div className="brandintro__stats">
            {statsRaw.map(([n, l, key]) => (
              <div className="brandintro__stat" key={key}>
                <EditableText as="div" contentKey={`${key}.n`} fallback={n} className="brandintro__num" />
                <EditableText as="div" contentKey={`${key}.l`} fallback={l} className="brandintro__lbl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
