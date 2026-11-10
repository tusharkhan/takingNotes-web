import { createContext, useContext, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

function savedUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser)

  function saveSession({ token, user }) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  async function login(email, password) {
    saveSession(await api('/auth/login', { method: 'POST', body: { email, password } }))
  }

  async function register(form) {
    saveSession(await api('/auth/register', { method: 'POST', body: form }))
  }

  function updateUser(next) {
    localStorage.setItem('user', JSON.stringify(next))
    setUser(next)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
