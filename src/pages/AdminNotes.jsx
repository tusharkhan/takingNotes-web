import { usePaged } from '../usePaged'
import Pager from '../components/Pager'

export default function AdminNotes() {
  const notes = usePaged('/admin/notes')

  return (
    <div>
      <h2>Everyone's notes</h2>

      {notes.error && <p className="error">{notes.error}</p>}
      {notes.loading ? (
        <p>Loading...</p>
      ) : notes.data.length === 0 ? (
        <p>No notes.</p>
      ) : (
        notes.data.map((note) => (
          <div className="card" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>
              by {note.owner?.name || 'deleted user'} ({note.owner?.email}) ·{' '}
              {new Date(note.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}

      <Pager page={notes.page} hasMore={notes.hasMore} onChange={notes.setPage} />
    </div>
  )
}
