import Hero from '../components/Hero.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import About from '../components/About.jsx'
import Benefits from '../components/Benefits.jsx'
import GuestInfo from '../components/GuestInfo.jsx'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BranchSelector />
      <About />
      <Benefits />
      <GuestInfo />
    </>
  )
}
