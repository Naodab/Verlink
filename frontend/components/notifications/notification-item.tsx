"use client"

import { formatDistance } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, MessageSquare, Heart, UserPlus, Bell } from "lucide-react"
import type { Notification } from "./notification-provider"
import { useNotifications } from "./notification-provider"

interface NotificationItemProps {
  notification: Notification
  onClear: (id: string) => void
}

// Hàm để lấy icon dựa trên loại thông báo
const getNotificationIcon = (type?: string) => {
  switch (type) {
    case "reaction":
      return <Heart className="h-4 w-4 text-red-500" />
    case "comment":
      return <MessageSquare className="h-4 w-4 text-blue-500" />
    case "friendRequest":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "message":
      return <MessageSquare className="h-4 w-4 text-purple-500" />
    default:
      return <Bell className="h-4 w-4 text-primary" />
  }
}

export function NotificationItem({ notification, onClear }: NotificationItemProps) {
  const { handleNotificationClick } = useNotifications()

  const formattedTime = formatDistance(new Date(notification.timestamp), new Date(), {
    addSuffix: true,
    locale: vi,
  })

  return (
    <Card
      className={`p-3 mb-2 relative ${
        notification.read ? "bg-background" : "bg-primary/5 dark:bg-primary/10"
      } hover:bg-accent transition-colors`}
    >
      <div className="block cursor-pointer" onClick={() => handleNotificationClick(notification)}>
        <div className="flex items-start gap-3">
          {notification.user && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={notification.user.image || "/placeholder.svg"} alt={notification.user.name} />
              <AvatarFallback>
                {notification.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              {getNotificationIcon(notification.notificationType)}
              <p className="text-sm">{notification.content}</p>
            </div>
            <p className="text-xs text-muted-foreground">{formattedTime}</p>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 absolute top-2 right-2 opacity-50 hover:opacity-100"
        onClick={() => onClear(notification.id)}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Xóa thông báo</span>
      </Button>
      {!notification.read && <div className="absolute top-3 right-10 h-2 w-2 rounded-full bg-primary" />}
    </Card>
  )
}
