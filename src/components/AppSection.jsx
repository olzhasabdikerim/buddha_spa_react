import { useT } from '../i18n.jsx'

const APP_URL = 'https://app.buddhaspa.kz/'

const FEATURES = [
  {
    key: 'booking',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    title: 'Онлайн-запись',
    desc: 'Выбирайте услугу, мастера и удобное время без звонков администратору',
  },
  {
    key: 'coins',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2m-4-6h8"/>
        <path d="M9 9.5C9 8.1 10.3 7 12 7s3 1.1 3 2.5c0 2.5-3 3-3 5"/>
      </svg>
    ),
    title: 'Бонусная программа BuddhaCoins',
    desc: 'Кэшбэк с каждого визита, бонус в честь дня рождения, приветственный подарок за регистрацию',
  },
  {
    key: 'cert',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0v2"/>
        <circle cx="12" cy="14" r="2"/><path d="M12 16v3"/>
      </svg>
    ),
    title: 'Подарочные сертификаты',
    desc: 'Оформите сертификат для близкого человека, оплатите картой онлайн',
  },
  {
    key: 'ref',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Реферальная программа',
    desc: 'Приглашайте друзей и получайте бонусы за каждого',
  },
  {
    key: 'health',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: 'Анкета здоровья',
    desc: 'Заполните один раз, чтобы мастер учёл противопоказания перед процедурой',
  },
  {
    key: 'notif',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: 'Уведомления',
    desc: 'Напоминания о записи, статус бонусов, ответы администратора — всё в приложении',
  },
]

export default function AppSection() {
  const t = useT()
  return (
    <section id="app" className="app-sec">
      <div className="wrap app-sec__inner">
        <div className="app-sec__head">
          <p className="eyebrow section-label">{t('Веб-приложение')}</p>
          <h2 className="section-title">{t('Приложение лояльности Buddha Spa')}</h2>
          <p className="app-sec__sub">
            {t('Ваш личный кабинет сети спа-салонов: записывайтесь на процедуры, копите и тратьте бонусы, дарите близким сертификаты — всё в одном приложении.')}
          </p>
        </div>

        <div className="app-sec__grid">
          {FEATURES.map((f) => (
            <div className="app-feat" key={f.key}>
              <div className="app-feat__icon">{f.icon}</div>
              <div className="app-feat__body">
                <strong className="app-feat__title">{t(f.title)}</strong>
                <p className="app-feat__desc">{t(f.desc)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="app-sec__cta">
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-coral app-sec__btn">
            {t('Перейти в приложение')}
          </a>
        </div>
      </div>
    </section>
  )
}
