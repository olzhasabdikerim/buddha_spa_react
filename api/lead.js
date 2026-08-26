// Vercel serverless function: receives a lead from the site form, creates one
// Bitrix24 lead (single common funnel, branch marked in the title/comment) and
// sends a Telegram notification to the branch-specific chat.
//
// Secrets live ONLY here via environment variables (never in the frontend):
//   BITRIX_WEBHOOK       – incoming webhook base, e.g. https://xxx.bitrix24.kz/rest/1/abcdef/
//   TELEGRAM_BOT_TOKEN   – Telegram bot token from @BotFather
//   TELEGRAM_CHAT_ID     – common fallback chat id
//   TELEGRAM_*_CHAT_ID   – optional per-branch chat ids (see api/_telegram.js)
//
// See .env.example and DEPLOY.md.

import { botToken, resolveChatId, buildLeadMessage, sendMessage } from './_telegram.js'

const RU_LABELS = {
  name: 'Имя',
  phone: 'Телефон',
  city: 'Город',
  branch: 'Филиал',
  service: 'Услуга',
  comment: 'Комментарий',
}

// Best-effort in-memory rate limit. Survives only within a warm instance, which
// is enough to blunt bursts; the honeypot is the primary spam guard.
const HITS = new Map()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

function rateLimited(ip) {
  const now = Date.now()
  const arr = (HITS.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  HITS.set(ip, arr)
  return arr.length > MAX_PER_WINDOW
}

function sanitizePhone(raw) {
  return String(raw || '').replace(/[^\d+]/g, '').slice(0, 20)
}

async function createBitrixLead(base, lead) {
  const url = base.replace(/\/+$/, '') + '/crm.lead.add.json'
  const fields = {
    TITLE: `Заявка с сайта — ${lead.branchLabel}${lead.service ? ` · ${lead.service}` : ''}`,
    NAME: lead.name,
    SOURCE_ID: 'WEB',
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'WORK' }],
    COMMENTS: [
      `${RU_LABELS.branch}: ${lead.branchLabel}`,
      lead.city ? `${RU_LABELS.city}: ${lead.city}` : null,
      lead.service ? `${RU_LABELS.service}: ${lead.service}` : null,
      lead.comment ? `${RU_LABELS.comment}: ${lead.comment}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: 'Y' } }),
  })
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok || data.error) {
    throw new Error(data.error_description || data.error || `Bitrix HTTP ${resp.status}`)
  }
  return data.result
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

  // Vercel parses JSON bodies automatically; guard for string bodies too.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  body = body || {}

  // Honeypot: real users never fill this hidden field.
  if (body.company) {
    return res.status(200).json({ ok: true })
  }

  const name = String(body.name || '').trim().slice(0, 120)
  const phone = sanitizePhone(body.phone)
  if (!name || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ ok: false, error: 'Укажите имя и корректный телефон' })
  }

  const lead = {
    name,
    phone,
    city: String(body.city || '').trim().slice(0, 80),
    branchSlug: String(body.branchSlug || '').trim().slice(0, 40),
    branchLabel: String(body.branchLabel || body.city || 'Не указан').trim().slice(0, 120),
    service: String(body.service || '').trim().slice(0, 160),
    duration: String(body.duration || '').trim().slice(0, 80),
    date: String(body.date || '').trim().slice(0, 40),
    time: String(body.time || '').trim().slice(0, 40),
    comment: String(body.comment || '').trim().slice(0, 1000),
    pageUrl: String(body.pageUrl || '').trim().slice(0, 300),
    source: String(body.source || '').trim().slice(0, 160),
  }

  const results = { bitrix: null, telegram: null }
  const errors = []

  // Telegram first: it's the channel we least want to lose.
  const token = botToken()
  const chatId = resolveChatId(lead.branchSlug)
  if (token && chatId) {
    try {
      await sendMessage(token, chatId, buildLeadMessage(lead))
      results.telegram = 'sent'
    } catch (e) {
      errors.push(`telegram: ${e.message}`)
    }
  } else {
    errors.push('telegram: not configured')
  }

  const bitrixBase = process.env.BITRIX_WEBHOOK
  if (bitrixBase) {
    try {
      results.bitrix = await createBitrixLead(bitrixBase, lead)
    } catch (e) {
      errors.push(`bitrix: ${e.message}`)
    }
  } else {
    errors.push('bitrix: not configured')
  }

  // Success for the user as long as at least one channel accepted the lead.
  const delivered = results.telegram === 'sent' || results.bitrix != null
  if (!delivered) {
    console.error('Lead delivery failed:', errors.join('; '))
    return res.status(502).json({ ok: false, error: 'Не удалось отправить заявку. Попробуйте позже.' })
  }

  if (errors.length) console.warn('Lead partial delivery:', errors.join('; '))
  return res.status(200).json({ ok: true })
}
