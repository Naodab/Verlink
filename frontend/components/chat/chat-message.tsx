"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format, isToday, isYesterday } from "date-fns"
import { vi } from "date-fns/locale"

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string | number
  recipientId: string | number
  sender?: {
    id: string | number
    username: string
    image?: string
  }
}

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm", { locale: vi })
    } else if (isYesterday(date)) {
      return `Hôm qua, ${format(date, "HH:mm", { locale: vi })}`
    } else {
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi })
    }
  }

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      {!isCurrentUser && message.sender && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={message.sender.image || "/placeholder.svg"} alt={message.sender.username} />
          <AvatarFallback>
            {message.sender.username
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : ""}`}>
        <div
          className={`px-3 py-2 rounded-2xl max-w-[200px] break-words ${
            isCurrentUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{formatTimestamp(message.timestamp)}</span>
      </div>
    </div>
  )
}
