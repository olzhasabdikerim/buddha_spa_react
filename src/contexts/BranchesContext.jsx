import { createContext, useContext, useEffect, useState } from 'react'
import { fetchBranches } from '../lib/db.js'
import { BRANCHES as STATIC_BRANCHES } from '../data/branches.js'

// null = still loading; STATIC_BRANCHES = Supabase failed (fallback)
const Ctx = createContext(null)

export function BranchesProvider({ children }) {
  const [branches, setBranches] = useState(null)

  useEffect(() => {
    fetchBranches()
      .then(setBranches)
      .catch(() => setBranches(STATIC_BRANCHES))
  }, [])

  return <Ctx.Provider value={branches}>{children}</Ctx.Provider>
}

export function useBranches() {
  return useContext(Ctx)
}
