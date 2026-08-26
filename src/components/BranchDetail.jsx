import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GUEST_BENEFITS, MEMBERSHIP_TIERS, GUEST_INFO } from '../data/company.js'
import { buildBranchCatalog } from '../data/catalog.js'
import { applyBranchSeo } from '../lib/seo.js'
import { useT } from '../i18n.jsx'
import LeadModal from './LeadModal.jsx'
import ServiceDetailModal from './ServiceDetailModal.jsx'

function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

// Reveal-on-scroll: adds .in to any .rv element once it enters the viewport.
function useReveal(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.br-page .rv')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default function BranchDetail({ branch }) {
  const t = useT()
  const { programs, massagesFull, massagesPremium, massagesZone, procedures, goalsPresent } =
    buildBranchCatalog(branch.services || [])
  const wa = `https://wa.me/${branch.whatsapp}`
  const [lead, setLead] = useState(null)          // null | {} | { service }
  const [detail, setDetail] = useState(null)      // null | service  (Подробнее)
  const [goal, setGoal] = useState('all')         // program filter
  const [showAllMassages, setShowAllMassages] = useState(false)

  useEffect(() => applyBranchSeo(branch), [branch])
  useReveal([branch.slug, goal, showAllMassages])

  // Booking payload built from an enriched catalog item.
  const bookService = (s) => ({
    name: s.name,
    description: s.description,
    duration: s.durationLabel,
    price: s.priceFromLabel,
  })
  const openDetail = (s) => setDetail(s)
  const openLead = (s) => setLead({ service: bookService(s) })
  // From the detail modal: swap it for the booking form.
  const bookFromDetail = (s) => { setDetail(null); openLead(s) }

  const shownPrograms = goal === 'all' ? programs : programs.filter((p) => p.goals.includes(goal))
  const POPULAR = 6
  const shownMassages = showAllMassages ? massagesFull : massagesFull.slice(0, POPULAR)

  return (
    <div className="br-page">
      {/* 01 · HERO */}
      <header className="br-hero" style={{ backgroundImage: `url(${branch.hero})` }}>
        <div className="br-hero__grad" />
        <div className="wrap br-hero__inner">
          <Link to="/#branches" className="br-back">← {t('Все филиалы')}</Link>
          <p className="eyebrow br-hero__eyebrow">
            {t(branch.city)} · Buddha Spa
            {branch.premium && <span className="br-premium">Premium</span>}
          </p>
          <h1 className="br-hero__title serif">
            {t('Тайский массаж и уход за телом')}
            <br /><span className="ital">{branch.fullAddress}</span>
          </h1>
          <p className="br-hero__sub">
            {t('Тайский массаж и уход за телом в SPA-салоне Buddha Spa — тепло подлинной тайской традиции рядом с вами.')}
          </p>
          <div className="br-hero__actions">
            <button className="btn" onClick={() => setLead({})}>{t('Записаться')}</button>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{t('Написать в WhatsApp')}</a>
            {branch.vrTour && (
              <a className="btn btn-ghost" href={branch.vrTour} target="_blank" rel="noopener noreferrer">{t('Пройти VR-тур')}</a>
            )}
          </div>
          <div className="br-hero__meta">
            <span><b>{t('Адрес')}</b> {branch.fullAddress}</span>
            <a href={telHref(branch.phone)}><b>{t('Телефон')}</b> {branch.phone}</a>
            <span><b>{t('Часы')}</b> {t(branch.hours)}</span>
          </div>
        </div>
      </header>

      {branch.needsData && (
        <div className="br-notice wrap">
          {t('Страница филиала наполняется. Актуальные цены и состав программ уточняйте у администратора или в WhatsApp.')}
        </div>
      )}

      {/* 02 · SPA-ПРОГРАММЫ (headline block, right after hero) */}
      {programs.length > 0 && (
        <section className="sec br-sec" id="programs">
          <div className="wrap">
            <p className="eyebrow rv">{t('Главное')}</p>
            <h2 className="h2 serif rv">SPA-{t('программы')}</h2>
            <p className="lead rv br-sec__intro">
              {t('Комплексные ритуалы: прогрев, пилинг, массаж и уход — от расслабления до перезагрузки. Выберите цель, остальное доверьте мастерам.')}
            </p>

            {goalsPresent.length > 0 && (
              <div className="br-filters rv">
                <button className={`br-chip ${goal === 'all' ? 'is-active' : ''}`} onClick={() => setGoal('all')}>
                  {t('Все программы')}
                </button>
                {goalsPresent.map((g) => (
                  <button key={g.key} className={`br-chip ${goal === g.key ? 'is-active' : ''}`} onClick={() => setGoal(g.key)}>
                    {t(g.title)}
                  </button>
                ))}
              </div>
            )}

            <div className="br-prog-grid">
              {shownPrograms.map((p) => (
                <ProgramCard key={p.name} p={p} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 03 · МАССАЖИ ВСЕГО ТЕЛА */}
      {massagesFull.length > 0 && (
        <section className="sec br-sec br-bg2" id="massages">
          <div className="wrap">
            <p className="eyebrow rv">{t('Массаж')}</p>
            <h2 className="h2 serif rv">{t('Массажи всего тела')}</h2>
            <p className="lead rv br-sec__intro">{t('Классические тайские техники и авторские массажи — на выбор длительности и цены.')}</p>
            <div className="br-svc-grid">
              {shownMassages.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
            {massagesFull.length > POPULAR && (
              <div className="br-more rv">
                <button className="btn btn-ghost" onClick={() => setShowAllMassages((v) => !v)}>
                  {showAllMassages ? t('Свернуть') : t('Смотреть все массажи')} ({massagesFull.length})
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 04 · PREMIUM МАССАЖИ */}
      {massagesPremium.length > 0 && (
        <section className="sec br-sec" id="premium">
          <div className="wrap">
            <p className="eyebrow rv">Premium</p>
            <h2 className="h2 serif rv">Premium {t('массажи')}</h2>
            <p className="lead rv br-sec__intro">{t('Особые ритуалы повышенного комфорта — работа в четыре руки, горячие камни и авторские техники.')}</p>
            <div className="br-svc-grid">
              {massagesPremium.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 05 · МАССАЖИ ПО ЗОНАМ */}
      {massagesZone.length > 0 && (
        <section className="sec br-sec br-bg2" id="zones">
          <div className="wrap">
            <p className="eyebrow rv">{t('По зонам')}</p>
            <h2 className="h2 serif rv">{t('Массажи по зонам')}</h2>
            <p className="lead rv br-sec__intro">{t('Точечная проработка — голова, шея и воротниковая зона, спина и стопы. Идеально как дополнение к основному массажу.')}</p>
            <div className="br-svc-grid">
              {massagesZone.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06 · SPA-ПРОЦЕДУРЫ */}
      {procedures.length > 0 && (
        <section className="sec br-sec" id="procedures">
          <div className="wrap">
            <p className="eyebrow rv">{t('Уход')}</p>
            <h2 className="h2 serif rv">SPA-{t('процедуры')}</h2>
            <p className="lead rv br-sec__intro">{t('Пилинги, обёртывания и омовения — тонус, мягкость и сияние кожи.')}</p>
            <div className="br-svc-grid">
              {procedures.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06 · АБОНЕМЕНТЫ */}
      <section className="sec br-sec" id="memberships">
        <div className="wrap">
          <p className="eyebrow rv">{t('Выгода')}</p>
          <h2 className="h2 serif rv">{t('Годовой абонемент')}</h2>
          <p className="lead rv br-sec__intro">{t('Приобретая годовой абонемент, вы сможете наслаждаться массажем куда чаще и выгоднее.')}</p>
          <div className="br-tiers">
            {MEMBERSHIP_TIERS.map((m) => (
              <div className={`br-tier rv ${m.name === 'Gold' ? 'is-featured' : ''}`} key={m.name}>
                {m.name === 'Gold' && <span className="br-tier__badge">{t('Популярный')}</span>}
                <div className="br-tier__name">{m.name}</div>
                <div className="br-tier__price serif">{m.price.replace(' тг.', '')}<small>₸</small></div>
                <div className="br-tier__period">/ {t(m.period)}</div>
                <a className="btn btn-sm" href={wa} target="_blank" rel="noopener noreferrer">{t('Оформить абонемент')}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · СЕРТИФИКАТ */}
      <section className="sec br-sec br-bg2" id="certificate">
        <div className="wrap br-cert">
          <div className="br-cert__text rv">
            <p className="eyebrow">{t('Подарок')}</p>
            <h2 className="h2 serif">{t('Подарочный сертификат')}</h2>
            <p className="lead">{t('Универсальный подарок для близких, друзей и коллег — сертификат действует на все услуги салона Buddha Spa. Выберите номинал и подарите заботу.')}</p>
            <div className="br-cert__actions">
              <a className="btn" href={wa} target="_blank" rel="noopener noreferrer">{t('Купить сертификат')}</a>
              <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{t('Оформить сертификат')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* 08 · VR-ТУР */}
      {branch.vrTour && (
        <section className="sec br-sec" id="vr">
          <div className="wrap">
            <p className="eyebrow rv">{t('Загляните внутрь')}</p>
            <h2 className="h2 serif rv">{t('VR-тур по SPA-салону')}</h2>
            <p className="lead rv br-sec__intro">{t('Прогуляйтесь по залам салона в 360° ещё до визита.')}</p>
            <div className="br-vr rv">
              <iframe src={branch.vrTour} title={`VR-тур Buddha Spa ${branch.city}`} allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" loading="lazy" />
            </div>
            <div className="br-more rv">
              <a className="btn btn-ghost" href={branch.vrTour} target="_blank" rel="noopener noreferrer">{t('Открыть VR-тур в полном экране')}</a>
            </div>
          </div>
        </section>
      )}

      {/* 09 · КОМАНДА */}
      {branch.team.length > 0 && (
        <section className="sec br-sec br-bg2" id="team">
          <div className="wrap">
            <p className="eyebrow rv">{t('Мастера')}</p>
            <h2 className="h2 serif rv">{t('Наши мастера из Азии')}</h2>
            <div className="br-team rv">
              {branch.team.map((m) => (
                <figure className="br-master" key={m.name}>
                  <img src={m.photo} alt={m.name} loading="lazy" />
                  <figcaption>{m.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10 · ПОЧЕМУ BUDDHA SPA */}
      <section className="sec br-sec">
        <div className="wrap br-why">
          <div className="br-why__text rv">
            <p className="eyebrow">{t('Философия бренда')}</p>
            <h2 className="h2 serif">{t('Роскошь для души и тела')}</h2>
            <p className="lead">{t(branch.aboutText)}</p>
          </div>
          <ul className="br-benefits rv">
            {GUEST_BENEFITS.map((b) => (
              <li key={b.label}><span>◇</span>{t(b.label)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 11 · ИНФОРМАЦИЯ ДЛЯ ГОСТЕЙ */}
      <section className="sec br-sec br-bg2" id="guest-info">
        <div className="wrap">
          <p className="eyebrow rv">{t('Перед визитом')}</p>
          <h2 className="h2 serif rv">{t('Информация для гостей')}</h2>
          <GuestAccordion t={t} />
        </div>
      </section>

      {/* 12 · КОНТАКТЫ / ЗАПИСЬ */}
      <section className="sec br-sec br-contacts" id="contacts">
        <div className="wrap br-contacts__inner rv">
          <div>
            <h2 className="h2 serif">{t('Записаться в')} Buddha Spa</h2>
            <p className="lead">{branch.fullAddress} · {t(branch.hours)}</p>
          </div>
          <div className="br-contacts__actions">
            <button className="btn" onClick={() => setLead({})}>{t('Записаться')}</button>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a className="btn btn-ghost" href={telHref(branch.phone)}>{branch.phone}</a>
            <a className="btn btn-ghost" href={`https://yandex.ru/maps/?text=${encodeURIComponent('Buddha Spa ' + branch.fullAddress)}`} target="_blank" rel="noopener noreferrer">{t('На карте')}</a>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="br-sticky">
        <button className="btn" onClick={() => setLead({})}>{t('Записаться')}</button>
        <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>

      {detail && (
        <ServiceDetailModal service={detail} onClose={() => setDetail(null)} onBook={bookFromDetail} />
      )}
      {lead && <LeadModal branch={branch} service={lead.service} onClose={() => setLead(null)} />}
    </div>
  )
}

// Compact photo card — used for massages (full-body, premium, by-zone) and
// SPA-процедуры. Photo + name + short blurb + durations + "от" price + CTA.
function ServiceCard({ s, t, onDetail, onBook }) {
  return (
    <article className={`br-scard rv ${s.premium ? 'is-premium' : ''}`}>
      <div className="br-scard__media" onClick={() => onDetail(s)}>
        <div className="br-scard__img" style={{ backgroundImage: `url(${s.image})` }} />
        <div className="br-scard__shade" />
        {s.premium && <span className="br-scard__badge">Premium</span>}
        <span className="br-scard__peek">{t('Подробнее')}</span>
      </div>
      <div className="br-scard__body">
        <h3 className="serif">{t(s.name)}</h3>
        {s.description && <p className="br-scard__desc">{t(s.description)}</p>}
        <div className="br-scard__meta">
          {s.durationLabel && <span className="br-scard__dur">{s.durationLabel}</span>}
          <span className="br-scard__price">{s.priceFromLabel}</span>
        </div>
        <div className="br-scard__foot">
          <button className="br-link" onClick={() => onDetail(s)}>{t('Подробнее')}</button>
          <button className="btn btn-sm" onClick={() => onBook(s)}>{t('Записаться')}</button>
        </div>
      </div>
    </article>
  )
}

// Large card for SPA-программы — bigger photo, "что входит" preview.
function ProgramCard({ p, t, onDetail, onBook }) {
  return (
    <article className="br-pcard rv">
      <div className="br-pcard__media" onClick={() => onDetail(p)}>
        <div className="br-pcard__img" style={{ backgroundImage: `url(${p.image})` }} />
        <div className="br-pcard__shade" />
        <span className="br-pcard__badge">SPA</span>
        <div className="br-pcard__over">
          <h3 className="serif">{t(p.name)}</h3>
          <div className="br-pcard__meta">
            {p.durationLabel && <span>{p.durationLabel}</span>}
            <b>{p.priceFromLabel}</b>
          </div>
        </div>
      </div>
      <div className="br-pcard__body">
        {p.composition.length > 0 ? (
          <>
            <p className="br-pcard__lbl">{t('В программу входит')}</p>
            <ul className="br-pcard__list">
              {p.composition.slice(0, 5).map((c, i) => <li key={i}><span>◇</span>{t(c)}</li>)}
              {p.composition.length > 5 && (
                <li className="br-pcard__more"><span>◇</span>+{p.composition.length - 5} {t('этапов')}</li>
              )}
            </ul>
          </>
        ) : (
          p.description && <p className="br-pcard__desc">{t(p.description)}</p>
        )}
        <div className="br-pcard__foot">
          <button className="br-link" onClick={() => onDetail(p)}>{t('Подробнее')}</button>
          <button className="btn btn-sm" onClick={() => onBook(p)}>{t('Записаться')}</button>
        </div>
      </div>
    </article>
  )
}

// Branch-scoped accordion reusing the shared guest-info content.
function GuestAccordion({ t }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="br-acc rv">
      {GUEST_INFO.map((item, i) => {
        const isOpen = open === i
        return (
          <div className={`br-acc__item ${isOpen ? 'is-open' : ''}`} key={item.title}>
            <button className="br-acc__trigger" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{t(item.title)}</span>
              <span className="br-acc__icon" aria-hidden="true" />
            </button>
            <div className="br-acc__panel">
              <div className="br-acc__inner">
                {item.body.map((p) => <p key={p}>{t(p)}</p>)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
