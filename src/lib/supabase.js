import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail loudly instead of a blank page when Supabase env vars are missing
// (e.g. fresh clone without .env.local). See .env.example.
if (!url || !key) {
  const missing = [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean).join(', ')
  const message =
    `[supabase] Missing env: ${missing}. ` +
    'Add them to .env.local (see .env.example) and restart the dev server.'
  if (import.meta.env.DEV) {
    const root = document.getElementById('root')
    if (root) {
      root.innerHTML = '<pre style="padding:24px;white-space:pre-wrap;font:14px/1.5 monospace;color:#b00020"></pre>'
      root.firstChild.textContent = message
    }
  }
  throw new Error(message)
}

export const supabase = createClient(url, key)
