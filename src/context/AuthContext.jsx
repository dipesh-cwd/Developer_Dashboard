import {
  createContext,
  useContext,
  useState,
} from 'react'

import api from '../lib/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const {
        user,
        accessToken,
        refreshToken,
      } = response.data

      setUser(user)
      setAccessToken(accessToken)

      localStorage.setItem(
        'refreshToken',
        refreshToken
      )

      return response.data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)

    localStorage.removeItem('refreshToken')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}