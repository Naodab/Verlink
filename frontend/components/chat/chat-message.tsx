import { formatDistance } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string | number
  recipientId: string | number
  sender?: {
    id: string | number
    name: string
    image: string
  }
  isRead?: boolean
}

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
}

export function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const formattedTime = formatDistance(new Date(message.timestamp), new Date(), {
    addSuffix: true,
    locale: vi,
  })

  if (isCurrentUser) {
    return (
      <div className="flex flex-row-reverse items-end gap-2 mb-4">
        <div className="flex flex-col items-end">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs break-words">
            <p>{message.content}</p>
          </div>
          <span className="text-xs text-muted-foreground mt-1">{formattedTime}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2 mb-4">
      {message.sender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image || "/placeholder.svg"} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs break-words">
          <p>{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1">{formattedTime}</span>
      </div>
    </div>
  )
}
