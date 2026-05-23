'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const data = await fetchWithAuth('/auth/me')
      if (data && data._id) {
        setUser({ id: data._id, name: data.name, email: data.email, avatar: data.avatar })
      } else {
        setUser(null)
      }
    } catch (err: any) {
      setUser(null)
      // We don't necessarily set error string unless it's critical, as unauth is common
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const logout = async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error('Logout error', err)
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
