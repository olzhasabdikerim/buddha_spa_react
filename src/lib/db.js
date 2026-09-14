// Data layer: Supabase → fallback to static branches.js
// The shape returned is identical to what branches.js exports,
// so all existing components work without changes.

import { supabase } from './supabase.js'
import { BRANCHES as STATIC_BRANCHES } from '../data/branches.js'

function toBranch(row, masters, services) {
  return {
    slug:        row.slug,
    gis:         row.gis || '',
    city:        row.city,
    name:        row.name,
    premium:     row.premium || false,
    address:     row.address || '',
    fullAddress: row.full_address || '',
    phone:       row.phone || '',
    whatsapp:    row.whatsapp || '',
    hours:       row.hours || '',
    hero:        row.hero || '',
    vrTour:      row.vr_tour || '',
    aboutText:   row.about_text || '',
    gallery:     row.gallery || [],
    comingSoon:  row.coming_soon || false,
    team:        masters.map((m) => ({ name: m.name, photo: m.photo })),
    services:    services.map((s) => ({
      id:          s.id,
      branch_id:   s.branch_id,
      category:    s.category || null,
      name:        s.name,
      price:       s.price,
      duration:    s.duration,
      description: s.description || undefined,
      section:     s.section || null,
      image_url:   s.image_url || null,
    })),
  }
}

export async function fetchBranches() {
  try {
    const [{ data: rows, error: bErr }, { data: allMasters, error: mErr }, { data: allServices, error: sErr }] =
      await Promise.all([
        supabase.from('branches').select('*').order('sort_order'),
        supabase.from('masters').select('*').order('id'),
        supabase.from('services').select('*').order('sort_order'),
      ])

    if (bErr || mErr || sErr) throw bErr || mErr || sErr

    return rows.map((row) =>
      toBranch(
        row,
        (allMasters || []).filter((m) => m.branch_id === row.id),
        (allServices || []).filter((s) => s.branch_id === row.id),
      )
    )
  } catch (err) {
    console.warn('[db] Supabase недоступен, используем статические данные:', err?.message)
    return STATIC_BRANCHES
  }
}
