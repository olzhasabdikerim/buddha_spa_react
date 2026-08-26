import { useState } from 'react'

// Infers a section for services that don't carry an explicit category (Shymkent price list).
function inferCategory(name) {
  const n = name.toLowerCase()
  if (/двои|гармони|инь-?янь|тайский рай|family|родител|возрожден|для вас и ваших|беременн|для детей|дет(ей|ям)/.test(n)) {
    return 'Программы для двоих и семьи'
  }
  if (/пилинг|омовени|обертыван|скрабирован|уход за лицом/.test(n)) {
    return 'Спа-процедуры и пилинги'
  }
  if (/масса|терапи|little buddha|походка|уход/.test(n)) {
    return 'Массажи'
  }
  return 'Спа-программы'
}

// Preferred display order of sections.
const ORDER = [
  'Спа-программы', 'Спа программы',
  'Программы для двоих и семьи',
  'Массажи',
  'Спа-процедуры и пилинги', 'Спа процедуры',
]

function groupByCategory(services) {
  const map = new Map()
  services.forEach((s) => {
    const key = s.category || inferCategory(s.name)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(s)
  })
  return Array.from(map.entries()).sort((a, b) => {
    const ia = ORDER.indexOf(a[0])
    const ib = ORDER.indexOf(b[0])
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
}

export default function PriceList({ services }) {
  const groups = groupByCategory(services)
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="accordion price-accordion">
      {groups.map(([category, items], i) => {
        const isOpen = openIndex === i
        return (
          <div className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={category}>
            <button
              type="button"
              className="accordion__trigger"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <span>
                {category} <span className="price-accordion__count">{items.length}</span>
              </span>
              <span className="accordion__icon" aria-hidden="true" />
            </button>
            <div className="accordion__panel">
              <div className="accordion__panel-inner">
                <table className="price-table">
                  <tbody>
                    {items.map((s, idx) => (
                      <tr key={`${s.name}-${s.duration}-${idx}`}>
                        <td className="price-table__name">
                          {s.name}
                          {s.description && <span className="price-table__desc">{s.description}</span>}
                        </td>
                        <td className="price-table__duration">{s.duration || ''}</td>
                        <td className="price-table__price">{s.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
