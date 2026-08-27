import Hero from '../components/Hero.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import About from '../components/About.jsx'
import Benefits from '../components/Benefits.jsx'
import GuestInfo from '../components/GuestInfo.jsx'
import SectionTransition from '../components/SectionTransition.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BranchSelector />
      <About />
      <SectionTransition />
      <Benefits />
      <GuestInfo />
    </>
  )
}
