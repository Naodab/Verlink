"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface FriendChatButtonProps {
  friend: {
    id: string | number
    name: string
    image?: string
    online?: boolean
  }
}

export function FriendChatButton({ friend }: FriendChatButtonProps) {
  const handleClick = () => {
    // Sử dụng hàm addChat đã được expose từ ChatContainer
    // @ts-ignore
    if (window.addChat) {
      // @ts-ignore
      window.addChat({
        id: friend.id,
        name: friend.name,
        image: friend.image || "/placeholder.svg",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-2 w-full hover:bg-accent"
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={friend.image || "/placeholder.svg"} alt={friend.name} />
          <AvatarFallback>
            {friend.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        {friend.online && (
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
        )}
      </div>
      <span className="text-sm">{friend.name}</span>
    </Button>
  )
}
