import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'

const FOOTER_LOGO = '/images/footer-brand-white.png'

export default function Footer({ onOpenLegal }) {
  const t = useT()
  return (
    <footer id="contacts" className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <img className="site-footer__logo" src={FOOTER_LOGO} alt="BuddhaSpa — relaxation centre" />

          <div className="site-footer__col">
            <h4>{t('Остались вопросы?')}</h4>
            <p>{t('Наши специалисты помогут с ответом')}</p>
          </div>

          <div className="site-footer__col">
            <h4>{t('Режим работы')}</h4>
            <p>{t('Ежедневно с 11:00 до 23:00')}</p>
          </div>
        </div>

        <div className="site-footer__divider" />

        <div className="site-footer__bottom">
          <nav className="site-footer__links">
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>
              {t('Политика конфиденциальности')}
            </button>
            <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('oferta')}>
              {t('Оферта СПА')}
            </button>
            <Link to="/franchise">{t('Франшиза')}</Link>
            <Link to="/about">{t('О BuddhaSpa')}</Link>
          </nav>
          <span className="site-footer__copy">© All Rights Reserved. BuddhaSpa.</span>
          <a className="site-footer__email" href="mailto:info@buddhaspa.kz">info@buddhaspa.kz</a>
        </div>
      </div>
    </footer>
  )
}
