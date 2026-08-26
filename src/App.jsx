import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import LegalModal from './components/LegalModal.jsx'
import HomePage from './pages/HomePage.jsx'
import BranchPage from './pages/BranchPage.jsx'
import FranchisePage from './pages/FranchisePage.jsx'

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
  const { pathname } = useLocation()
  // The franchise page is a self-contained landing with its own nav & footer.
  const isFranchise = pathname === '/franchise'

  return (
    <>
      <ScrollManager />
      {!isFranchise && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/:slug" element={<BranchPage />} />
        </Routes>
      </main>
      {!isFranchise && <Footer onOpenLegal={setLegalSlug} />}
      {legalSlug && <LegalModal slug={legalSlug} onClose={() => setLegalSlug(null)} />}
    </>
  )
}
