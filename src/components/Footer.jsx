import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import { COMPANY } from '../data/company.js'
import { handleHashNav } from '../lib/hashNav.js'

const FOOTER_LOGO = '/images/footer-brand-premium.png'

export default function Footer({ onOpenLegal }) {
  const t = useT()
  const telHref = `tel:${COMPANY.generalPhone.replace(/[^\d+]/g, '')}`
  const waHref = `https://wa.me/${COMPANY.generalWhatsapp}`

  return (
    <footer id="contacts" className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          {/* Brand */}
          <div className="site-footer__brand">
            <img className="site-footer__logo" src={FOOTER_LOGO} alt="BuddhaSpa — сеть тайских спа-салонов" />
            <p className="site-footer__tag">
              {t('Сеть тайских спа-салонов в городах Казахстана. Гармония тела и души в каждой процедуре.')}
            </p>
          </div>

          {/* Navigation */}
          <nav className="site-footer__col">
            <h4>{t('Навигация')}</h4>
            <ul>
              <li><Link to="/">{t('Главная')}</Link></li>
              <li><Link to="/#branches" onClick={(e) => handleHashNav(e, '/#branches')}>{t('Филиалы')}</Link></li>
              <li><Link to="/about">{t('О нас')}</Link></li>
              <li><Link to="/#faq" onClick={(e) => handleHashNav(e, '/#faq')}>FAQ</Link></li>
              <li><Link to="/franchise">{t('Франшиза')}</Link></li>
            </ul>
          </nav>

          {/* Contacts */}
          <div className="site-footer__col">
            <h4>{t('Контакты')}</h4>
            <ul className="site-footer__contacts">
              <li><a href={telHref}>{COMPANY.generalPhone}</a></li>
              <li><a href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><span>{t(COMPANY.workingHours)}</span></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__divider" />

        <div className="site-footer__bottom">
          <span className="site-footer__copy">© {new Date().getFullYear()} BuddhaSpa. {t('Все права защищены.')}</span>
          <div className="site-footer__legal">
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('oferta')}>
              {t('Оферта')}
            </button>
            <a className="footer-link-btn" href="https://buddhaspa.kz/pravila/spa/ru" target="_blank" rel="noopener noreferrer">
              {t('Правила СПА')}
            </a>
            <a className="footer-link-btn" href="https://buddhaspa.kz/oferta/spa/ru" target="_blank" rel="noopener noreferrer">
              {t('Оферта СПА')}
            </a>
            <a className="footer-link-btn" href="https://buddhaspa.kz/platezhi/ru" target="_blank" rel="noopener noreferrer">
              {t('Платежи')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
