import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LegalModal from './components/LegalModal.jsx'
import LeadModal from './components/LeadModal.jsx'
import ContactFab from './components/ContactFab.jsx'
import { BookingProvider } from './booking.jsx'
import { BranchesProvider, useBranches } from './contexts/BranchesContext.jsx'
import { ContentProvider } from './contexts/ContentContext.jsx'
import { EditModeProvider } from './contexts/EditModeContext.jsx'
import HomePage from './pages/HomePage.jsx'
import BranchPage from './pages/BranchPage.jsx'

// Route-level code splitting: home and branch pages load eagerly (they're the
// main ad-landing targets); the heavier, secondary pages are fetched on demand.
const FranchisePage = lazy(() => import('./pages/FranchisePage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const SurveyPage = lazy(() => import('./pages/SurveyPage.jsx'))
const MasterPage = lazy(() => import('./pages/MasterPage.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

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

function AppInner() {
  const branches = useBranches()
  const [legalSlug, setLegalSlug] = useState(null)
  const [bookOpen, setBookOpen] = useState(false)
  const { pathname } = useLocation()
  // The franchise page is a self-contained landing with its own nav & footer.
  const isFranchise = pathname === '/franchise'
  const isAdmin = pathname.startsWith('/admin')
  // Branch pages render their own BranchHeader with section tabs.
  const isBranch = (branches || []).some((b) => pathname === `/${b.slug}`)
  // Survey/master pages are standalone — no nav, footer or floating buttons.
  const isSurvey = pathname.startsWith('/opros/') || pathname.startsWith('/master/')

  return (
    <BookingProvider open={() => setBookOpen(true)}>
      <ScrollManager />
      {!isFranchise && !isBranch && !isSurvey && !isAdmin && <Header onBook={() => setBookOpen(true)} />}
      <main>
        <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/opros/:branchSlug" element={<SurveyPage />} />
            <Route path="/master/:branchSlug" element={<MasterPage />} />
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/:slug" element={<BranchPage />} />
          </Routes>
        </Suspense>
      </main>
      {!isFranchise && !isSurvey && !isAdmin && <Footer onOpenLegal={setLegalSlug} />}
      {!isFranchise && !isSurvey && !isAdmin && <ContactFab />}
      {legalSlug && <LegalModal slug={legalSlug} onClose={() => setLegalSlug(null)} />}
      {!isSurvey && !isAdmin && bookOpen && <LeadModal branches={branches || []} onClose={() => setBookOpen(false)} />}
    </BookingProvider>
  )
}

export default function App() {
  return (
    <ContentProvider>
      <EditModeProvider>
        <BranchesProvider>
          <AppInner />
        </BranchesProvider>
      </EditModeProvider>
    </ContentProvider>
  )
}
