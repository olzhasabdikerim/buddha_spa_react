// Builds the branch catalog for the redesigned, photo-led service cards.
//
// The old version rendered plain text cards. This one:
//   • preserves every real duration/price variant (nothing invented),
//   • assigns each service a REAL Buddha Spa photo from /public/images
//     (extracted from the same Tilda export as the rest of the site),
//   • splits the branch's services into the five commercial groups the
//     redesign asks for:
//
//       programs        — SPA-ПРОГРАММЫ        (big photo cards)
//       massagesFull    — МАССАЖИ ВСЕГО ТЕЛА
//       massagesPremium — PREMIUM МАССАЖИ       (gold-framed cards)
//       massagesZone    — МАССАЖИ ПО ЗОНАМ
//       procedures      — SPA-ПРОЦЕДУРЫ
//
// Grouping/classification is derived from the real data already present on
// each branch (data/branches.js) — no new services, prices or durations.

// ── Real per-service Buddha Spa photography ──────────────────────────────────
// Each pair is a service name and its OWN photo, lifted straight from the
// Buddha Spa Tilda store catalog (the same image the live site shows on that
// service) and self-hosted under /public/images/services. Nothing is invented.
const SERVICE_PHOTOS = [
  ['Family Day', '/images/services/tild6266-6265-4338-b764-643562386136.jpg'],
  ['Foot Массаж', '/images/services/tild6237-3933-4365-a666-386263363461.jpg'],
  ['Foot массаж', '/images/services/tild6237-3933-4365-a666-386263363461.jpg'],
  ['Little Buddha', '/images/services/tild3230-6439-4064-b465-363936323965.jpg'],
  ['Oil массаж', '/images/services/tild3061-6539-4761-a134-333936663037.jpg'],
  ['VIP - пакет Гармония двоих', '/images/services/tild6638-3638-4465-a166-356530653064.jpg'],
  ['Антистресс', '/images/services/tild3231-6565-4639-a639-633364636635.jpg'],
  ['Арома массаж', '/images/services/tild3434-3136-4235-b039-386462636637.jpg'],
  ['Для взрослых', '/images/services/tild3632-3665-4632-b963-383963343937.png'],
  ['Для родителей', '/images/services/tild3932-3433-4733-a337-363830393439.png'],
  ['Инь-Янь', '/images/services/tild6539-3835-4663-a431-336236363532.jpg'],
  ['Кокосовый пилинг', '/images/services/tild3836-3830-4435-a333-383539366534.jpg'],
  ['Королевский Массаж', '/images/services/tild6233-3038-4437-b166-336334636666.jpg'],
  ['Коррекция фигуры', '/images/services/tild3034-3835-4637-b161-376137613838.jpg'],
  ['Кофейный пилинг', '/images/services/tild3038-3864-4565-b737-353730656438.jpg'],
  ['Легкая походка', '/images/services/tild3136-3132-4136-b761-366563373365.jpg'],
  ['Массаж головы', '/images/services/tild3464-3433-4638-b638-636363653533.jpg'],
  ['Массаж для беременных', '/images/services/tild6638-3065-4833-a163-383165393566.jpg'],
  ['Массаж для детей с 6 лет', '/images/services/tild3230-6439-4064-b465-363936323965.jpg'],
  ['Массаж ног и спины', '/images/services/tild3463-3733-4639-b935-323462343632.jpg'],
  ['Массаж спины', '/images/services/tild3734-3835-4237-b131-663066326639.jpg'],
  ['Массаж шейно-воротниковой зоны', '/images/services/tild6666-3836-4631-a338-386463393635.jpg'],
  ['Медицинский массаж', '/images/services/tild3135-6431-4366-a631-353466303037.jpg'],
  ['Микс массажа с травяными мешочками', '/images/services/tild3138-3535-4232-a339-313961326434.jpg'],
  ['Микс пакет', '/images/services/tild6662-6437-4933-b530-393237303134.jpg'],
  ['Моделирующий массаж', '/images/services/tild3264-3665-4861-a336-623039346431.jpg'],
  ['Морской бриз', '/images/services/tild3065-3938-4030-a562-666336326332.jpg'],
  ['Мудрость 60+', '/images/services/tild6130-3932-4334-b665-626331646435.jpg'],
  ['Обертывание', '/images/services/tild6562-3066-4631-b833-336232396534.jpg'],
  ['Очищающий пилинг', '/images/services/tild6162-3931-4161-b532-343436323933.jpg'],
  ['Пенное омовение', '/images/services/tild3164-6365-4538-a139-393865393933.jpg'],
  ['Пилинг 4 этапный', '/images/services/tild3663-3035-4635-b666-633362326134.jpg'],
  ['Пробуди любовь к себе', '/images/services/tild6134-6333-4934-b935-666164333732.png'],
  ['Пробуждение', '/images/services/tild3938-3463-4137-b263-396431383266.jpg'],
  ['Райское наслаждение', '/images/services/tild3966-6436-4134-b132-323762323033.jpg'],
  ['СПА для беременных', '/images/services/tild6534-6635-4736-b965-303037353836.jpg'],
  ['СПА для вас и ваших родителей', '/images/services/tild6264-3239-4336-a461-386361626539.jpg'],
  ['СПА программа для вас и ваших детей', '/images/services/tild3763-3735-4364-b536-653436623265.jpg'],
  ['Скрабирование', '/images/services/tild6632-3561-4439-a665-363732336463.jpg'],
  ['Спа-день Перезагрузка', '/images/services/tild3737-3538-4631-b964-323035326365.jpg'],
  ['Спортивный массаж', '/images/services/tild6335-6136-4438-a531-623163353630.jpg'],
  ['Стоун терапия', '/images/services/tild3262-6631-4638-a531-393132656662.jpg'],
  ['Тайский рай', '/images/services/tild3530-6131-4264-b062-626537643462.jpg'],
  ['Тайский рай на двоих', '/images/services/tild3463-3261-4561-b561-356165303131.jpg'],
  ['Тибет', '/images/services/tild3862-3662-4933-a438-663332346262.jpg'],
  ['Уход за лицом', '/images/services/tild6165-3433-4736-b265-613134626137.jpg'],
  ['Шведский массаж', '/images/services/tild6364-3963-4439-b135-333565333132.jpg'],
  ['Шоколадный пилинг', '/images/services/tild3165-3131-4531-a631-303233623666.jpg'],
  ['Шоколадный рай', '/images/services/tild3535-3739-4639-b631-303863363430.jpg'],
  ['Экспресс СПА восстановление', '/images/services/tild6666-6337-4632-b262-306161316532.jpg'],
  ['спа для мамочек', '/images/services/tild6333-6133-4630-b037-303836623663.jpg'],
]

// Normalise a service name for fuzzy matching: lowercase, keep letters/digits.
function norm(name) {
  return String(name).toLowerCase().replace(/[^0-9a-zа-яё]+/gi, '')
}

const PHOTO_BY_NORM = new Map(SERVICE_PHOTOS.map(([n, p]) => [norm(n), p]))
const photoByName = (n) => PHOTO_BY_NORM.get(norm(n))

// Longest common prefix length of two strings.
function lcp(a, b) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

// Keyword fallback for the few branch services with no catalog photo of their
// own — mapped to the closest real Buddha Spa service photo.
// These branch services have no catalog photo of their own, so they fall back to
// a distinct real Buddha Spa mood/interior photo (self-hosted, never reused as a
// per-service photo — so they never collide with a service's own image).
const FALLBACK_RULES = [
  [/традицион/i, '/images/franchise/gallery-1.jpg'],       // thai neck/shoulder massage
  [/эликсир\s*молодости|тайский\s*эликсир/i, '/images/hero-main.jpg'], // warm oil massage
  [/время\s*себе/i, '/images/franchise/lp/philosophy.jpg'], // relaxation lounge
  [/бодрост/i, '/images/branches/kunaeva/gallery-1.jpg'],   // steam / hammam
  [/двойной\s*удар/i, '/images/branches/turan/gallery-1.jpg'], // dramatic oil massage
  [/супер\s*сила/i, '/images/branches/taraz/gallery-4.jpg'],   // twin tables under the moon
  [/эликсир\s*будды/i, '/images/branches/goal-duo.jpg'],      // candlelit massage
  [/возрожд/i, '/images/branches/taraz/gallery-1.jpg'],       // heated marble hammam
]

const KIND_FALLBACK = {
  massage: '/images/branches/taukehana/gallery-2.jpg',
  procedure: '/images/branches/taraz/gallery-2.jpg',
  program: '/images/franchise/lp/format-2.jpg',
}

// Curated pool of professional, brand-safe photos for the service cards:
// salon interiors, tea zones, décor details and masters in uniform. Chosen to
// replace the previous per-service stock photos (some read as too suggestive
// for a premium SPA). Every card now shows atmosphere / professionalism.
const INTERIOR_POOL = [
  '/images/franchise/lp/philosophy.jpg',   // lounge / tea zone
  '/images/franchise/lp/format-2.jpg',     // lounge with Buddha relief
  '/images/franchise/lp/it.jpg',           // tea zone details
  '/images/franchise/lp/manage-1.jpg',     // reception interior
  '/images/franchise/lp/format-1.jpg',     // Buddha statue + candle
  '/images/franchise/lp/immersive.jpg',    // masters in uniform
  '/images/franchise/gallery-1.jpg',       // guest (in towel) with a master
  '/images/franchise/gallery-2.jpg',       // masters welcoming a guest
]

// Stable hash so each service name always maps to the same pool image, while
// the whole menu spreads evenly across the pool.
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function imageFor(name, kind) {
  // Distribute deterministically across the curated interior/atmosphere pool,
  // nudged by kind so massages / procedures / programs don't all collide.
  const salt = kind === 'program' ? 3 : kind === 'procedure' ? 5 : 0
  return INTERIOR_POOL[(hashStr(name) + salt) % INTERIOR_POOL.length]
}

// ── Program goals (quick filter over SPA-программы) ──────────────────────────
export const GOALS = [
  { key: 'relax',      title: 'Расслабление',              match: /тибет|пробуди любов|пробужден|для взрослых|арома|время себе|экспресс|восстановлен|антистресс|эликсир|морской бриз/i },
  { key: 'energy',     title: 'Энергия и бодрость',        match: /перезагрузк|шоколад|микс пакет|мудрост|бодрост|двойной удар|супер сила/i },
  { key: 'shape',      title: 'Стройность, тонус и рельеф', match: /коррекц|моделирующ|шоколад|обертыван/i },
  { key: 'duo',        title: 'Программы для 2-х',          match: /инь-?янь|райское|гармони|двоих|родител|тайский рай/i },
  { key: 'pregnancy',  title: 'Спа для беременных',        match: /спа для беременных|для беременных.*спа|беременн.*спа/i },
  { key: 'family',     title: 'Для всей семьи',            match: /family|детей|мамочек|для вас и ваших|возрожден|троих/i },
]

const PROCEDURE_RE = /пенное омовение|^пилинг|4\s*этап|обертыван|очищающий пилинг|скрабирован|кокосовый пилинг|кофейный пилинг|шоколадный пилинг|уход за лицом/i

const PROGRAM_RE = /тибет|пробуди любов|перезагрузк|пробужден|для взрослых|шоколадн\w* рай|микс пакет|мудрост|коррекц фигур|инь-?янь|райское|гармони двоих|для родител|тайский рай|спа для беременных|family|морской бриз|время себе|бодрост|антистресс|эликсир будды|двойной удар|супер сила|возрожден|экспресс спа|для вас и ваших|спа программа/i

// Premium massages get the gold-framed treatment.
const PREMIUM_MASSAGE_RE = /королевск|4\s*рук|четыре\s*рук|стоун|эликсир\s*молодости|vip/i

// By-zone / short massages.
const ZONE_RE = /голов|шейно|воротник|спин|foot|фут|ног|походк/i

function priceNum(price) {
  return parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0
}

function fmtPrice(price) {
  return String(price).replace('тг.', '₸').trim()
}

// Classify a raw service into 'program' | 'procedure' | 'massage'.
function classify(s) {
  const cat = (s.category || '').toLowerCase()
  if (cat.includes('програм')) return 'program'
  if (cat.includes('процедур')) return 'procedure'
  if (cat.includes('масса')) {
    // "уход за лицом" is filed under Массажи in some branches but is a spa procedure.
    if (/уход за лицом/i.test(s.name)) return 'procedure'
    return 'massage'
  }
  // category-less data (Shymkent set): infer from the name.
  if (PROGRAM_RE.test(s.name)) return 'program'
  if (PROCEDURE_RE.test(s.name)) return 'procedure'
  return 'massage'
}

// Split a description into a "что входит" list when it is a multi-step
// composition (delimited by ; • or —). Returns [] for a plain one-line blurb.
function parseComposition(description) {
  if (!description) return []
  const parts = String(description)
    .split(/\s*[;•]\s*|\s+—\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.length > 1 ? parts : []
}

// A concise duration label, e.g. "60 / 90 / 120 мин".
function durationLabel(variants) {
  const nums = []
  variants.forEach((v) => {
    String(v.duration || '').split('/').forEach((d) => {
      const m = d.match(/\d+/)
      if (m && !nums.includes(m[0])) nums.push(m[0])
    })
  })
  if (nums.length === 0) return variants[0]?.duration || ''
  const unit = /час/i.test(variants.map((v) => v.duration).join(' ')) && nums.length === 1
    ? '' : ' мин'
  return nums.join(' / ') + unit
}

// Group same-named services into one entry carrying every duration/price variant.
function groupByName(items) {
  const byName = new Map()
  items.forEach((s) => {
    let e = byName.get(s.name)
    if (!e) {
      e = { name: s.name, description: s.description || '', variants: [] }
      byName.set(s.name, e)
    }
    if (!e.description && s.description) e.description = s.description
    // A single row may already list several durations ("60 мин. / 90 мин.") for
    // one base price. Keep it as one "от {price}" variant across that range.
    const durations = String(s.duration || '').split('/').map((d) => d.trim()).filter(Boolean)
    if (durations.length > 1) {
      e.variants.push({ duration: durations.join(' / '), price: s.price, from: true })
    } else {
      e.variants.push({ duration: s.duration || '', price: s.price })
    }
  })
  return Array.from(byName.values())
}

export function goalsFor(name) {
  return GOALS.filter((g) => g.match.test(name)).map((g) => g.key)
}

// Enrich a grouped entry with the fields the cards/modal need.
function decorate(entry, kind, premium = false) {
  const min = entry.variants.reduce((m, v) => Math.min(m, priceNum(v.price)), Infinity)
  const cheapest = entry.variants.find((v) => priceNum(v.price) === min) || entry.variants[0]
  const anyFrom = entry.variants.some((v) => v.from) || entry.variants.length > 1
  return {
    ...entry,
    kind,
    premium,
    image: imageFor(entry.name, kind),
    composition: parseComposition(entry.description),
    durationLabel: durationLabel(entry.variants),
    priceFromNum: min === Infinity ? 0 : min,
    priceFrom: fmtPrice(cheapest?.price || ''),
    priceFromLabel: (anyFrom ? 'от ' : '') + fmtPrice(cheapest?.price || ''),
    variants: entry.variants.map((v) => ({ ...v, price: fmtPrice(v.price) })),
  }
}

export function buildBranchCatalog(services = []) {
  const programsRaw = []
  const massagesRaw = []
  const proceduresRaw = []

  services.forEach((s) => {
    const kind = classify(s)
    if (kind === 'program') programsRaw.push(s)
    else if (kind === 'procedure') proceduresRaw.push(s)
    else massagesRaw.push(s)
  })

  const programs = groupByName(programsRaw)
    .map((p) => ({ ...decorate(p, 'program'), goals: goalsFor(p.name) }))
    // headline first: put composed rituals (with a "что входит") before plain ones
    .sort((a, b) => b.composition.length - a.composition.length)

  const procedures = groupByName(proceduresRaw).map((p) => decorate(p, 'procedure'))

  const massagesAll = groupByName(massagesRaw)
  const massagesPremium = massagesAll
    .filter((m) => PREMIUM_MASSAGE_RE.test(m.name))
    .map((m) => decorate(m, 'massage', true))
  const massagesZone = massagesAll
    .filter((m) => !PREMIUM_MASSAGE_RE.test(m.name) && ZONE_RE.test(m.name))
    .map((m) => decorate(m, 'massage'))
  const massagesFull = massagesAll
    .filter((m) => !PREMIUM_MASSAGE_RE.test(m.name) && !ZONE_RE.test(m.name))
    .map((m) => decorate(m, 'massage'))

  // Which goals actually have programs here (for the filter chips).
  const goalsPresent = GOALS.filter((g) => programs.some((p) => p.goals.includes(g.key)))

  return { programs, massagesFull, massagesPremium, massagesZone, procedures, goalsPresent }
}
