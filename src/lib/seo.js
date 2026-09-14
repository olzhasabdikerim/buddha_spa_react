// Lightweight per-page SEO for the SPA (no react-helmet dependency).
// Sets <title>, meta description, Open Graph tags and a JSON-LD LocalBusiness
// block for a branch, and restores the site defaults on unmount.

const SITE = 'https://www.buddhaspa.kz'
const DEFAULT_TITLE = 'BuddhaSpa — тайский массаж и уход за телом'
const DEFAULT_DESC = 'BuddhaSpa — сеть спа-салонов тайского массажа и оздоровительных процедур в Казахстане. Шымкент, Тараз, Астана.'

function setMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setJsonLd(id, data) {
  let el = document.getElementById(id)
  if (data == null) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function applyFranchiseSeo() {
  const title = 'Франшиза Buddha Spa — тайский массаж и SPA в Казахстане | Инвестиции от 80 млн ₸'
  const desc = 'Франшиза премиального спа-салона Buddha Spa в Казахстане. 10 работающих салонов, мастера из Юго-Восточной Азии, полное операционное управление. Открытие в Алматы, Астане, Шымкенте, Актобе, Актау, Атырау, Семей, Кызылорде. Срок окупаемости 24–36 мес. Роялти нет (формат Партнёр). Оставьте заявку — расчёт за 30 минут.'
  const url = `${SITE}/franchise`
  const image = `${SITE}/images/franchise/lp/hero.jpg`

  document.title = title
  setMeta('name', 'description', desc)
  setMeta('name', 'keywords', [
    'франшиза', 'франшиза спа', 'франшиза спа салона', 'франшиза buddha spa',
    'спа', 'спа салон', 'спа казахстан', 'спа салон казахстан',
    'массаж', 'тайский массаж', 'тайский массаж франшиза казахстан',
    'расслабление', 'отдых', 'отдых и расслабление', 'wellness',
    'открыть бизнес', 'открыть спа салон', 'готовый бизнес',
    'инвестиции', 'инвестиции спа казахстан', 'spa бизнес казахстан',
    'spa франшиза казахстан', 'франшиза массажного салона',
    'франшиза алматы', 'франшиза астана', 'франшиза шымкент',
    'франшиза актобе', 'франшиза актау', 'франшиза атырау', 'франшиза семей',
    'франшиза кызылорда', 'франшиза павлодар', 'франшиза костанай', 'франшиза уральск',
    'франшиза петропавловск', 'франшиза усть-каменогорск', 'франшиза тараз',
    'wellness франшиза казахстан', 'тайский массаж бизнес',
    'buddha spa franchise kazakhstan', 'буддha спа франшиза',
  ].join(', '))
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:type', 'website')
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', image)
  setMeta('property', 'og:locale', 'ru_RU')
  setMeta('name', 'twitter:card', 'summary_large_image')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', desc)

  const CITIES = [
    { name: 'Алматы', region: 'KZ-75' },
    { name: 'Астана', region: 'KZ-71' },
    { name: 'Шымкент', region: 'KZ-79' },
    { name: 'Актобе', region: 'KZ-15' },
    { name: 'Тараз', region: 'KZ-31' },
    { name: 'Атырау', region: 'KZ-23' },
    { name: 'Актау', region: 'KZ-27' },
    { name: 'Семей', region: 'KZ-63' },
    { name: 'Уральск', region: 'KZ-27' },
    { name: 'Кызылорда', region: 'KZ-35' },
    { name: 'Павлодар', region: 'KZ-55' },
    { name: 'Петропавловск', region: 'KZ-59' },
    { name: 'Усть-Каменогорск', region: 'KZ-63' },
    { name: 'Костанай', region: 'KZ-39' },
  ]

  setJsonLd('ld-franchise', {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: desc,
    url,
    image,
    inLanguage: 'ru',
    publisher: {
      '@type': 'Organization',
      name: 'Buddha Spa',
      url: SITE,
      logo: `${SITE}/images/franchise/lp/logo.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+7-701-989-80-01',
        contactType: 'sales',
        areaServed: 'KZ',
        availableLanguage: ['Russian', 'Kazakh'],
      },
      sameAs: ['https://buddhaspa.kz'],
    },
    mainEntity: {
      '@type': 'Service',
      name: 'Франшиза Buddha Spa',
      serviceType: 'Franchise',
      provider: { '@type': 'Organization', name: 'Buddha Spa' },
      areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name, containedInPlace: { '@type': 'Country', name: 'Казахстан' } })),
      description: desc,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'KZT',
        price: '80000000',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: '80000000', priceCurrency: 'KZT' },
        description: 'Стартовые инвестиции от 80 млн ₸. Формат «Партнёр» — без роялти, 50/50. Формат «Франшиза» — роялти 7%, паушальный взнос 7 млн ₸.',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Buddha Spa', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Франшиза', item: url },
      ],
    },
  })

  return () => {
    document.title = DEFAULT_TITLE
    setMeta('name', 'description', DEFAULT_DESC)
    setMeta('name', 'keywords', '')
    setJsonLd('ld-franchise', null)
  }
}

export function applyBranchSeo(branch) {
  const priceFrom = cheapest(branch.services)
  const title = `BuddhaSpa — тайский массаж и SPA в ${branch.city} · ${branch.address}`
  const desc = `Тайский массаж, SPA-программы и уход за телом в BuddhaSpa, ${branch.fullAddress}. ${branch.hours}. Запись онлайн и в WhatsApp.`
  const url = `${SITE}/${branch.slug}`
  const image = SITE + branch.hero

  document.title = title
  setMeta('name', 'description', desc)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:type', 'business.business')
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', image)
  setMeta('name', 'twitter:card', 'summary_large_image')

  setJsonLd('ld-branch', {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: `BuddhaSpa — ${branch.city}, ${branch.address}`,
    image,
    url,
    telephone: branch.phone,
    priceRange: priceFrom ? `от ${priceFrom} ₸` : '₸₸',
    address: {
      '@type': 'PostalAddress',
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressCountry: 'KZ',
    },
    openingHours: 'Mo-Su 11:00-23:00',
    sameAs: [SITE],
  })

  return () => {
    document.title = DEFAULT_TITLE
    setMeta('name', 'description', DEFAULT_DESC)
    setJsonLd('ld-branch', null)
  }
}

function cheapest(services = []) {
  let min = Infinity
  services.forEach((s) => {
    const n = parseInt(String(s.price).replace(/[^\d]/g, ''), 10)
    if (n && n < min) min = n
  })
  if (min === Infinity) return null
  return min.toLocaleString('ru-RU')
}
