import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EditableText } from './EditableText.jsx'
import { EditableServiceField } from './EditableServiceField.jsx'
import { useEditMode } from '../contexts/EditModeContext.jsx'
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

export default function BranchDetail({ branch, onBook }) {
  const t = useT()
  const { isEditMode } = useEditMode()
  const { programs, massagesFull, massagesPremium, massagesZone, procedures, goalsPresent } =
    buildBranchCatalog(branch.services || [])
  const branchLabel = branch.name || branch.address
  const waText = (msg) => `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(msg)}`
  const wa = waText(`Здравствуйте! Пишу с сайта BuddhaSpa — ${branch.city}, ${branchLabel}.`)
  const gisUrl = branch.gis || `https://2gis.kz/search/${encodeURIComponent('Buddha Spa ' + branch.city + ' ' + branchLabel)}`
  const waCert = waText(`Здравствуйте! Хочу оформить подарочный сертификат BuddhaSpa — ${branch.city}, ${branchLabel}.`)
  const waMember = waText(`Здравствуйте! Хочу оформить годовой абонемент BuddhaSpa — ${branch.city}, ${branchLabel}.`)
  const [lead, setLead] = useState(null)
  const [detail, setDetail] = useState(null)
  const [goal, setGoal] = useState('all')
  const [showAllMassages, setShowAllMassages] = useState(false)

  useEffect(() => applyBranchSeo(branch), [branch])
  useReveal([branch.slug, goal, showAllMassages])

  // Allow parent (BranchHeader) to open the booking modal
  useEffect(() => {
    if (onBook) onBook.open = () => setLead({})
  }, [onBook])

  const bookService = (s) => ({
    name: s.name, description: s.description, duration: s.durationLabel,
    price: s.priceFromLabel, image: s.image, priceNum: s.priceFromNum, variants: s.variants || [],
  })
  const openDetail = (s) => setDetail(s)
  const openLead = (s) => setLead({ service: bookService(s) })
  const bookFromDetail = (s) => { setDetail(null); openLead(s) }

  const shownPrograms = goal === 'all' ? programs : programs.filter((p) => p.goals.includes(goal))
  const POPULAR = 6
  const shownMassages = showAllMassages ? massagesFull : massagesFull.slice(0, POPULAR)

  return (
    <div className="br-page">
      {/* HERO */}
      <header className="br-hero" style={{ backgroundImage: `url(${branch.hero})` }}>
        <div className="br-hero__grad" />
        <div className="wrap br-hero__inner">
          <Link to="/#branches" className="br-back">← {t('Все филиалы')}</Link>
          <h1 className="br-hero__title serif">
            <EditableText
              as="span"
              contentKey={branch.comingSoon ? `branch.${branch.slug}.hero.coming_soon` : `branch.${branch.slug}.hero.title`}
              fallback={branch.comingSoon ? t('Филиал готовится к открытию') : t('Тайский массаж и уход за телом')}
            />
          </h1>
          {branch.comingSoon && (
            <p className="br-hero__sub">
              {t('Скоро BuddhaSpa открывается в вашем городе. Оставьте контакты — сообщим об открытии и специальных условиях первыми.')}
            </p>
          )}
          <div className="br-hero__actions">
            <button className="btn" onClick={() => setLead({})}>
              {branch.comingSoon ? t('Узнать об открытии') : t('Записаться')}
            </button>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{t('Написать в WhatsApp')}</a>
            <a className="btn btn-ghost btn-2gis" href={gisUrl} target="_blank" rel="noopener noreferrer">
              <img src="/images/app/2gis-icon.jpg" alt="2ГИС" className="btn-2gis__icon" />
              {t('Мы в 2ГИС')}
            </a>
          </div>
          <div className="br-hero__meta">
            <span><b>{t('Адрес')}</b> {t(branch.fullAddress)}</span>
            <a href={telHref(branch.phone)}><b>{t('Телефон')}</b> {branch.phone}</a>
            <span><b>{t('Часы')}</b> {t(branch.hours)}</span>
          </div>
        </div>
      </header>

      {branch.comingSoon ? (
        <section className="sec br-sec" id="coming-soon">
          <div className="wrap">
            <div className="br-booking rv">
              <div className="br-booking__text">
                <p className="eyebrow">{t('Скоро открытие')}</p>
                <h2 className="h2 serif">{t('BuddhaSpa скоро в')} {t(branch.city)}</h2>
                <p className="br-booking__meta">{t(branch.aboutText)}</p>
              </div>
              <div className="br-booking__actions">
                <button className="btn" onClick={() => setLead({})}>{t('Узнать об открытии')}</button>
                <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
      ) : branch.needsData && (
        <div className="br-notice wrap">
          {t('Страница филиала наполняется. Актуальные цены и состав программ уточняйте у администратора или в WhatsApp.')}
        </div>
      )}

      {/* СПА-ПРОГРАММЫ */}
      {programs.length > 0 && (
        <section className="sec br-sec" id="programs">
          <div className="wrap">
            <p className="eyebrow rv">{t('Главное')}</p>
            <h2 className="h2 serif rv">SPA-{t('программы')}</h2>
            <EditableText as="p" contentKey="section.programs.intro" fallback={t('Комплексные ритуалы: прогрев, пилинг, массаж и уход — от расслабления до перезагрузки. Выберите цель, остальное доверьте мастерам.')} className="lead rv br-sec__intro" />
            {goalsPresent.length > 0 && (
              <div className="br-filters rv">
                <button className={`br-chip ${goal === 'all' ? 'is-active' : ''}`} onClick={isEditMode ? undefined : () => setGoal('all')}>
                  <EditableText as="span" contentKey="goal.all.title" fallback={t('Все программы')} />
                </button>
                {goalsPresent.map((g) => (
                  <button key={g.key} className={`br-chip ${goal === g.key ? 'is-active' : ''}`} onClick={isEditMode ? undefined : () => setGoal(g.key)}>
                    <EditableText as="span" contentKey={`goal.${g.key}.title`} fallback={t(g.title)} />
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

      {/* МАССАЖИ ВСЕГО ТЕЛА */}
      {massagesFull.length > 0 && (
        <section className="sec br-sec br-bg2" id="massages">
          <div className="wrap">
            <p className="eyebrow rv">{t('Массаж')}</p>
            <h2 className="h2 serif rv">{t('Массажи всего тела')}</h2>
            <EditableText as="p" contentKey="section.massages.intro" fallback={t('Классические тайские техники и авторские массажи — на выбор длительности и цены.')} className="lead rv br-sec__intro" />
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

      {/* PREMIUM МАССАЖИ */}
      {massagesPremium.length > 0 && (
        <section className="sec br-sec" id="premium">
          <div className="wrap">
            <p className="eyebrow rv">Premium</p>
            <h2 className="h2 serif rv">Premium {t('массажи')}</h2>
            <EditableText as="p" contentKey="section.premium.intro" fallback={t('Особые ритуалы повышенного комфорта — работа в четыре руки, горячие камни и авторские техники.')} className="lead rv br-sec__intro" />
            <div className="br-svc-grid">
              {massagesPremium.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* МАССАЖИ ПО ЗОНАМ */}
      {massagesZone.length > 0 && (
        <section className="sec br-sec br-bg2" id="zones">
          <div className="wrap">
            <p className="eyebrow rv">{t('По зонам')}</p>
            <h2 className="h2 serif rv">{t('Массажи по зонам')}</h2>
            <EditableText as="p" contentKey="section.zones.intro" fallback={t('Точечная проработка — голова, шея и воротниковая зона, спина и стопы. Идеально как дополнение к основному массажу.')} className="lead rv br-sec__intro" />
            <div className="br-svc-grid">
              {massagesZone.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SPA-ПРОЦЕДУРЫ */}
      {procedures.length > 0 && (
        <section className="sec br-sec" id="procedures">
          <div className="wrap">
            <p className="eyebrow rv">{t('Уход')}</p>
            <h2 className="h2 serif rv">SPA-{t('процедуры')}</h2>
            <EditableText as="p" contentKey="section.procedures.intro" fallback={t('Пилинги, обёртывания и омовения — тонус, мягкость и сияние кожи.')} className="lead rv br-sec__intro" />
            <div className="br-svc-grid">
              {procedures.map((m) => (
                <ServiceCard key={m.name} s={m} t={t} onDetail={openDetail} onBook={openLead} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* АБОНЕМЕНТЫ */}
      {!branch.comingSoon && (
        <section className="sec br-sec" id="memberships">
          <div className="wrap">
            <EditableText as="p" contentKey="section.memberships.eyebrow" fallback={t('Выгода')} className="eyebrow rv" />
            <EditableText as="h2" contentKey="section.memberships.title" fallback={t('Годовой абонемент')} className="h2 serif rv" />
            <EditableText as="p" contentKey="section.memberships.intro" fallback={t('Приобретая годовой абонемент, вы сможете наслаждаться массажем куда чаще и выгоднее.')} className="lead rv br-sec__intro" />
            <div className="br-tiers">
              {MEMBERSHIP_TIERS.map((m) => {
                const tk = m.name.toLowerCase()
                return (
                  <div className={`br-tier rv br-tier--${m.theme}${m.featured ? ' is-featured' : ''}`} key={m.name}>
                    {m.featured && <span className="br-tier__badge">{t('Популярный выбор')}</span>}
                    <div className="br-tier__ornament">
                      <span className="br-tier__orn-line" />
                      <span className="br-tier__orn-diamond" />
                      <span className="br-tier__orn-line" />
                    </div>
                    <div className="br-tier__name">{m.name}</div>
                    <div className="br-tier__accent-line" />
                    <EditableText as="div" contentKey={`tier.${tk}.subtitle`} fallback={t(m.subtitle)} className="br-tier__subtitle" />
                    <div className="br-tier__discount-block">
                      <EditableText as="div" contentKey={`tier.${tk}.discount`} fallback={m.discount} translate={false} className="br-tier__discount-num" />
                      <EditableText as="div" contentKey={`tier.${tk}.discount_sub`} fallback={t('скидка на все услуги')} className="br-tier__discount-sub" />
                    </div>
                    <div className="br-tier__divider">
                      <span className="br-tier__div-line" />
                      <span className="br-tier__div-dot" />
                      <span className="br-tier__div-line" />
                    </div>
                    <ul className="br-tier__items">
                      {m.items.map((item, i) => (
                        <li key={item}><span><EditableText as="span" contentKey={`tier.${tk}.item.${i}`} fallback={t(item)} /></span></li>
                      ))}
                    </ul>
                    <div className="br-tier__price-block">
                      <div>
                        <div className="br-tier__price-label">{t('Стоимость')}</div>
                        <div className="br-tier__old-price"><EditableText as="span" contentKey={`tier.${tk}.old_price`} fallback={m.oldPrice} translate={false} /> ₸</div>
                        <div className="br-tier__price serif"><EditableText as="span" contentKey={`tier.${tk}.price`} fallback={m.price} translate={false} /> <small>₸</small></div>
                      </div>
                      <div className="br-tier__period-lbl">/ {t('год')}</div>
                    </div>
                    <EditableText as="div" contentKey={`tier.${tk}.slogan`} fallback={t(m.slogan)} className="br-tier__slogan" />
                    <a className="btn btn-sm br-tier__btn" href={waMember} target="_blank" rel="noopener noreferrer">{t('Оформить абонемент')}</a>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* СЕРТИФИКАТ */}
      {!branch.comingSoon && (
        <section className="sec br-sec br-bg2" id="certificate">
          <div className="wrap br-cert">
            <div className="br-cert__text rv">
              <EditableText as="p" contentKey="section.cert.eyebrow" fallback={t('Подарок')} className="eyebrow" />
              <EditableText as="h2" contentKey="section.cert.title" fallback={t('Подарочный сертификат')} className="h2 serif" />
              <EditableText as="p" contentKey="section.cert.lead" fallback={t('Универсальный подарок для близких, друзей и коллег — сертификат действует на все услуги салона Buddha Spa. Выберите номинал и подарите заботу.')} className="lead" />
              <div className="br-cert__actions">
                <a className="btn" href={waCert} target="_blank" rel="noopener noreferrer">{t('Купить сертификат')}</a>
              </div>
            </div>
            <div className="br-cert__photos rv">
              <img src="/images/cert/cert-a.jpg" alt="Подарочный сертификат Buddha Spa" className="br-cert__photo br-cert__photo--main" />
              <img src="/images/cert/cert-b.jpg" alt="Подарочные наборы Buddha Spa" className="br-cert__photo br-cert__photo--b" />
            </div>
          </div>
        </section>
      )}

      {/* VR-ТУР */}
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

      {/* КОМАНДА */}
      {branch.team.length > 0 && (
        <section className="sec br-sec br-bg2" id="masters">
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

      {/* ПОЧЕМУ BUDDHA SPA */}
      <section className="sec br-sec">
        <div className="wrap br-why">
          <div className="br-why__text rv">
            <EditableText as="p" contentKey="section.why.eyebrow" fallback={t('Философия бренда')} className="eyebrow" />
            <EditableText as="h2" contentKey="section.why.title" fallback={t('Роскошь для души и тела')} className="h2 serif" />
            <EditableText as="p" contentKey={`branch.${branch.slug}.about`} fallback={t(branch.aboutText)} className="lead" />
          </div>
          <ul className="br-benefits rv">
            {GUEST_BENEFITS.map((b, i) => (
              <li key={b.label}><span>◇</span><EditableText as="span" contentKey={`benefit.${i}.label`} fallback={t(b.label)} /></li>
            ))}
          </ul>
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
  const { isEditMode } = useEditMode()
  return (
    <article className={`br-scard rv ${s.premium ? 'is-premium' : ''}`}>
      <div className="br-scard__media" onClick={isEditMode ? undefined : () => onDetail(s)}>
        <div className="br-scard__img" style={{ backgroundImage: `url(${s.image})` }} />
        <div className="br-scard__shade" />
        {s.premium && <span className="br-scard__badge">Premium</span>}
        {!isEditMode && <span className="br-scard__peek">{t('Подробнее')}</span>}
      </div>
      <div className="br-scard__body">
        <EditableServiceField as="h3" className="serif"
          branchId={s.branchId} serviceName={s.name} field="name" value={s.name} />
        {(s.description || isEditMode) && (
          <EditableServiceField as="p" className="br-scard__desc"
            branchId={s.branchId} serviceName={s.name} field="description"
            value={s.description || ''} />
        )}
        <div className="br-scard__meta">
          {s.durationLabel && <span className="br-scard__dur">{s.durationLabel.replace(/мин/g, t('мин'))}</span>}
          {isEditMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {s.variants.map((v, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {v.duration && <span style={{ fontSize: 12, color: '#888', minWidth: 60 }}>{v.duration} мин</span>}
                  <EditableServiceField
                    as="span" className="br-scard__price"
                    serviceId={v.id} branchId={s.branchId} serviceName={s.name}
                    field="price" value={v.rawPrice}
                  />
                </div>
              ))}
            </div>
          ) : (
            <span className="br-scard__price">{s.priceFromLabel}</span>
          )}
        </div>
        <div className="br-scard__foot">
          {!isEditMode && <button className="br-link" onClick={() => onDetail(s)}>{t('Подробнее')}</button>}
          {!isEditMode && <button className="btn btn-sm" onClick={() => onBook(s)}>{t('Записаться')}</button>}
        </div>
      </div>
    </article>
  )
}

// Large card for SPA-программы — bigger photo, "что входит" preview.
function ProgramCard({ p, t, onDetail, onBook }) {
  const { isEditMode } = useEditMode()
  return (
    <article className="br-pcard rv">
      <div className="br-pcard__media" onClick={isEditMode ? undefined : () => onDetail(p)}>
        <div className="br-pcard__img" style={{ backgroundImage: `url(${p.image})` }} />
        <div className="br-pcard__shade" />
        <span className="br-pcard__badge">SPA</span>
        <div className="br-pcard__over">
          <EditableServiceField as="h3" className="serif"
            branchId={p.branchId} serviceName={p.name} field="name" value={p.name} />
          <div className="br-pcard__meta">
            {p.durationLabel && <span>{p.durationLabel.replace(/мин/g, t('мин'))}</span>}
            {isEditMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {p.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {v.duration && <span style={{ fontSize: 12, opacity: 0.7 }}>{v.duration} мин</span>}
                    <EditableServiceField as="b"
                      serviceId={v.id} branchId={p.branchId} serviceName={p.name}
                      field="price" value={v.rawPrice} />
                  </div>
                ))}
              </div>
            ) : (
              <b>{p.priceFromLabel}</b>
            )}
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
          <EditableServiceField as="p" className="br-pcard__desc"
            branchId={p.branchId} serviceName={p.name} field="description"
            value={p.description || ''} />
        )}
        <div className="br-pcard__foot">
          {!isEditMode && <button className="br-link" onClick={() => onDetail(p)}>{t('Подробнее')}</button>}
          {!isEditMode && <button className="btn btn-sm" onClick={() => onBook(p)}>{t('Записаться')}</button>}
        </div>
      </div>
    </article>
  )
}

// Branch-scoped accordion reusing the shared guest-info content.
function GuestAccordion({ t }) {
  const [open, setOpen] = useState(-1)
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
