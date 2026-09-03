import { useT } from '../i18n.jsx'

const APP_URL = 'https://app.buddhaspa.kz/'

const SCREENS = [
  { src: '/images/app/screen-levels.jpg', alt: 'Уровни лояльности' },
  { src: '/images/app/screen-chats.jpg',  alt: 'Чаты и поддержка' },
  { src: '/images/app/screen-coins.jpg',  alt: 'Buddha Coins и бонусы' },
  { src: '/images/app/screen-booking.jpg',alt: 'Запись на услугу' },
  { src: '/images/app/screen-certs.jpg',  alt: 'Сертификаты' },
]

// rot=degrees, y=drop from center (px), z=stacking order
const FAN = [
  { rot: -18, y: 48, z: 1 },
  { rot:  -9, y: 22, z: 2 },
  { rot:   0, y:  0, z: 5 },
  { rot:   9, y: 22, z: 3 },
  { rot:  18, y: 48, z: 1 },
]

function PhonesFan() {
  return (
    <div className="phones-fan" aria-hidden="true">
      {SCREENS.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading="lazy"
          className={`phones-fan__photo${i === 2 ? ' is-center' : ''}`}
          style={{ transform: `rotate(${FAN[i].rot}deg) translateY(${FAN[i].y}px)`, zIndex: FAN[i].z }}
        />
      ))}
    </div>
  )
}

const LEVELS = [
  { name: 'Bronze', xp: 0,   cashback: 5,  writeOff: 15, color: '#cd7f32' },
  { name: 'Silver', xp: 100, cashback: 7,  writeOff: 20, color: '#a0a0a0' },
  { name: 'Gold',   xp: 200, cashback: 10, writeOff: 25, color: '#c9a96e' },
  { name: 'Platinum', xp: 300, cashback: 12, writeOff: 30, color: '#b0c4d8' },
  { name: 'VIP',    xp: 400, cashback: 15, writeOff: 40, color: '#e4cfa6' },
]

const BONUSES = [
  {
    bc: '+5 000 BC',
    label: 'Регистрация в приложении',
    note: '+ массаж головы 30 мин в первый визит · независимо от источника ссылки',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
  },
  {
    bc: '+1 000 / +2 000 BC',
    label: 'Приглашение друга по реф. ссылке',
    note: '+1 000 за регистрацию друга · +2 000 после его первой покупки',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    bc: '+5 000 BC + 1 000 ₸',
    label: 'Регистрация по реф. ссылке друга',
    note: '+5 000 за регистрацию · +1 000 ₸ бонусом за использование реферальной ссылки',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    bc: '+1 000 BC',
    label: 'Оценка визита',
    note: 'Оставьте отзыв о посещении в приложении и получите бонус',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    bc: '+5 000 BC',
    label: 'Подарок ко дню рождения',
    note: 'Начисляются ко дню рождения каждый год',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
        <path d="M12 22V7m0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
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

        <PhonesFan />

        <div className="app-coins-hero">
          <div className="app-coins-tag">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 9.5C8 8.1 9.8 7 12 7s4 1.1 4 2.5-1.8 2.5-4 2.5-4 1.1-4 2.5S9.8 17 12 17s4-1.1 4-2.5"/>
            </svg>
            <span>{t('Buddha Coins')}</span>
            <span className="app-coins-rate">1 BC = 1 ₸</span>
          </div>
          <p className="app-coins-sub">{t('Копите баллы за каждый визит и тратьте их на услуги. Чем выше уровень — тем больше кэшбэк и возможность списания.')}</p>

          <div className="app-levels">
            <div className="app-levels__head">
              <span>{t('Уровень')}</span>
              <span>{t('от XP')}</span>
              <span>{t('Кэшбэк')}</span>
              <span>{t('Списание')}</span>
            </div>
            {LEVELS.map((lvl) => (
              <div className="app-level" key={lvl.name} style={{ '--lvl-color': lvl.color }}>
                <span className="app-level__name" style={{ color: lvl.color }}>{lvl.name}</span>
                <span className="app-level__xp">{lvl.xp} XP</span>
                <span className="app-level__val">{lvl.cashback}%</span>
                <span className="app-level__val">{lvl.writeOff}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bonuses */}
        <div className="app-bonuses">
          <p className="app-bonuses__title eyebrow">{t('Предусмотрены бонусы')}</p>
          <div className="app-bonus-list">
            {BONUSES.map((b, i) => (
              <div className="app-bonus-row" key={b.label}>
                <span className="app-bonus-row__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="app-bonus-row__bc">{t(b.bc)}</span>
                <span className="app-bonus-row__label">{t(b.label)}</span>
                <span className="app-bonus-row__note">{t(b.note)}</span>
              </div>
            ))}
          </div>
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
