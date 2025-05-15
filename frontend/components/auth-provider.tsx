"use client"

import type React from "react"
import type { Gender } from "@/types/user"

import { createContext, useContext, useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"

type User = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  gender: Gender
  dob?: Date
  profileImage?: {
    id: string
    url: string
  }
}

type RegisterData = {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  password: string
  gender: Gender
  dob?: Date
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfileImage: (imageUrl: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("verlink-token")
    if (token) {
      // Verify the token with backend
      fetchCurrentUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Fetch current user data
  const fetchCurrentUser = async (token: string) => {
    try {
      const userData = await fetchApi<User>("/auth/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({"token": localStorage.getItem("verlink-token")}),
      })
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user data:", error)
      localStorage.removeItem("verlink-token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const response = await fetchApi<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      })
      localStorage.setItem("verlink-token", response.token)
      setUser(response.user)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)

      const response = await fetchApi<{ user: User; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      })

      localStorage.setItem("verlink-token", response.token)
      setUser(response.user)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfileImage = async (imageUrl: string) => {
    try {
      setIsLoading(true)

      if (!user) return false

      const updatedUser = await fetchApi<User>("/api/users/profile-image", {
        method: "PUT",
        body: JSON.stringify({ imageUrl }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("verlink-token")}`,
        },
      })

      setUser(updatedUser)
      return true
    } catch (error) {
      console.error("Profile image update failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("verlink-token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
