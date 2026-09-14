// Vercel serverless function: receives a post-visit survey response
// and saves it to Google Sheets via Apps Script webhook (SURVEY_SHEETS_WEBHOOK).

const RATE_HITS = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const arr = (RATE_HITS.get(ip) || []).filter((t) => now - t < 60_000)
  arr.push(now)
  RATE_HITS.set(ip, arr)
  return arr.length > 3
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
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  body = body || {}

  const name = String(body.name || '').trim().slice(0, 120)
  const phone = String(body.phone || '').replace(/[^\d+]/g, '').slice(0, 20)
  const branchSlug = String(body.branchSlug || '').trim().slice(0, 40)

  if (!name || phone.replace(/\D/g, '').length < 11 || !branchSlug) {
    return res.status(400).json({ ok: false, error: 'Заполните обязательные поля' })
  }

  const clamp = (v, min, max) => Math.min(max, Math.max(min, Number(v) || 0))

  const data = {
    type: 'review',
    name,
    phone,
    branchSlug,
    branchName: String(body.branchName || '').trim().slice(0, 100),
    visitRating: clamp(body.visitRating, 1, 5),
    visitComment: String(body.visitComment || '').trim().slice(0, 500),
    runnerRating: clamp(body.runnerRating, 1, 5),
    cleanRating: clamp(body.cleanRating, 1, 5),
    cleanComment: String(body.cleanComment || '').trim().slice(0, 500),
    atmosRating: clamp(body.atmosRating, 1, 5),
    atmosComment: String(body.atmosComment || '').trim().slice(0, 500),
    nps: clamp(body.nps, 0, 10),
    visitType: String(body.visitType || '').trim().slice(0, 40),
    disappointment: String(body.disappointment || '').trim().slice(0, 1000),
  }

  const sheetsUrl = (process.env.SURVEY_SHEETS_WEBHOOK || '').trim()
  if (!sheetsUrl) {
    console.error('Survey: SURVEY_SHEETS_WEBHOOK not configured')
    return res.status(502).json({ ok: false, error: 'Сервис временно недоступен' })
  }

  try {
    const r = await fetch(sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!r.ok) {
      throw new Error(`Sheets HTTP ${r.status}`)
    }
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Survey: Sheets send failed:', e.message)
    return res.status(502).json({ ok: false, error: 'Не удалось сохранить отзыв. Попробуйте позже.' })
  }
}
