import { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' })
  const [error, setError] = useState('')

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        const interests = form.interests.split(',').map((i) => i.trim()).filter(Boolean)
        await register({ name: form.name, email: form.email, password: form.password, interests })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card narrow">
      <h2>{mode === 'login' ? 'Login' : 'Create account'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && (
          <input name="name" placeholder="Name" value={form.name} onChange={change} required />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} required />
        {mode === 'register' && (
          <input name="interests" placeholder="Interests, comma separated" value={form.interests} onChange={change} />
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {mode === 'login' ? "Don't have an account? " : 'Already registered? '}
        <a href="#" onClick={(e) => { e.preventDefault(); setMode(mode === 'login' ? 'register' : 'login') }}>
          {mode === 'login' ? 'Register' : 'Login'}
        </a>
      </p>
    </div>
  )
}
