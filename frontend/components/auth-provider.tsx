"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  profileImage?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("verlink-token")
    if (token) {
      // In a real app, you would verify the token with your backend
      try {
        // Mock user data for demonstration
        setUser({
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          profileImage: "/placeholder.svg?height=40&width=40",
        })
      } catch (error) {
        console.error("Invalid token", error)
        localStorage.removeItem("verlink-token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // In a real app, you would make an API call to your backend
      // Mock successful login
      const mockResponse = {
        user: {
          id: "1",
          name: "John Doe",
          email,
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        token: "mock-jwt-token",
      }

      localStorage.setItem("verlink-token", mockResponse.token)
      setUser(mockResponse.user)
      return true
    } catch (error) {
      console.error("Login failed", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      // In a real app, you would make an API call to your backend
      // Mock successful registration
      const mockResponse = {
        user: {
          id: "1",
          name,
          email,
          profileImage: "/placeholder.svg?height=40&width=40",
        },
        token: "mock-jwt-token",
      }

      localStorage.setItem("verlink-token", mockResponse.token)
      setUser(mockResponse.user)
      return true
    } catch (error) {
      console.error("Registration failed", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("verlink-token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
