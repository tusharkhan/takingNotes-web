import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { usePaged } from '../usePaged'
import Pager from '../components/Pager'

const empty = { name: '', email: '', password: '', role: 'user', interests: '' }

export default function AdminUsers() {
  const { user: me } = useAuth()
  const users = usePaged('/admin/users')
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function edit(u) {
    setEditingId(u._id)
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') })
  }

  function reset() {
    setEditingId(null)
    setForm(empty)
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    const body = {
      name: form.name,
      email: form.email,
      role: form.role,
      interests: form.interests.split(',').map((i) => i.trim()).filter(Boolean),
    }
    if (form.password) body.password = form.password

    try {
      if (editingId) {
        await api(`/admin/users/${editingId}`, { method: 'PUT', body })
      } else {
        await api('/admin/users', { method: 'POST', body })
      }
      reset()
      users.reload()
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(u) {
    if (!confirm(`Delete ${u.name}? Their notes and posts will be removed too.`)) return
    try {
      await api(`/admin/users/${u._id}`, { method: 'DELETE' })
      users.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2>Manage users</h2>

      <form className="card" onSubmit={save}>
        <h3>{editingId ? 'Edit user' : 'Add user'}</h3>
        <div className="grid">
          <input name="name" placeholder="Name" value={form.name} onChange={change} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
          <input
            name="password"
            type="password"
            placeholder={editingId ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={change}
            required={!editingId}
          />
          <select name="role" value={form.role} onChange={change}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <input name="interests" placeholder="Interests, comma separated" value={form.interests} onChange={change} />
        </div>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={reset}>Cancel</button>}
        </div>
      </form>

      {users.error && <p className="error">{users.error}</p>}
      {users.loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Interests</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.interests.join(', ')}</td>
                <td className="row">
                  <Link to={`/users/${u._id}/posts`}>Posts</Link>
                  <button onClick={() => edit(u)}>Edit</button>
                  {u._id !== me._id && (
                    <button className="danger" onClick={() => remove(u)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pager page={users.page} hasMore={users.hasMore} onChange={users.setPage} />
    </div>
  )
}
