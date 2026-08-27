// Makes in-page anchor links (e.g. "/#branches") work on repeat clicks.
// React Router does not re-fire navigation when the target URL equals the
// current one, so a second click on the same hash would otherwise do nothing.
// When we're already on the homepage, scroll to the target ourselves.
export function handleHashNav(e, to) {
  const hash = String(to).split('#')[1]
  if (!hash) return
  if (window.location.pathname === '/') {
    const el = document.getElementById(hash)
    if (el) {
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth' })
      // keep the URL hash in sync without adding history noise
      if (window.location.hash !== `#${hash}`) {
        window.history.replaceState(null, '', `/#${hash}`)
      }
    }
  }
}
