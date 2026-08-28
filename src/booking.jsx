import { createContext, useContext } from 'react'

// Opens the global "Записаться" form (branch selector + booking). Provided by
// App; consumed by every "Записаться" / "Выбрать филиал" CTA across the site.
const BookingContext = createContext(() => {})

export function BookingProvider({ open, children }) {
  return <BookingContext.Provider value={open}>{children}</BookingContext.Provider>
}

export function useBooking() {
  return useContext(BookingContext)
}
