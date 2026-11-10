import { useState } from 'react'
import { api } from '../api'
import { usePaged } from '../usePaged'
import Pager from '../components/Pager'

const empty = { title: '', content: '' }

export default function Notes() {
  const notes = usePaged('/notes')
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api(`/notes/${editingId}`, { method: 'PUT', body: form })
      } else {
        await api('/notes', { method: 'POST', body: form })
      }
      setForm(empty)
      setEditingId(null)
      if (notes.page === 1) notes.reload()
      else notes.setPage(1)
    } catch (err) {
      setError(err.message)
    }
  }

  function edit(note) {
    setEditingId(note._id)
    setForm({ title: note.title, content: note.content })
  }

  async function remove(id) {
    if (!confirm('Delete this note?')) return
    await api(`/notes/${id}`, { method: 'DELETE' })
    notes.reload()
  }

  return (
    <div>
      <h2>My notes</h2>

      <form className="card" onSubmit={save}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Write something..."
          rows={3}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button type="submit">{editingId ? 'Update note' : 'Add note'}</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(empty) }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {notes.error && <p className="error">{notes.error}</p>}
      {notes.loading ? (
        <p>Loading...</p>
      ) : notes.data.length === 0 ? (
        <p>No notes yet.</p>
      ) : (
        notes.data.map((note) => (
          <div className="card" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            <div className="row">
              <button onClick={() => edit(note)}>Edit</button>
              <button className="danger" onClick={() => remove(note._id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      <Pager page={notes.page} hasMore={notes.hasMore} onChange={notes.setPage} />
    </div>
  )
}
