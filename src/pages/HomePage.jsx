import Hero from '../components/Hero.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import About from '../components/About.jsx'
import Benefits from '../components/Benefits.jsx'
import FAQ from '../components/FAQ.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BranchSelector />
      <About />
      <Benefits />
      <FAQ />
    </>
  )
}
