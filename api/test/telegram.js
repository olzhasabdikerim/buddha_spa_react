// Vercel serverless function: POST /api/test/telegram
// Sends a fixed test message to the common Telegram chat to verify that the
// TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID configuration works. No secrets are
// returned in the response.

import { botToken, resolveChatId, sendMessage } from '../_telegram.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const token = botToken()
  // Allow ?branch=<slug> to test a per-branch chat; defaults to the common chat.
  const branch = String(req.query?.branch || '').trim()
  const chatId = resolveChatId(branch)

  if (!token || !chatId) {
    return res.status(500).json({
      ok: false,
      error: 'Telegram is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.',
    })
  }

  try {
    await sendMessage(token, chatId, '✅ Buddha Spa Telegram integration works')
    return res.status(200).json({ ok: true, sent: true })
  } catch (e) {
    return res.status(502).json({ ok: false, error: e.message })
  }
}
