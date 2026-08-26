import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang, useT, LANGS } from '../i18n.jsx'
import LegalModal from './LegalModal.jsx'
import '../franchise.css'

// Images downloaded from the Tilda CDN into public/images/franchise/lp.
const LP = '/images/franchise/lp/'
const IMG = {
  hero: LP + 'hero.jpg',
  phil: LP + 'philosophy.jpg',
  imm: LP + 'immersive.jpg',
  f1: LP + 'immersive.jpg',            // CTA background — как на живом (DSC_7087-2)
  f2: LP + 'format-franchise.png',     // карточка «Франшиза» — как на живом
  fPartner: LP + 'format-partner.jpg', // карточка «Партнёр» — как на живом

  m1: LP + 'manage-1.jpg',
  m2: LP + 'manage-2.png',
  m3: LP + 'manage-3.jpg',
  m4: LP + 'manage-4.jpg',
  m5: LP + 'manage-5.png',
  s1: LP + 'step-1.jpg',
  s2: LP + 'step-2.jpg',
  s3: LP + 'step-3.jpg',
  s4: LP + 'step-4.png',
  s5: LP + 'step-5.jpg',
  it: LP + 'it.jpg',
  founder: LP + 'founder.jpg',
  logo: LP + 'logo.png',
}

const REASONS = [
  { n: '01', t: 'Мастера из Юго-Восточной Азии — это не маркетинг', a: 'Мы отбираем специалистов прямо в Таиланде и Индонезии, официально оформляем и привозим в Казахстан. Все мастера прошли сертификацию в лучших школах.', em: 'Это невозможно повторить с нуля без наших связей и опыта.' },
  { n: '02', t: 'Системность вместо хаоса', a: 'Бизнесом управляют не люди, а система. CRM, телефония, финансовая аналитика и контроль показателей работают как единый механизм.', em: 'Вы видите ключевые показатели бизнеса в реальном времени с любого устройства.' },
  { n: '03', t: '10 работающих салонов — не теория', a: '10 салонов в 4 городах: Астана, Шымкент, Тараз, Актобе. Более 50 000 клиентов в базе, 5 000+ гостей в месяц по сети.', em: 'Вы покупаете работающую модель, а не концепцию.' },
  { n: '04', t: 'Маркетинг, который приносит клиентов', a: 'Мы знаем, какие рекламные каналы работают в SPA-бизнесе, и умеем эффективно использовать каждый.', em: 'Средний клиент возвращается каждые 3–4 недели.', after: ' Retention Rate — 38%+.' },
  { n: '05', t: 'Бизнес, проверенный временем', a: 'Buddha Spa развивается на рынке уже больше 6 лет. Все процессы, стандарты, маркетинг и финансовая модель прошли проверку на собственных салонах.', em: 'Вам не нужно экспериментировать — вы получаете доказанную систему.' },
  { n: '06', t: 'Успех партнёров — главный показатель', a: 'Результат франшизы измеряется не количеством проданных франшиз, а успешными филиалами. Наши партнёры развивают бизнес вместе с сетью и получают доступ ко всем инструментам,', em: 'которые увеличивают выручку, прибыль и клиентскую базу.' },
]

const MANAGE = [
  { n: '01', img: IMG.m1, tag: 'Операционка', title: 'Контроль качества и сервиса каждый день', text: 'Полностью берём на себя управление сервисом и стандартами. Руководитель клиентского сервиса сопровождает работу филиала, поэтому партнёру не нужно погружаться в ежедневную операционку.', list: ['Управление управляющим филиала и администраторами', 'Внедрение и контроль стандартов Buddha Spa', 'Разработка и обновление SOP и регламентов', 'Проверки тайными гостями', 'Контроль NPS, CSAT и кассовой дисциплины', 'Регулярные аудиты и выезд специалистов УК'], tags: ['Высокий сервис во всех точках контакта', 'Контроль качества без личного участия', 'Снижение потерь от ошибок персонала', 'Рост повторных продаж и лояльности'] },
  { n: '02', img: IMG.m2, tag: 'Маркетинг', title: 'Постоянный поток новых клиентов', text: 'Мы знаем, какие рекламные каналы работают в SPA-бизнесе, и умеем эффективно использовать каждый.', list: ['Ведение соцсетей и контент-стратегия', 'Таргетированная реклама и работа с блогерами', 'Продвижение на картах и геосервисах', 'Акции и программы лояльности', 'Аналитика каждого рекламного канала'], tags: ['Стабильный поток новых клиентов', 'Снижение стоимости привлечения', 'Профессиональный маркетинг без своего отдела', 'Узнаваемый бренд в вашем городе'] },
  { n: '03', img: IMG.m3, tag: 'Продажи', title: 'Рост выручки — наша прямая ответственность', text: 'Наш доход зависит от вашей выручки. Поэтому управление продажами — в нашей зоне ответственности.', list: ['Контроль обработки лидов и конверсии', 'Внедрение и обновление скриптов продаж', 'Прослушивание звонков и разбор переписок', 'Акции для роста среднего чека', 'AI-инструменты для автоматизации продаж'], tags: ['Рост выручки из месяца в месяц', 'Рост конверсии и среднего чека', 'Больше повторных клиентов'] },
  { n: '04', img: IMG.m4, tag: 'Мастера', title: 'Мастера из Юго-Восточной Азии — под ключ', text: 'Нехватка квалифицированных специалистов — главная причина потерь выручки в SPA. Мы закрываем эту задачу полностью.', list: ['Отбор мастеров прямо в Таиланде и Индонезии', 'Официальное оформление и привоз в Казахстан', 'Проверка квалификации и тестирование', 'Адаптация и обучение стандартам Buddha Spa', 'Оперативная замена при выбытии'], tags: ['Берём на себя поиск, оформление и переезд мастеров', 'Адаптация, контроль и сопровождение', 'Стабильное качество услуг по стандартам'] },
  { n: '05', img: IMG.m5, tag: 'Развитие', title: 'Постоянное развитие на основе опыта сети', text: 'Мы тестируем новые инструменты, акции, процедуры и технологии на действующих филиалах. Партнёры получают только решения, которые уже доказали эффективность.', list: ['Новые маркетинговые инструменты', 'Успешные акции и программы лояльности', 'Новые процедуры и услуги', 'Лучшие практики всей сети'], tags: ['Проверенные бизнес-решения без экспериментов', 'Готовую систему управления и аналитику', 'Доступ к опыту всей сети Buddha Spa'] },
]

const STEPS = [
  { n: '01', img: IMG.s1, title: 'Анализ города и выбор локации', text: 'Анализируем трафик, конкурентов и арендные ставки. Помогаем вести переговоры и юридически сопровождаем договор аренды.', chips: [['gold', 'УК: аналитика и переговоры'], ['sage', 'Партнёр: финальное решение']] },
  { n: '02', img: IMG.s2, title: 'Дизайн-проект и подготовка помещения', text: 'Разрабатываем дизайн-проект по стандартам Buddha Spa — планировка, зонирование, освещение. Даём доступ к базе проверенных поставщиков.', chips: [['gold', 'УК: дизайн и стандарты'], ['sage', 'Партнёр: организация ремонта']], rev: true },
  { n: '03', img: IMG.s3, title: 'Привоз мастеров из Юго-Восточной Азии', text: 'Отбираем специалистов на месте. Официально оформляем и привозим в Казахстан. Проводим адаптацию и обучение стандартам.', chips: [['gold', 'УК: подбор, оформление, обучение']] },
  { n: '04', img: IMG.s4, title: 'Набор и обучение команды', text: 'Подбираем и обучаем администраторов и менеджеров. Внедряем скрипты продаж и стандарты обслуживания перед открытием.', chips: [['gold', 'УК: подбор и обучение']], rev: true },
  { n: '05', img: IMG.s5, title: 'Маркетинг и открытие', text: 'Запускаем рекламную кампанию к открытию: таргет, блогеры, геосервисы, офлайн-активации. Цель — очередь клиентов с первого дня.', chips: [['gold', 'УК: весь маркетинг'], ['sage', 'Партнёр: присутствует на открытии']] },
]

const IT = [
  { n: '01', t: 'Финансовый учёт в реальном времени', p: 'Система автоматически фиксирует все оплаты, выручку, средний чек и доход каждого мастера. Исключаются ошибки ручного расчёта.' },
  { n: '02', t: 'CRM и работа с клиентской базой', p: 'Более 50 000 клиентов в базе сети. История посещений, напоминания, работа с оттоком — всё автоматически.' },
  { n: '03', t: 'Складской учёт и сертификаты', p: 'Остатки расходных материалов, движение товаров, контроль сроков сертификатов — в одной системе.' },
  { n: '04', t: 'Мобильное приложение для гостей', p: 'Запись на процедуры, история визитов, программа лояльности — прямо со смартфона. Повышает частоту возвращений.' },
]

const REQS = [
  'Есть свободный капитал от 80 млн ₸ для инвестирования',
  'Вы хотите актив, а не очередную работу на себя',
  'Готовы доверять системе, а не контролировать каждый шаг',
  'Интересует долгосрочный доход, а не быстрые деньги',
  'Понимаете, что у любого бизнеса есть срок окупаемости',
  'Разделяете ценности заботы о клиенте и качества сервиса',
]

const NUMBERS = [
  { value: 18, suffix: 'млн ₸', label: 'Средняя выручка / мес' },
  { value: 35, suffix: '%', label: 'Рентабельность' },
  { static: '~24–36', suffix: 'мес', translateSuffix: true, label: 'Срок окупаемости' },
  { prefix: 'от ', value: 80, suffix: 'млн ₸', label: 'Стартовые инвестиции', gold: true },
]

// Real partners of the network (avatars downloaded locally under lp/cases).
const CASES = [
  { name: 'Исатай Жумабеков', city: 'Тараз', img: LP + 'cases/isatai.png', quote: 'Что подкупило в Buddha Spa — это прозрачная финансовая модель. Мы видим окупаемость на цифрах, а не на обещаниях.' },
  { name: 'Асель Сулейменова', city: 'Тараз', img: LP + 'cases/asel.jpg', quote: 'Мне очень нравится надёжность партнёрства. Управляющая компания обеспечивает хороший сервис и загрузку, и мы уверенно движемся к окупаемости к 23-му месяцу.' },
  { name: 'Арыстан Конакбаев', city: 'Шымкент', img: LP + 'cases/arystan.jpg', quote: 'Название Buddha Spa уже работает на нас — клиенты приходят с доверием к бренду, а не только к новой точке в их районе.' },
  { name: 'Асема Тасанбаева', city: 'Шымкент', img: LP + 'cases/asema.jpg', quote: 'Я долго искала бизнес с надёжным управлением и прозрачностью. С Buddha Spa мы партнёры уже 3,5 года и вышли в окупаемость уже на 16-м месяце. Buddha Spa обеспечила большое доверие к бренду.' },
  { name: 'Асанов Ерлан', city: 'Актобе', img: LP + 'cases/asanov.png', quote: 'Мы партнёры Buddha Spa совсем недавно, но уже видим, насколько всё продумано. Стандарты, отработанные годами, снимают массу вопросов — не нужно изобретать процессы с нуля.' },
  { name: 'Шырын Омарова', city: 'Шымкент', img: LP + 'cases/shyryn.png', quote: 'Мы стали партнёрами совсем недавно, и я могу с уверенностью сказать, что Buddha Spa даёт надёжность и доверие. Многие процессы стандартизированы с учётом многолетнего опыта в этой сфере.' },
  { name: 'Абыз Берик', city: 'Актобе', img: LP + 'cases/abyz.png', quote: 'Отдельно ценим систему обучения администраторов и мастеров. Благодаря готовым регламентам новый сотрудник выходит на нужный уровень сервиса за пару недель, а не месяцев.' },
]

// 360° virtual tours (Kuula). Empty `url` renders a disabled tab (as on the live site).
const TOURS = [
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZy3?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZg7?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Шымкент', url: 'https://kuula.co/share/collection/7JZWS?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Тараз', url: 'https://kuula.co/share/collection/7bXMS?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Астана', url: 'https://kuula.co/share/collection/7cFJ9?logo=-1&card=0&info=0&fs=1&vr=1&zoom=1&gyro=0&initload=1&thumbs=3&alpha=0.60&inst=ru' },
  { city: 'Актобе', url: '' },
  { city: 'Атырау', url: '' },
  { city: 'Кызылорда', url: '' },
]

function CountUpNum({ value, prefix = '', suffix }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          const start = performance.now()
          const duration = 1300
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setN(Math.round(eased * value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {prefix}
      {n}
      <small>{suffix}</small>
    </span>
  )
}

export default function Franchise() {
  const t = useT()
  const { lang, setLang } = useLang()
  const [navSolid, setNavSolid] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [activeTour, setActiveTour] = useState(0)
  const [legal, setLegal] = useState(null) // null | 'oferta' | 'privacy'

  async function onFranchiseSubmit(e) {
    e.preventDefault()
    if (sending) return
    const fd = new FormData(e.currentTarget)
    if (fd.get('company')) { setSent(true); return } // honeypot
    const payload = {
      name: fd.get('name'),
      phone: fd.get('phone'),
      company: fd.get('company'),
      city: fd.get('city'),
      branchSlug: 'franchise',
      branchLabel: 'Франшиза',
      service: 'Заявка на франшизу',
      comment: [
        `Капитал: ${fd.get('capital') || '—'}`,
        `Помещение: ${fd.get('premises') || '—'}`,
      ].join('\n'),
    }
    setSending(true)
    setSendError('')
    try {
      const resp = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await resp.json().catch(() => ({}))
      if (!resp.ok || !data.ok) throw new Error(data.error || '')
      setSent(true)
    } catch (err) {
      setSendError(err.message || t('Не удалось отправить заявку. Попробуйте ещё раз.'))
    } finally {
      setSending(false)
    }
  }
  const rootRef = useRef(null)
  const langRef = useRef(null)
  const heroImgRef = useRef(null)

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        setNavSolid(window.scrollY > 60)
        if (heroImgRef.current) {
          const y = Math.min(window.scrollY * 0.25, 140)
          heroImgRef.current.style.transform = `translateY(${y}px) scale(1.08)`
        }
        raf = null
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!langOpen) return undefined
    const onDocClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('.rv') || []
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const currentLabel = LANGS.find((l) => l.code === lang)?.label || 'Рус'

  return (
    <div className="fr-page" ref={rootRef}>
      <nav className={`fr-nav ${navSolid ? 'solid' : ''}`}>
        <Link to="/" className="fr-brand">
          <img src={IMG.logo} alt="Buddha Spa" />
          Buddha<span>Spa</span>
        </Link>
        <div className="fr-nav-right">
          <a className="fr-nav-links" href="#why">{t('Почему мы')}</a>
          <a className="fr-nav-links" href="#qa">{t('FAQ')}</a>
          <a href="#cta" className="btn fr-nav-cta" style={{ padding: '13px 24px' }}>{t('Оставить заявку')}</a>
          <div
            className="fr-lang"
            ref={langRef}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={langOpen}
            onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v) }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLangOpen((v) => !v) } }}
          >
            <span className="globe">🌐</span>
            <span>{currentLabel}</span>
            <span className="arrow">▾</span>
            <div className={`fr-lang-dd ${langOpen ? 'open' : ''}`}>
              {LANGS.map((l) => (
                <button key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => { setLang(l.code); setLangOpen(false) }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className={`fr-burger ${menuOpen ? 'open' : ''}`}
            aria-label={t('Меню')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`fr-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <a href="#why" onClick={() => setMenuOpen(false)}>{t('Почему мы')}</a>
          <a href="#qa" onClick={() => setMenuOpen(false)}>{t('FAQ')}</a>
          <a href="#cta" onClick={() => setMenuOpen(false)}>{t('Оставить заявку')}</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="fr-hero">
        <img ref={heroImgRef} src={IMG.hero} alt="" style={{ filter: 'brightness(.6)' }} />
        <div className="fr-hero-grad" />
        <div className="wrap fr-hero-inner">
          <span className="rv fr-hero-eyebrow eyebrow">{t('Франшиза · Казахстан')}</span>
          <h1 className="rv">{t('Инвестируйте в готовый')} <span className="ital">{t('прибыльный бизнес.')}</span></h1>
          <p className="rv fr-hero-sub">{t('Buddha Spa — лидер премиального SPA-рынка Казахстана: 10 работающих салонов, 50 000+ клиентов и проверенная модель. Вы вкладываете капитал — прибыль, управление, маркетинг и рост берём на себя мы.')}</p>
          <div className="rv fr-hero-actions">
            <a href="#cta" className="btn">{t('Получить расчёт →')}</a>
            <a href="#philosophy" className="btn btn-ghost">{t('Узнать больше')}</a>
          </div>
        </div>
      </header>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="sec" style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMG.phil} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.14, filter: 'brightness(.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 40%, rgba(20,16,11,.6), rgba(20,16,11,.96))' }} />
        <div className="wrap" style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span className="rv eyebrow">{t('Философия бренда')}</span>
          <h2 className="rv h2" style={{ marginTop: 22 }}>{t('Роскошь')} <span className="ital">{t('для души и тела')}</span></h2>
          <p className="rv" style={{ fontSize: 17, color: 'rgba(243,233,218,.72)', lineHeight: 2, maxWidth: 640, margin: '30px auto 0' }}>
            {t('Buddha Spa — это не просто массажный салон. Это пространство, где человек возвращается к себе, обретает внутреннюю тишину и восстанавливает баланс. Мы создаём не услугу — мы создаём состояние, которое остаётся с вами надолго. Каждая деталь здесь работает на одно: чтобы вы чувствовали себя лучше, чем до прихода.')}
          </p>
          <div className="rv fr-divider"><span className="l l1" /><span className="d" /><span className="l l2" /></div>
        </div>
      </section>

      {/* VIRTUAL TOUR */}
      <section id="tour" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 0 40px' }}>
            <span className="rv eyebrow">{t('Виртуальный тур')}</span>
            <h2 className="rv h2">{t('Загляните внутрь')} <span className="ital">{t('ещё до первого визита')}</span></h2>
            <p className="rv lead" style={{ margin: '22px 0 0', maxWidth: 620 }}>{t('Пройдитесь по действующим салонам Buddha Spa в 360°. Выберите филиал и осмотрите его изнутри — атмосфера, интерьер и уровень сервиса, которые получает каждый партнёр сети.')}</p>
          </div>
          <div className="rv fr-tour-tabs">
            {TOURS.map((tr, i) => (
              <button
                key={i}
                type="button"
                className={`fr-tour-tab ${activeTour === i ? 'is-active' : ''} ${tr.url ? '' : 'is-disabled'}`}
                disabled={!tr.url}
                onClick={() => tr.url && setActiveTour(i)}
              >
                {t(tr.city)}
              </button>
            ))}
          </div>
          <div className="rv fr-tour-frame">
            <iframe
              title="Buddha Spa 360°"
              src={TOURS[activeTour].url}
              allowFullScreen
              allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="fr-numbers">
        <div className="wrap">
          <div style={{ textAlign: 'center', marginBottom: 14 }}><span className="rv eyebrow">{t('Экономика одного салона')}</span></div>
          <div className="rv" style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ font: '500 12px/1.6 Manrope', letterSpacing: '.02em', color: 'rgba(243,233,218,.5)' }}>{t('Средние показатели по действующим филиалам, данные за 2025 год')}</span>
          </div>
          <div className="fr-numbers-row">
            {NUMBERS.map((nItem) => (
              <div className="rv fr-num" key={nItem.label}>
                <div className="fr-num-val" style={nItem.gold ? { color: 'var(--fr-gold2)' } : undefined}>
                  {nItem.static ? (
                    <span>{t(nItem.prefix || '')}{nItem.static}<small>{t(nItem.suffix)}</small></span>
                  ) : (
                    <CountUpNum value={nItem.value} prefix={t(nItem.prefix || '')} suffix={t(nItem.suffix)} />
                  )}
                </div>
                <div className="fr-num-lbl">{t(nItem.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QA */}
      <section id="qa" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 60px' }}>
            <span className="rv eyebrow">{t('Ответы на ключевые')}</span>
            <h2 className="rv h2">{t('Вопросы инвесторов')}</h2>
            <p className="rv lead" style={{ margin: '22px 0 0', maxWidth: 560 }}>{t('Инвестиции требуют понятной бизнес-модели, прозрачной экономики и надёжного партнёра. Ниже — ответы на вопросы, которые нам задают чаще всего.')}</p>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">01</span><div className="fr-qa-title">{t('«Сейчас подходящее время для открытия бизнеса?»')}</div></div>
            <div className="fr-qa-a">
              <p className="strong">{t('Да, если бизнес построен на сильной системе управления.')}</p>
              <p>{t('Во время нестабильности на рынке появляются выгодные помещения, снижается конкуренция и открываются новые возможности. При этом спрос на качественные услуги массажа и восстановления остаётся стабильным.')}</p>
              <p className="em" style={{ margin: 0 }}>{t('Главный фактор успеха — не момент открытия, а эффективное управление бизнесом.')}</p>
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">02</span><div className="fr-qa-title">{t('«Почему вам можно доверять?»')}</div></div>
            <div className="fr-qa-a">
              <p className="strong">{t('Большинство франшиз продают бренд и инструкции. Мы берём участие в управлении бизнесом после открытия.')}</p>
              <p style={{ marginBottom: 10 }}>{t('Управляющая компания обеспечивает:')}</p>
              <ul>
                {['операционное управление', 'маркетинг и привлечение клиентов', 'продажи и обучение персонала', 'контроль качества и финансовую аналитику', 'внедрение стандартов и развитие филиала'].map((s) => (
                  <li key={s}><span>—</span><span>{t(s)}</span></li>
                ))}
              </ul>
              <p className="em" style={{ margin: 0 }}>{t('Успех Buddha Spa - это и ваш успех.')}</p>
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">03</span><div className="fr-qa-title">{t('«Как оценить окупаемость?»')}</div></div>
            <div className="fr-qa-a">
              <p className="strong" style={{ marginBottom: 8 }}>{t('Стоимость открытия филиала — от 80 млн ₸.')}</p>
              <p style={{ margin: 0 }}>{t('Перед запуском мы предоставляем финансовую модель, основанную на показателях действующих филиалов.')}</p>
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">04</span><div className="fr-qa-title">{t('«Почему многие инвестируют сейчас?»')}</div></div>
            <div className="fr-qa-a">
              <p className="strong">{t('Идеального момента для открытия бизнеса не существует.')}</p>
              <p>{t('Пока одни откладывают решение, другие занимают лучшие локации, формируют клиентскую базу и развивают бизнес.')}</p>
              <p className="em" style={{ margin: 0 }}>{t('По данным Global Wellness Institute, рынок wellness продолжает расти, а спрос на услуги восстановления остаётся высоким.')}</p>
            </div>
          </div>

          <div className="rv fr-qa">
            <div className="fr-qa-q"><span className="fr-qa-n">05</span><div className="fr-qa-title">{t('«Что если филиал не выйдет на плановые показатели?»')}</div></div>
            <div className="fr-qa-a">
              <p className="strong">{t('Мы находимся с вами в одной экономике.')}</p>
              <p>{t('Наш доход — доля от прибыли салона, поэтому отставание бьёт и по нам. Если филиал идёт ниже финмодели, мы проводим аудит показателей, пересматриваем маркетинг и загрузку, усиливаем команду и обучение и вместе с партнёром запускаем план восстановления с чёткими сроками и контрольными точками.')}</p>
              <p className="em" style={{ margin: 0 }}>{t('Цифры в финмодели — расчётные ориентиры, а не гарантия дохода.')}</p>
            </div>
          </div>

          <div className="rv fr-callout">
            <div className="fr-callout-title">{t('Почему инвесторы выбирают')} <span className="ital">Buddha Spa</span></div>
            <div className="fr-callout-grid">
              {['10 действующих филиалов в Казахстане', 'Проверенная бизнес-модель на собственной сети', 'Полное операционное управление после открытия', 'Централизованный маркетинг и продажи', 'Контроль качества и единые стандарты', 'Прозрачная финансовая модель', 'Долгосрочное партнёрство и развитие каждого филиала'].map((s) => (
                <div key={s}><span>✓</span><span>{t(s)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE */}
      <section className="fr-imm">
        <img src={IMG.imm} alt="" />
        <div className="fr-imm-grad" />
        <div className="wrap fr-imm-inner">
          <div>
            <span className="rv eyebrow">{t('Почему Buddha Spa')}</span>
            <h2 className="rv h2" style={{ color: 'var(--fr-cream)', marginTop: 22 }}>{t('Мастера из Юго-Восточной Азии')}</h2>
            <p className="rv">{t('Мы отбираем специалистов прямо в Таиланде и Индонезии, официально оформляем и привозим в Казахстан. Все мастера прошли сертификацию в лучших школах.')}</p>
          </div>
        </div>
      </section>

      {/* WHY — 6 reasons */}
      <section id="why" className="sec fr-bg2sec">
        <div className="wrap fr-why-grid">
          <div className="fr-why-sticky">
            <span className="rv eyebrow">{t('Шесть причин')}</span>
            <h2 className="rv h2">{t('Выбрать нас')} <span className="ital">{t('и быть уверенным в завтрашнем дне')}</span></h2>
            <span className="fr-rule" />
          </div>
          <div>
            {REASONS.map((r) => (
              <div className="rv fr-reason" key={r.n}>
                <span className="fr-reason-n">{r.n}</span>
                <div>
                  <h3>{t(r.t)}</h3>
                  <p>{t(r.a)} <span className="em">{t(r.em)}</span>{r.after || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section id="formats" className="sec">
        <div className="wrap">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <span className="rv eyebrow">{t('Форматы партнёрства')}</span>
            <h2 className="rv h2" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}>{t('Выберите формат')} <span className="ital">{t('под свои цели')}</span></h2>
          </div>
          <div className="fr-cardrow">
            <div className="rv fr-card">
              <div className="fr-card-img"><img src={IMG.fPartner} alt="" /><div className="grad" /><span className="fr-card-num">01</span><div className="fr-card-name">{t('Партнёр')}</div></div>
              <div className="fr-card-p">
                <p>{t('Вы инвестируете капитал в открытие салона (от 80 млн ₸) и контролируете финансовые показатели. Ежедневное управление берёт на себя управляющая компания, а прибыль делится 50/50. Паушального взноса и роялти нет.')}</p>
                <div className="fr-partner-grid">
                  <div><div className="flabel">{t('Условия')}</div><div className="fvalue">50 / 50</div></div>
                  <div><div className="flabel">{t('Вовлечённость')}</div><div className="fvalue">{t('Минимальная')}</div></div>
                  <div><div className="flabel">{t('Первоначальный взнос')}</div><div className="fvalue">0 ₸</div></div>
                </div>
              </div>
            </div>
            <div className="rv fr-card">
              <div className="fr-card-img"><img src={IMG.f2} alt="" /><div className="grad" /><span className="fr-card-num">02</span><div className="fr-card-name">{t('Франшиза')}</div></div>
              <div className="fr-card-p">
                <p>{t('Вы активно участвуете в управлении, УК обеспечивает систему, стандарты и поддержку на каждом этапе.')}</p>
                <div className="fr-partner-grid">
                  <div><div className="flabel">{t('Роялти')}</div><div className="fvalue">{t('7% с оборота')}</div></div>
                  <div><div className="flabel">{t('Вовлечённость')}</div><div className="fvalue">{t('Активная')}</div></div>
                  <div><div className="flabel">{t('Первоначальный взнос')}</div><div className="fvalue">{t('5 млн ₸')}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section id="manage" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 56px' }}>
            <span className="rv eyebrow">{t('Система управления')}</span>
            <h2 className="rv h2">{t('Как мы управляем')} <span className="ital">{t('вашим салоном')}</span></h2>
            <p className="rv lead" style={{ margin: '20px 0 0', maxWidth: 560 }}>{t('Пять направлений, которые управляющая компания берёт на себя — чтобы партнёр видел результат, а не рутину.')}</p>
          </div>
          <div className="fr-cardrow four">
            {MANAGE.map((c) => (
              <div className="rv fr-card" key={c.n}>
                <div className="fr-card-img sm"><img src={c.img} alt="" /><div className="grad" /><div className="fr-card-tag"><span className="n">{c.n}</span><span className="lbl">{t(c.tag)}</span></div></div>
                <div className="fr-card-body">
                  <h3>{t(c.title)}</h3>
                  <p>{t(c.text)}</p>
                  <ul className="fr-card-list">{c.list.map((li) => (<li key={li}><span>—</span><span>{t(li)}</span></li>))}</ul>
                  <div className="fr-card-foot">
                    <div className="fr-card-foot-lbl">{t('Что получает партнёр')}</div>
                    <div className="fr-tags">{c.tags.map((tg) => (<span key={tg}>{t(tg)}</span>))}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className="sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 0 64px' }}>
            <span className="rv eyebrow">{t('Этапы запуска')}</span>
            <h2 className="rv h2">{t('От подписания')} <span className="ital">{t('до первого гостя')}</span></h2>
            <p className="rv lead" style={{ margin: '20px 0 0', maxWidth: 520 }}>{t('В среднем 5–6 месяцев от подписания до первого гостя. Большую часть работы ведём параллельно.')}</p>
          </div>
          <div className="fr-steps">
            {STEPS.map((s) => (
              <div className={`rv fr-step ${s.rev ? 'rev' : ''}`} key={s.n}>
                <div className="fr-step-img"><img src={s.img} alt="" /><div className="grad" /><span className="fr-step-num">{s.n}</span></div>
                <div className="fr-step-txt">
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.text)}</p>
                  <div className="fr-chips">{s.chips.map(([k, txt]) => (<span key={txt} className={`fr-chip ${k}`}>{t(txt)}</span>))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section id="cases" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 760, margin: '0 0 40px' }}>
            <span className="rv eyebrow">{t('Партнёры сети')}</span>
            <h2 className="rv h2">{t('Реальные предприниматели.')} <span className="ital">{t('Реальные результаты.')}</span></h2>
            <p className="rv lead" style={{ margin: '22px 0 0', maxWidth: 620 }}>{t('Рентабельность действующих филиалов сети составляет 30–40%. Средняя чистая прибыль партнёров достигает около 5 млн ₸ в месяц.')}</p>
          </div>
          <div className="rv fr-cases">
            {CASES.map((c) => (
              <figure className="fr-case" key={c.name}>
                <img src={c.img} alt={c.name} className="fr-case-ph" loading="lazy" />
                <figcaption className="fr-case-name">{t(c.name)}</figcaption>
                <div className="fr-case-meta">{t('Партнёр')} · {t(c.city)}</div>
                <span className="fr-case-rule" />
                <blockquote className="fr-case-quote">{t(c.quote)}</blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* IT */}
      <section id="it" className="sec" style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={IMG.it} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.1, filter: 'brightness(.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 70% 30%, rgba(20,16,11,.55), rgba(20,16,11,.97))' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 720, margin: '0 0 56px' }}>
            <span className="rv eyebrow">{t('IT-экосистема')}</span>
            <h2 className="rv h2">{t('Все показатели бизнеса —')} <span className="ital">{t('у вас в телефоне')}</span></h2>
          </div>
          <div className="fr-it-grid">
            {IT.map((it) => (
              <div className="rv fr-it" key={it.n}><div className="fr-it-n">{it.n}</div><h3>{t(it.t)}</h3><p>{t(it.p)}</p></div>
            ))}
          </div>
          <div className="rv fr-it-callout">
            <div className="fr-it-callout-lbl">{t('Одно приложение')}</div>
            <div className="fr-it-callout-title">{t('Всё под контролем —')} <span className="ital">{t('без вашего участия')}</span></div>
            <p>{t('Записи, оплаты, склад, лояльность и финансовая аналитика Buddha Spa — в одной системе, доступной с телефона в любой точке мира.')}</p>
          </div>
        </div>
      </section>

      {/* FOUNDER — single, do not alter */}
      <section id="founders" className="sec fr-bg2sec">
        <div className="wrap">
          <div style={{ maxWidth: 720, margin: '0 auto 52px', textAlign: 'center' }}>
            <span className="rv eyebrow">{t('Основательница')}</span>
            <h2 className="rv h2">{t('С вами будет работать')}</h2>
            <p className="rv lead" style={{ margin: '20px auto 0', maxWidth: 520 }}>{t('До подписания вы встретитесь с основательницей лично и побываете в работающем салоне.')}</p>
          </div>
          <div className="fr-founders">
            <div className="rv fr-founder">
              <div className="fr-founder-card">
                <img src={IMG.founder} alt="Арай Жузенова — основательница Buddha Spa" className="fr-founder-ph" style={{ width: 150, height: 150 }} />
                <div>
                  <div className="fr-founder-role">{t('Основательница Buddha Spa')}</div>
                  <h4>Арай Жузенова</h4>
                  <p>{t('С самого начала Арай хотела создать место, где забота о теле становится заботой о внутреннем состоянии человека. Buddha Spa — это результат её видения: пространство тишины, присутствия и настоящей перезагрузки.')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section id="req" className="sec" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="wrap" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 52px' }}>
            <span className="rv eyebrow">{t('Требования к партнёру')}</span>
            <h2 className="rv h2">{t('Кому подходит')}</h2>
          </div>
          <div className="rv" style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className="fr-req-badge"><span className="dot">✦</span><span className="lbl">{t('Вам подойдёт, если')}</span></div>
            <ul className="fr-req">{REQS.map((r) => (<li key={r}><span>✦</span><span>{t(r)}</span></li>))}</ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="sec fr-cta">
        <img src={IMG.f1} alt="" />
        <div className="fr-cta-grad" />
        <div className="wrap fr-cta-inner">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <span className="rv eyebrow">{t('Первый шаг')}</span>
            <h2 className="rv h2" style={{ color: 'var(--fr-cream)' }}>{t('Оставьте заявку.')} <span className="ital">{t('Расчёт — за 30 минут.')}</span></h2>
            <p className="rv lead" style={{ margin: '20px auto 0', maxWidth: 480 }}>{t('Узнайте, подходит ли ваш город для открытия Buddha Spa.')}</p>
          </div>
          <div className="fr-cta-grid">
            <div className="rv">
              <p style={{ fontSize: 13.5, color: 'rgba(243,233,218,.6)', margin: '0 0 20px' }}>{t('После получения заявки мы:')}</p>
              <ul className="fr-cta-list">
                {['Свяжемся в течение 30 минут в рабочее время', 'Покажем финансовую модель под ваш город', 'Пригласим на встречу с основательницей — офлайн или онлайн'].map((s) => (
                  <li key={s}><span>→</span><span>{t(s)}</span></li>
                ))}
              </ul>
              <div style={{ marginTop: 36, paddingTop: 30, borderTop: '1px solid var(--fr-line)' }}>
                <p style={{ font: '600 10px/1 Manrope', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(243,233,218,.42)', margin: '0 0 14px' }}>{t('Или напишите напрямую')}</p>
                <a href="https://wa.me/77019898001" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 14, fontWeight: 600 }}>WhatsApp →</a>
              </div>
            </div>
            <div className="rv fr-form">
              {!sent ? (
                <form onSubmit={onFranchiseSubmit}>
                  <div className="fr-form-title">{t('Расскажите о себе')}</div>
                  <div className="fr-form-fields">
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
                    <div><label>{t('Ваше имя')}</label><input type="text" name="name" required placeholder={t('Как к вам обращаться?')} /></div>
                    <div><label>{t('Телефон / WhatsApp')}</label><input type="tel" name="phone" required placeholder="+7 ___ ___ __ __" /></div>
                    <div><label>{t('Ваш город')}</label>
                      <select name="city">{['Выберите город', 'Алматы', 'Астана', 'Шымкент', 'Актобе', 'Другой город'].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    <div><label>{t('Располагаемый капитал')}</label>
                      <select name="capital">{['Выберите диапазон', 'До 80 млн ₸', '80–120 млн ₸', '120–200 млн ₸', 'Более 200 млн ₸'].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    <div><label>{t('У вас есть помещение?')}</label>
                      <select name="premises">{['Выберите вариант', 'У меня есть помещение', 'Буду арендовать'].map((o) => (<option key={o}>{t(o)}</option>))}</select>
                    </div>
                    {sendError && <p style={{ color: '#e0a3a3', fontSize: 13, margin: '4px 0 0' }}>{sendError}</p>}
                    <button type="submit" className="btn" disabled={sending} style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}>{sending ? t('Отправляем…') : t('Оставить заявку →')}</button>
                  </div>
                </form>
              ) : (
                <div className="fr-confirm">
                  <div className="ring"><span /></div>
                  <h3>{t('Заявка принята')}</h3>
                  <p>{t('Мы свяжемся с вами в течение 30 минут в рабочее время.')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="fr-foot">
        <div className="wrap">
          <div className="fr-foot-grid">
            <div className="fr-foot-col fr-foot-brand">
              <span className="fr-brand">Buddha<span>Spa</span></span>
              <p>{t('Тайский массаж и уход за телом в спа-салоне.')}</p>
            </div>

            <div className="fr-foot-col">
              <h4>{t('Остались вопросы?')}</h4>
              <a href="mailto:info@buddhaspa.kz">info@buddhaspa.kz</a>
              <a href="tel:+77019898001">+7 (701) 989 80 01</a>
              <p>{t('Наши специалисты помогут с ответом')}</p>
            </div>

            <div className="fr-foot-col">
              <h4>{t('Режим работы')}</h4>
              <p>{t('Ежедневно с 11:00 до 23:00')}</p>
            </div>

            <div className="fr-foot-col">
              <h4>{t('Информация')}</h4>
              <button type="button" className="fr-foot-link" onClick={() => setLegal('oferta')}>{t('Оферта СПА')}</button>
              <a href="https://buddhaspa.kz/pravila/spa/ru" target="_blank" rel="noopener noreferrer">{t('Правила СПА')}</a>
              <a href="https://buddhaspa.kz/platezhi/ru" target="_blank" rel="noopener noreferrer">{t('Платежи')}</a>
              <button type="button" className="fr-foot-link" onClick={() => setLegal('privacy')}>{t('Политика конфиденциальности')}</button>
            </div>
          </div>

          <div className="fr-foot-bottom">
            <span>© All Rights Reserved. BuddhaSpa.</span>
            <span>{t('ИП Steak Field · Астана, Керей Жанибек хандары, 18')}</span>
          </div>
        </div>
      </footer>

      {legal && <LegalModal slug={legal} onClose={() => setLegal(null)} />}
    </div>
  )
}
