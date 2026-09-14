import { useState } from 'react'

export default function Login({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await onSignIn(email, password)
    if (err) setError(err.message)
    setLoading(false)
  }

  return (
    <div className="adm-login">
      <form className="adm-login__box" onSubmit={submit}>
        <div className="adm-login__logo">BuddhaSpa</div>
        <div className="adm-login__sub">Панель управления</div>
        <label className="adm-login__label">Email</label>
        <input className="adm-login__input" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        <label className="adm-login__label">Пароль</label>
        <input className="adm-login__input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="adm-login__btn" disabled={loading}>{loading ? 'Вход...' : 'Войти'}</button>
        {error && <div className="adm-login__err">{error}</div>}
      </form>
    </div>
  )
}
