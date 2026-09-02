import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LegalModal from './components/LegalModal.jsx'
import LeadModal from './components/LeadModal.jsx'
import ContactFab from './components/ContactFab.jsx'
import { BookingProvider } from './booking.jsx'
import { BRANCHES } from './data/branches.js'
import HomePage from './pages/HomePage.jsx'
import BranchPage from './pages/BranchPage.jsx'

// Route-level code splitting: home and branch pages load eagerly (they're the
// main ad-landing targets); the heavier, secondary pages are fetched on demand.
const FranchisePage = lazy(() => import('./pages/FranchisePage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))

// Scrolls to top on route change, or to the #anchor when a hash is present.
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  const [legalSlug, setLegalSlug] = useState(null)
  const [bookOpen, setBookOpen] = useState(false)
  const { pathname } = useLocation()
  // The franchise page is a self-contained landing with its own nav & footer.
  const isFranchise = pathname === '/franchise'
  // Branch pages render their own BranchHeader with section tabs.
  const isBranch = BRANCHES.some((b) => pathname === `/${b.slug}`)

  return (
    <BookingProvider open={() => setBookOpen(true)}>
      <ScrollManager />
      {!isFranchise && !isBranch && <Header onBook={() => setBookOpen(true)} />}
      <main>
        <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/:slug" element={<BranchPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isFranchise && <Footer onOpenLegal={setLegalSlug} />}
      {!isFranchise && <ContactFab />}
      {legalSlug && <LegalModal slug={legalSlug} onClose={() => setLegalSlug(null)} />}
      {bookOpen && <LeadModal branches={BRANCHES} onClose={() => setBookOpen(false)} />}
    </BookingProvider>
  )
}
