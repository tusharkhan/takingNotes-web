import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePaged } from '../usePaged'
import Pager from '../components/Pager'

export default function Interests() {
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('')
  const groups = usePaged(`/users/interests?interests=${encodeURIComponent(filter)}`, 5)

  function apply(e) {
    e.preventDefault()
    setFilter(input.trim())
    groups.setPage(1)
  }

  return (
    <div>
      <h2>Users grouped by interest</h2>

      <form className="row" onSubmit={apply}>
        <input
          placeholder="Filter, e.g. chess, reading (empty = all)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {groups.error && <p className="error">{groups.error}</p>}
      {groups.loading ? (
        <p>Loading...</p>
      ) : groups.data.length === 0 ? (
        <p>Nothing found.</p>
      ) : (
        groups.data.map((group) => (
          <div className="card" key={group._id}>
            <h3>
              {group._id} <small>({group.count})</small>
            </h3>
            <ul>
              {group.users.map((u) => (
                <li key={u._id}>
                  {u.name} &lt;{u.email}&gt; – <Link to={`/users/${u._id}/posts`}>posts</Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <Pager page={groups.page} hasMore={groups.hasMore} onChange={groups.setPage} />
    </div>
  )
}
