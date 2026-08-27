import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import { BRAND_EMBLEM } from './Header.jsx'

export default function Footer({ onOpenLegal }) {
  const t = useT()
  return (
    <footer id="contacts" className="site-footer">
      <div className="wrap">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <img className="site-footer__logo" src={BRAND_EMBLEM} alt="BuddhaSpa" />
            <p className="site-footer__tagline">{t('Тайский массаж и уход за телом в спа-салоне.')}</p>
          </div>

          <div className="site-footer__cols">
            <div className="site-footer__col">
              <h4>{t('Остались вопросы?')}</h4>
              <a href="mailto:info@buddhaspa.kz">info@buddhaspa.kz</a>
              <a href="tel:+77019898001">+7 (701) 989 80 01</a>
              <p>{t('Наши специалисты помогут с ответом')}</p>
            </div>

            <div className="site-footer__col">
              <h4>{t('Режим работы')}</h4>
              <p>{t('Ежедневно с 11:00 до 23:00')}</p>
            </div>

            <div className="site-footer__col">
              <h4>{t('Информация')}</h4>
              <Link to="/#branches">{t('Филиалы')}</Link>
              <Link to="/about">{t('О BuddhaSpa')}</Link>
              <Link to="/franchise">{t('Франшиза')}</Link>
              <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('oferta')}>
                {t('Оферта СПА')}
              </button>
              <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>
                {t('Политика конфиденциальности')}
              </button>
            </div>
          </div>
        </div>

        <div className="site-footer__wordmark serif" aria-hidden="true">BuddhaSpa</div>

        <div className="site-footer__bottom">
          <span>© All Rights Reserved. BuddhaSpa.</span>
          <span>ИП Steak Field · Астана, Керей Жанибек хандары, 18</span>
        </div>
      </div>
    </footer>
  )
}
