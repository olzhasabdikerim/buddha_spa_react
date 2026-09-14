import { useEffect, useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const show = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  return { toast, show }
}

export function Toast({ toast }) {
  if (!toast) return null
  return <div className={`adm-toast adm-toast--${toast.type}`}>{toast.msg}</div>
}
