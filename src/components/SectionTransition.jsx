// Minimal premium divider between large sections. Not an <hr>, not a big empty
// band: a soft tonal gradient with a hairline and a tiny lotus diamond in the
// centre. Stays in the BuddhaSpa dark-brown palette. Purely decorative.
export default function SectionTransition({ flip = false }) {
  return (
    <div className={`sec-transition ${flip ? 'is-flip' : ''}`} aria-hidden="true">
      <span className="sec-transition__line" />
      <span className="sec-transition__mark" />
      <span className="sec-transition__line" />
    </div>
  )
}
