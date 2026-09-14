// Миграция данных из branches.js → Supabase
// Запуск: node seed.mjs

import { createClient } from '@supabase/supabase-js'
import { BRANCHES } from './src/data/branches.js'

const supabase = createClient(
  'https://wizsgxebawiknjfidqnr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpenNneGViYXdpa25qZmlkcW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMjQ0NTIsImV4cCI6MjEwNDcwMDQ1Mn0.ZPM74hsiG_BiJQyffgLZdfMcek4QgCtobi9SilewBYo'
)

async function seed() {
  console.log('🚀 Начинаем миграцию...\n')

  for (let i = 0; i < BRANCHES.length; i++) {
    const b = BRANCHES[i]

    // 1. Вставляем филиал
    const { data: branch, error: bErr } = await supabase
      .from('branches')
      .insert({
        slug:         b.slug,
        city:         b.city,
        name:         b.name,
        premium:      b.premium || false,
        address:      b.address || '',
        full_address: b.fullAddress || '',
        phone:        b.phone || '',
        whatsapp:     b.whatsapp || '',
        hours:        b.hours || '',
        hero:         b.hero || '',
        vr_tour:      b.vrTour || '',
        gis:          b.gis || '',
        about_text:   b.aboutText || '',
        gallery:      b.gallery || [],
        coming_soon:  b.comingSoon || false,
        sort_order:   i,
      })
      .select('id')
      .single()

    if (bErr) { console.error(`❌ Филиал ${b.slug}:`, bErr.message); continue }
    console.log(`✅ Филиал: ${b.name} (id=${branch.id})`)

    // 2. Мастера
    if (b.team?.length) {
      const masters = b.team.map((m) => ({ branch_id: branch.id, name: m.name, photo: m.photo || '' }))
      const { error: mErr } = await supabase.from('masters').insert(masters)
      if (mErr) console.error(`  ⚠️  Мастера:`, mErr.message)
      else console.log(`  👤 Мастеров: ${masters.length}`)
    }

    // 3. Услуги
    if (b.services?.length) {
      const services = b.services.map((s, idx) => ({
        branch_id:   branch.id,
        category:    s.category || null,
        name:        s.name,
        price:       s.price || '',
        duration:    s.duration || '',
        description: s.description || null,
        sort_order:  idx,
      }))
      const { error: sErr } = await supabase.from('services').insert(services)
      if (sErr) console.error(`  ⚠️  Услуги:`, sErr.message)
      else console.log(`  💆 Услуг: ${services.length}`)
    }
  }

  console.log('\n✅ Миграция завершена!')
}

seed().catch(console.error)
