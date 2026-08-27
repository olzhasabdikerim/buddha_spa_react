import { useT } from '../i18n.jsx'

function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

// Reusable "book at this branch" card. Replaces the old full-bleed dark contacts
// band with a contained, on-brand card (same radius / border / spacing as the
// rest of the site). Looks identical across every branch.
export default function BranchBookingCard({ branch, onBook }) {
  const t = useT()
  const wa = `https://wa.me/${branch.whatsapp}`
  return (
    <div className="br-booking rv">
      <div className="br-booking__text">
        <p className="eyebrow">{t('Запись')}</p>
        <h2 className="h2 serif">{t('Записаться в')} BuddhaSpa</h2>
        <p className="br-booking__meta">{branch.fullAddress} · {t(branch.hours)}</p>
      </div>
      <div className="br-booking__actions">
        <button className="btn" onClick={onBook}>{t('Записаться')}</button>
        <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="btn btn-ghost" href={telHref(branch.phone)}>{branch.phone}</a>
        <a
          className="btn btn-ghost"
          href={`https://yandex.ru/maps/?text=${encodeURIComponent('BuddhaSpa ' + branch.fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
        >{t('На карте')}</a>
      </div>
    </div>
  )
}
