"use client"

import { formatDistance } from "date-fns"
import { vi } from "date-fns/locale"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import type { Notification } from "./notification-provider"

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onClear: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead, onClear }: NotificationItemProps) {
  const formattedTime = formatDistance(new Date(notification.timestamp), new Date(), {
    addSuffix: true,
    locale: vi,
  })

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <Card
      className={`p-3 mb-2 relative ${
        notification.read ? "bg-background" : "bg-primary/5 dark:bg-primary/10"
      } hover:bg-accent transition-colors`}
    >
      <Link href={notification.link} onClick={handleClick} className="block">
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
            <p className="text-sm">{notification.content}</p>
            <p className="text-xs text-muted-foreground mt-1">{formattedTime}</p>
          </div>
        </div>
      </Link>
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
