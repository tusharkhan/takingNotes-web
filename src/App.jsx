import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Login from './pages/Login'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import Interests from './pages/Interests'
import UserPosts from './pages/UserPosts'
import AdminUsers from './pages/AdminUsers'
import AdminNotes from './pages/AdminNotes'

function Private({ children, admin }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user, logout } = useAuth()

  return (
    <div className="app">
      {user && (
        <nav>
          <NavLink to="/" end>My notes</NavLink>
          <NavLink to={`/users/${user._id}/posts`}>My posts</NavLink>
          <NavLink to="/interests">Interests</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {user.role === 'admin' && (
            <>
              <NavLink to="/admin/users">Users</NavLink>
              <NavLink to="/admin/notes">All notes</NavLink>
            </>
          )}
          <span className="spacer" />
          <span>{user.name} ({user.role})</span>
          <button onClick={logout}>Logout</button>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<Private><Notes /></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/interests" element={<Private><Interests /></Private>} />
          <Route path="/users/:id/posts" element={<Private><UserPosts /></Private>} />
          <Route path="/admin/users" element={<Private admin><AdminUsers /></Private>} />
          <Route path="/admin/notes" element={<Private admin><AdminNotes /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
