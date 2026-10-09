import Hero from '../components/Hero.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import AppSection from '../components/AppSection.jsx'
import About from '../components/About.jsx'
import Benefits from '../components/Benefits.jsx'
import FAQ from '../components/FAQ.jsx'
import AiChat from '../components/AiChat.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BranchSelector />
      <AppSection />
      <About />
      <Benefits />
      <FAQ />
      <AiChat />
    </>
  )
}
