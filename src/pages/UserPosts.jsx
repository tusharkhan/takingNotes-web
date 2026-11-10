import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../AuthContext'
import { usePaged } from '../usePaged'
import Pager from '../components/Pager'

function PostList({ userId }) {
  const { user } = useAuth()
  const posts = usePaged(`/users/${userId}/posts`, 5)
  const [form, setForm] = useState({ title: '', body: '' })
  const [error, setError] = useState('')
  const isMine = user._id === userId

  async function create(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/posts', { method: 'POST', body: form })
      setForm({ title: '', body: '' })
      if (posts.page === 1) posts.reload()
      else posts.setPage(1)
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!confirm('Delete this post?')) return
    await api(`/posts/${id}`, { method: 'DELETE' })
    posts.reload()
  }

  return (
    <div>
      <h2>{isMine ? 'My posts' : `Posts by ${posts.user?.name || '...'}`}</h2>

      {isMine && (
        <form className="card" onSubmit={create}>
          <input
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Everyone can see this"
            rows={3}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Publish</button>
        </form>
      )}

      {posts.error && <p className="error">{posts.error}</p>}
      {posts.loading ? (
        <p>Loading...</p>
      ) : posts.data.length === 0 ? (
        <p>No posts.</p>
      ) : (
        posts.data.map((post) => (
          <div className="card" key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
            {isMine && (
              <div className="row">
                <button className="danger" onClick={() => remove(post._id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}

      <Pager page={posts.page} hasMore={posts.hasMore} onChange={posts.setPage} />
    </div>
  )
}

export default function UserPosts() {
  const { id } = useParams()
  return <PostList key={id} userId={id} />
}
