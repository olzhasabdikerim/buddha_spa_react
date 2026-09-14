import { MAIN_TR } from './src/i18n.jsx'
import { FRANCHISE_TR } from './src/data/franchiseTranslations.js'
import { SERVICE_TR } from './src/data/serviceTranslations.js'
import { EXTRA_TR } from './src/data/extraTranslations.js'
import { LEAD_TR } from './src/data/leadTranslations.js'
import { FAQ_TR } from './src/data/faqTranslations.js'
import { BRANCH_TR } from './src/data/branchTranslations.js'
import { COMPOSITION_TR } from './src/data/compositionTranslations.js'
import { AUTO_TR } from './src/data/autoTranslations.js'
import { BRANCHES } from './src/data/branches.js'
import { writeFileSync } from 'fs'

const dict = (lang) => ({
  ...MAIN_TR[lang], ...(SERVICE_TR[lang] || {}), ...(EXTRA_TR[lang] || {}),
  ...(FRANCHISE_TR[lang] || {}), ...(LEAD_TR[lang] || {}), ...(FAQ_TR[lang] || {}),
  ...(BRANCH_TR[lang] || {}), ...(COMPOSITION_TR[lang] || {}), ...(AUTO_TR[lang] || {}),
})
const kk = dict('kk'), en = dict('en')

// mirror catalog.js parseComposition()
function parseComposition(description) {
  if (!description) return []
  const parts = String(description).split(/\s*[;•]\s*|\s+—\s+/).map((p) => p.trim()).filter(Boolean)
  return parts.length > 1 ? parts : []
}

const steps = new Set()
BRANCHES.forEach((b) => (b.services || []).forEach((s) => {
  parseComposition(s.description).forEach((step) => steps.add(step))
}))

const isCyr = (s) => /[а-яА-ЯёЁ]/.test(s)
const all = [...steps].filter(isCyr)
const missEN = all.filter((k) => en[k] === undefined)
const missKK = all.filter((k) => kk[k] === undefined)
console.log('UNIQUE STEPS:', all.length, '| MISSING EN:', missEN.length, '| MISSING KK:', missKK.length)
const union = [...new Set([...missEN, ...missKK])]
writeFileSync('./missing-steps.json', JSON.stringify(union, null, 1))
console.log('union missing:', union.length)
