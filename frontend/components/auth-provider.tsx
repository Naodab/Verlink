"use client"

import type React from "react"
import type { User } from "@/types/models/user"

import { createContext, useContext, useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { getWebSocketService } from "@/lib/websocket"
import type { RegisterData } from "@/types/dto/request/register-user-data"
import { ApiResponse } from "@/types/dto/response/api-response"

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfileImage: (imageUrl: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const isApiConfigured = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return !!apiUrl && apiUrl !== "https://api.verlink.com"
}

const MOCK_USER: User = {
  id: "user-1",
  username: "johndoe",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  gender: "MALE",
  profileImage: {
    id: "img-1",
    url: "/placeholder.svg?height=200&width=200",
  },
  coverImage: {
    id: "img-1",
    url: "/placeholder.svg?height=200&width=200",
  },
  createdAt: new Date(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("verlink-token")
      if (token) {
        await fetchCurrentUser(token)
      }
      setIsLoading(false)
    }
    initializeAuth()
  }, [])

  useEffect(() => {
    if (user) {
      const websocket = getWebSocketService()
      websocket.connect()
    }
  }, [user])

  const fetchCurrentUser = async (token: string) => {
    setIsLoading(true)
    try {
      if (!isApiConfigured()) {
        console.warn("API URL not configured. Using mock data for development.")

        if (token === "mock-token-123") {
          setUser(MOCK_USER)
        } else {
          localStorage.removeItem("verlink-token")
        }
        return
      }

      const userData = await fetchApi<ApiResponse<User>>("/auth/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({token}),
      })
      setUser(userData.data)
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

      if (!isApiConfigured()) {
        console.warn("API URL not configured. Using mock data for development.")

        if (email === "john@example.com" && password === "password") {
          localStorage.setItem("verlink-token", "mock-token-123")
          setUser(MOCK_USER)
          return true
        } else {
          throw new Error("Invalid email or password")
        }
      }

      const response = await fetchApi<ApiResponse<{ user: User; token: string }>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
      })

      localStorage.setItem("verlink-token", response.data.token)
      setUser(response.data.user)
      setIsLoading(false)
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

      if (!isApiConfigured()) {
        console.warn("API URL not configured. Using mock data for development.")

        const mockUser: User = {
          ...MOCK_USER,
          id: `user-${Date.now()}`,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          dob: data.dob,
        }

        localStorage.setItem("verlink-token", "mock-token-123")
        setUser(mockUser)
        return true
      }

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

      if (!isApiConfigured()) {
        console.warn("API URL not configured. Using mock data for development.")

        setUser({
          ...user,
          profileImage: {
            id: `img-${Date.now()}`,
            url: imageUrl,
          },
        })
        return true
      }

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
