import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const Ctx = createContext({ isEditMode: false, isAdmin: false, toggle: () => {} })

export function EditModeProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAdmin(!!session)
      if (!session) setIsEditMode(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Listen for postMessage from admin panel to toggle edit mode
  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== window.location.origin) return
      if (e.data?.type === 'SET_EDIT_MODE') setIsEditMode(e.data.value)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const toggle = () => setIsEditMode((v) => !v)

  return <Ctx.Provider value={{ isEditMode, isAdmin, toggle }}>{children}</Ctx.Provider>
}

export function useEditMode() {
  return useContext(Ctx)
}
