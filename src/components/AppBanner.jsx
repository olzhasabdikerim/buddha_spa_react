import { useT } from '../i18n.jsx'

export default function AppBanner() {
  const t = useT()
  return (
    <div className="app-banner">
      <div className="wrap app-banner__inner">
        <div className="app-banner__icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </div>
        <div className="app-banner__text">
          <strong>{t('BuddhaSpa — удобно с телефона')}</strong>
          <span>{t('Записывайтесь онлайн в пару касаний — без звонков')}</span>
        </div>
        <a
          href="https://app.buddhaspa.kz/"
          target="_blank"
          rel="noopener noreferrer"
          className="app-banner__btn"
        >
          {t('Открыть приложение')} →
        </a>
      </div>
    </div>
  )
}
