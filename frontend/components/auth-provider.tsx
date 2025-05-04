"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import apiUrl from "@/lib/auth";

type User = {
  id: string
  username: string
  email: string
  phone: string
  firstName: string
  lastName: string
  gender: string
  dob: string
  createdAt: string
  profileImage?: {
    url: string
    mimeType: string
  }
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
    const token = localStorage.getItem("verlink-token")
    if (token) {
      try {
        setUser({
          id: "1",
          username: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          firstName: "John",
          lastName: "Doe",
          gender: "Male",
          dob: "1990-01-01",
          createdAt: "2023-01-01T00:00:00Z",
          profileImage: {
            url: "/placeholder.svg?height=40&width=40",
            mimeType: "image/svg+xml",
          }
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
      alert(apiUrl)
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      })
      const responseJson = await response.json()
      if (!response.ok) {
        throw new Error(responseJson.message ?? "Login failed")
      }
      const { data } = responseJson
      localStorage.setItem("verlink-token", data.token)
      setUser(data.user)
      setIsLoading(false)
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
