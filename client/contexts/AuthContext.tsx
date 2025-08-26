'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthTokens } from '@/types'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user_identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, local_currency?: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (token) {
          await refreshUser()
        }
      } catch (error) {
        console.log('Auth failed', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  useEffect(() => {
    const handleForceLogout = (event: CustomEvent) => {
      forceLogout()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('forceLogout', handleForceLogout as EventListener)
      
      return () => {
        window.removeEventListener('forceLogout', handleForceLogout as EventListener)
      }
    }
  }, [])

  const forceLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    toast.error('Session expired. Please sign in again.')
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile()
      setUser(response.data.data.user)
    } catch (error: any) {
      console.error('Error refreshing user profile:', error)
      throw error
    }
  }

  const login = async (user_identifier: string, password: string) => {
    try {
      const response = await apiClient.login({ user_identifier, password })
      const { accessToken, refreshToken, user: userData } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      setUser(userData)
      toast.success('Login successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string, local_currency?: string) => {
    try {
      const response = await apiClient.register({ username, email, password, local_currency })
      const { accessToken, refreshToken, user: userData } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      setUser(userData)
      toast.success('Registration successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 