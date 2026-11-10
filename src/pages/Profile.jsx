import { useState } from 'react'
import { api } from '../api'
import { useAuth } from '../AuthContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user.name)
  const [interests, setInterests] = useState((user.interests || []).join(', '))
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function save(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const body = {
        name,
        interests: interests.split(',').map((i) => i.trim()).filter(Boolean),
      }
      if (password) body.password = password
      const updated = await api('/users/me', { method: 'PUT', body })
      updateUser(updated)
      setPassword('')
      setMessage('Profile saved')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card narrow">
      <h2>Profile</h2>
      <p>{user.email}</p>
      <form onSubmit={save}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Interests (comma separated)</label>
        <input value={interests} onChange={(e) => setInterests(e.target.value)} />
        <label>New password (leave empty to keep)</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
