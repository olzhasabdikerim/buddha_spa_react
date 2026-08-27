import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'

const HERO = '/images/hero-main.jpg'
const PHIL = '/images/franchise/lp/philosophy.jpg'
const FOUNDER = '/images/franchise/lp/founder.jpg'

// Brand values (item 4).
const VALUES = [
  ['Забота', 'Каждый гость окружён вниманием — от встречи с чаем до последней минуты ритуала.'],
  ['Качество', 'Настоящие тайские техники, выверенные программы и продуманный сервис в каждом салоне.'],
  ['Профессионализм', 'Мастера из Юго-Восточной Азии с многолетним опытом и живой традицией в руках.'],
  ['Атмосфера', 'Пространство тишины и тепла, где время замедляется, а тело отдыхает.'],
  ['Уважение к гостю', 'Ваш комфорт, ваши пожелания и ваше состояние — в центре каждого визита.'],
  ['Восточная философия', 'Забота о теле как забота о внутреннем балансе и присутствии.'],
  ['Постоянное развитие', 'Сеть растёт, а стандарты BuddhaSpa становятся только выше.'],
]

// Real, safe facts only (no invented figures): cities are derived from the
// branch network, "более 6 лет" is existing brand copy.
const TODAY = [
  ['4', 'города Казахстана'],
  ['ЮВА', 'мастера из Юго-Восточной Азии'],
  ['6+', 'лет на рынке'],
  ['SPA', 'тайская традиция и уход'],
]

// Reveal-on-scroll for this page's .rv elements.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.about-page .rv')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function AboutPage() {
  const t = useT()
  useReveal()

  return (
    <div className="br-page about-page">
      {/* HERO */}
      <header className="br-hero about-hero" style={{ backgroundImage: `url(${HERO})` }}>
        <div className="br-hero__grad" />
        <div className="wrap br-hero__inner">
          <Link to="/" className="br-back">← {t('На главную')}</Link>
          <p className="eyebrow br-hero__eyebrow">{t('О бренде')} · BuddhaSpa</p>
          <h1 className="br-hero__title serif">{t('История')} <span className="ital">BuddhaSpa</span></h1>
          <p className="br-hero__sub">
            {t('Сеть тайских SPA-салонов, выросшая из одной простой идеи — дарить настоящую заботу о теле и внутреннем состоянии.')}
          </p>
        </div>
      </header>

      {/* STORY */}
      <section className="sec br-sec" id="story">
        <div className="wrap about-story">
          <p className="eyebrow rv">{t('История')}</p>
          <h2 className="h2 serif rv">{t('С чего начинался BuddhaSpa')}</h2>
          <div className="about-story__cols rv">
            <p>{t('BuddhaSpa начинался с желания создать в Казахстане место, где тайский массаж — это не просто процедура, а целая культура заботы о себе. Первый салон открылся, чтобы подарить гостям подлинную восточную традицию: тепло рук мастеров, тишину и ощущение настоящей перезагрузки.')}</p>
            <p>{t('Постепенно один салон превратился в сеть. Появлялись новые адреса в разных городах, но принцип оставался прежним — в каждом филиале та же тайская забота, приветливые мастера из Юго-Восточной Азии и спокойная атмосфера. Так складывались стандарты BuddhaSpa: качество программ, уровень сервиса и внимание к каждому гостю.')}</p>
            <p>{t('Сегодня BuddhaSpa — это развивающаяся сеть SPA-салонов и живая SPA-культура: команда мастеров, продуманные ритуалы и философия, в которой забота о теле становится заботой о внутреннем состоянии человека.')}</p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="sec br-sec br-bg2" id="philosophy">
        <div className="wrap about-phil">
          <div className="about-phil__media rv" style={{ backgroundImage: `url(${PHIL})` }} />
          <div className="about-phil__text rv">
            <p className="eyebrow">{t('Философия')}</p>
            <h2 className="h2 serif">{t('Роскошь для души и тела')}</h2>
            <p className="lead">
              {t('BuddhaSpa — это не просто массажный салон, а пространство восстановления, тишины, заботы о себе и внутреннего баланса.')}
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="sec br-sec" id="values">
        <div className="wrap">
          <p className="eyebrow rv">{t('Ценности')}</p>
          <h2 className="h2 serif rv">{t('Ценности BuddhaSpa')}</h2>
          <div className="about-values">
            {VALUES.map(([title, text]) => (
              <div className="about-value rv" key={title}>
                <span className="about-value__mark" aria-hidden="true" />
                <h3 className="serif">{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="sec br-sec br-bg2" id="founder">
        <div className="wrap about-founder">
          <div className="about-founder__photo rv" style={{ backgroundImage: `url(${FOUNDER})` }} />
          <div className="about-founder__text rv">
            <p className="eyebrow">{t('Основательница')}</p>
            <h2 className="h2 serif">{t('Арай Жузенова')}</h2>
            <p className="lead">
              {t('С самого начала Арай хотела создать место, где забота о теле становится заботой о внутреннем состоянии человека. BuddhaSpa — это результат её видения: пространство тишины, присутствия и настоящей перезагрузки.')}
            </p>
          </div>
        </div>
      </section>

      {/* TODAY */}
      <section className="sec br-sec" id="today">
        <div className="wrap">
          <p className="eyebrow rv">{t('Сегодня')}</p>
          <h2 className="h2 serif rv">{t('BuddhaSpa сегодня')}</h2>
          <p className="lead rv br-sec__intro">
            {t('Сеть салонов в городах Казахстана, мастера из Юго-Восточной Азии и единые стандарты заботы — в каждом филиале.')}
          </p>
          <div className="about-stats rv">
            {TODAY.map(([n, l]) => (
              <div className="about-stat" key={l}>
                <div className="about-stat__n serif">{n}</div>
                <div className="about-stat__l">{t(l)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sec br-sec">
        <div className="wrap about-cta rv">
          <h2 className="h2 serif">{t('Почувствуйте BuddhaSpa лично')}</h2>
          <div className="about-cta__actions">
            <Link to="/#branches" className="btn">{t('Выбрать филиал')}</Link>
            <Link to="/franchise" className="btn btn-ghost">{t('Франшиза')}</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
