// Lightweight per-page SEO for the SPA (no react-helmet dependency).
// Sets <title>, meta description, Open Graph tags and a JSON-LD LocalBusiness
// block for a branch, and restores the site defaults on unmount.

const SITE = 'https://buddhaspa.kz'
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
