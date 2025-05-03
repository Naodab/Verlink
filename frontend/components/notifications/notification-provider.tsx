"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getWebSocketService } from "@/lib/websocket"
import { useToast } from "@/components/ui/use-toast"

export interface Notification {
  id: string
  content: string
  timestamp: string
  read: boolean
  link: string
  user?: {
    id: number | string
    name: string
    image: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Đảm bảo code chỉ chạy ở phía client
    if (typeof window !== "undefined") {
      const websocket = getWebSocketService()
      websocket.connect()

      const handleNotification = (data: any) => {
        if (data.type === "notification") {
          const newNotification: Notification = {
            id: data.id,
            content: data.content,
            timestamp: data.timestamp,
            read: data.read || false,
            link: data.link || "#",
            user: data.user,
          }

          setNotifications((prev) => [newNotification, ...prev])

          // Show toast for new notification
          toast({
            title: "Thông báo mới",
            description: data.content,
            duration: 5000,
          })
        }
      }

      const unsubscribe = websocket.on("notification", handleNotification)

      return () => {
        unsubscribe()
        websocket.disconnect()
      }
    }

    return undefined
  }, [toast])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
