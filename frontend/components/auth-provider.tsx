"use client"

import type React from "react"
import type { Gender } from "@/types/user"

import { createContext, useContext, useEffect, useState } from "react"
import apiUrl from "@/lib/auth"
import { useRouter } from "next/router"

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
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("verlink-token")
      if (token) {
        try {
          setIsLoading(true)
          const response = await fetch(`${apiUrl}/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const responseJson = await response.json()
          if (!responseJson.ok) {
            throw new Error("Failed to fetch user data")
          }
          const { data } = responseJson
          setUser(data.user)
        } catch (error) {
          console.error("Invalid token", error)
          localStorage.removeItem("verlink-token")
          setUser(null)
          router.push("/login")
        }
      }
      setIsLoading(false)
    }

    fetchUserData()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
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

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const responseJson = await response.json()
      if (!response.ok) {
        throw new Error(responseJson.message ?? "Registration failed")
      }
      const { data: mockResponse } = responseJson

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

  const updateProfileImage = async (imageUrl: string) => {
    try {
      setIsLoading(true)
      // In a real app, you would make an API call to your backend
      // Mock successful update
      if (user) {
        const updatedUser = {
          ...user,
          profileImage: {
            id: "custom",
            url: imageUrl,
          },
        }
        setUser(updatedUser)
      }
      return true
    } catch (error) {
      console.error("Profile image update failed", error)
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
