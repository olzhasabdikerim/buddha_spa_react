export default function SectionTransition({ flip = false, fromBg = 'var(--bg2)', toBg = 'var(--bg)' }) {
  const bg = flip
    ? `linear-gradient(180deg, ${toBg} 0%, ${fromBg} 100%)`
    : `linear-gradient(180deg, ${fromBg} 0%, ${toBg} 100%)`
  return <div aria-hidden="true" style={{ height: 120, background: bg }} />
}
