// Vercel serverless function: receives a master rating
// and saves it to Google Sheets via Apps Script webhook (SURVEY_SHEETS_WEBHOOK).

const RATE_HITS = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const arr = (RATE_HITS.get(ip) || []).filter((t) => now - t < 60_000)
  arr.push(now)
  RATE_HITS.set(ip, arr)
  return arr.length > 5
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body || {}

  const name = String(body.name || '').trim().slice(0, 120)
  const phone = String(body.phone || '').replace(/[^\d+]/g, '').slice(0, 20)
  const branchSlug = String(body.branchSlug || '').trim().slice(0, 40)
  const master = String(body.master || '').trim().slice(0, 120)

  if (!name || phone.replace(/\D/g, '').length < 11 || !branchSlug || !master) {
    return res.status(400).json({ ok: false, error: 'Заполните обязательные поля' })
  }

  const clamp = (v, min, max) => Math.min(max, Math.max(min, Number(v) || 0))

  const data = {
    type: 'master',
    name,
    phone,
    branchSlug,
    branchName: String(body.branchName || '').trim().slice(0, 100),
    master,
    masterRating: clamp(body.masterRating, 1, 5),
    masterQualRating: clamp(body.masterQualRating, 1, 5),
    comment: String(body.comment || '').trim().slice(0, 1000),
  }

  const sheetsUrl = (process.env.SURVEY_SHEETS_WEBHOOK || '').trim()
  if (!sheetsUrl) {
    console.error('Master: SURVEY_SHEETS_WEBHOOK not configured')
    return res.status(502).json({ ok: false, error: 'Сервис временно недоступен' })
  }

  try {
    const r = await fetch(sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!r.ok) throw new Error(`Sheets HTTP ${r.status}`)
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Master: Sheets send failed:', e.message)
    return res.status(502).json({ ok: false, error: 'Не удалось сохранить оценку. Попробуйте позже.' })
  }
}
