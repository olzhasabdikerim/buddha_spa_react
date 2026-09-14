import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { fetchContent, upsertContent } from '../lib/content.js'
import { useLang } from '../i18n.jsx'

const Ctx = createContext({ content: {}, update: async () => false })

export function ContentProvider({ children }) {
  const [content, setContent] = useState({})

  useEffect(() => {
    fetchContent().then(setContent)
  }, [])

  const update = useCallback(async (key, value) => {
    // Optimistic update: show change immediately in preview
    setContent((prev) => ({ ...prev, [key]: value }))

    // Persist to Supabase in background
    const ok = await upsertContent(key, value)
    if (!ok) {
      // Revert if save failed — reload from DB
      fetchContent().then(setContent)
    }
    return ok
  }, [])

  return <Ctx.Provider value={{ content, update }}>{children}</Ctx.Provider>
}

export function useContentContext() {
  return useContext(Ctx)
}

// Returns the value for a content key for the current UI language.
// Lookup order: content[key.{lang}] → content[key] → fallback
export function useContent(key, fallback = '') {
  const { content } = useContentContext()
  const { lang } = useLang()
  if (lang === 'ru') return content[key] ?? fallback
  return content[`${key}.${lang}`] ?? content[key] ?? fallback
}
