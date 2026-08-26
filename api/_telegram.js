// Shared Telegram helper for the serverless API. Files starting with "_" are
// NOT routed as endpoints by Vercel, so this is a private library module.
//
// The bot token lives ONLY here (server-side env). It is never shipped to the
// browser, HTML, React bundle or git. See .env.example / DEPLOY.md.
//
// Env:
//   TELEGRAM_BOT_TOKEN            – bot token from @BotFather
//   TELEGRAM_CHAT_ID              – common fallback chat id
//   TELEGRAM_<BRANCH>_CHAT_ID     – optional per-branch chat id (see BRANCH_ENV)

// Branch slug (from src/data/branches.js) -> per-branch chat-id env var name.
// None are required: a missing one falls back to TELEGRAM_CHAT_ID.
const BRANCH_ENV = {
  nursat: 'TELEGRAM_NURSAT_CHAT_ID',
  tulpar: 'TELEGRAM_TULPAR_CHAT_ID',
  kunaeva: 'TELEGRAM_KUNAEVA_CHAT_ID',
  taukehana: 'TELEGRAM_TAUKE_HANA_CHAT_ID',
  taraz: 'TELEGRAM_TARAZ_CHAT_ID',
  turan: 'TELEGRAM_ASTANA_CHAT_ID', // Астана · Туран
  aktobe: 'TELEGRAM_AKTOBE_CHAT_ID',
  franchise: 'TELEGRAM_FRANCHISE_CHAT_ID',
}

export function botToken() {
  return process.env.TELEGRAM_BOT_TOKEN || ''
}

// Resolve the target chat id for a branch, falling back to the common chat.
export function resolveChatId(branchSlug) {
  const envKey = BRANCH_ENV[branchSlug]
  const perBranch = envKey ? process.env[envKey] : ''
  return (perBranch || process.env.TELEGRAM_CHAT_ID || '').trim()
}

// Escape for Telegram HTML parse mode.
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Build the notification text. Only fields that actually have a value are
// rendered — absent fields (e.g. дата/время when the form has no such input)
// are omitted rather than invented.
export function buildLeadMessage(lead) {
  const rows = [
    ['👤 Имя', lead.name],
    ['📞 Телефон', lead.phone],
    ['📍 Филиал', lead.branchLabel],
    ['💆 Услуга', lead.service],
    ['⏱ Длительность', lead.duration],
    ['📅 Дата', lead.date],
    ['🕐 Время', lead.time],
    ['💬 Комментарий', lead.comment],
    ['🌐 Страница', lead.pageUrl],
    ['🧭 Источник', lead.source],
  ]
  const blocks = rows
    .filter(([, v]) => v && String(v).trim())
    .map(([label, v]) => `${label}:\n${esc(v)}`)
  return ['🔔 <b>НОВАЯ ЗАЯВКА</b>', '', blocks.join('\n\n')].join('\n')
}

// Low-level send. Throws on Telegram API error.
export async function sendMessage(token, chatId, text) {
  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok || !data.ok) {
    throw new Error(data.description || `Telegram HTTP ${resp.status}`)
  }
  return data.result
}
