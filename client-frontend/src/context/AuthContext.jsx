import { createContext, useState, useEffect } from 'react'
import apiClient from '../services/apiClient'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'cc_token'
const USER_KEY  = 'cc_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const saved = localStorage.getItem(USER_KEY)
    if (token && saved) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    const { token, ...userData } = authResponse
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    delete apiClient.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}
