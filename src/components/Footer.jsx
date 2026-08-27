import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import { BRAND_EMBLEM } from './Header.jsx'

export default function Footer({ onOpenLegal }) {
  const t = useT()
  return (
    <footer id="contacts" className="site-footer">
      <div className="wrap site-footer__grid">
        <div className="site-footer__brand">
          <img className="brand__logo" src={BRAND_EMBLEM} alt="BuddhaSpa" />
          <span className="brand__name">Buddha<span className="brand__name-accent">Spa</span></span>
          <p>{t('Тайский массаж и уход за телом в спа-салоне.')}</p>
        </div>

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
          <Link to="/franchise">{t('Франшиза')}</Link>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('oferta')}>
            {t('Оферта СПА')}
          </button>
          <button type="button" className="footer-link-btn" onClick={() => onOpenLegal('privacy')}>
            {t('Политика конфиденциальности')}
          </button>
        </div>
      </div>

      <div className="wrap site-footer__bottom">
        <span>© All Rights Reserved. BuddhaSpa.</span>
        <span>ИП Steak Field · Астана, Керей Жанибек хандары, 18</span>
      </div>
    </footer>
  )
}
