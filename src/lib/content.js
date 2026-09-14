import { supabase } from './supabase.js'

export async function fetchContent() {
  const { data } = await supabase.from('content').select('key,value')
  const map = {}
  ;(data || []).forEach((row) => { map[row.key] = row.value })
  return map
}

export async function upsertContent(key, value) {
  const { error } = await supabase.from('content').upsert({ key, value })
  if (error) console.error('[content] upsert error', error)
  return !error
}
