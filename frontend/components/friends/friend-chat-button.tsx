"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Phone, Video } from "lucide-react"
import { useState } from "react"
import { ChatWidget } from "@/components/chat/chat-widget"
import { useCall } from "@/components/call/call-provider"

interface FriendProps {
  id: number | string
  username: string
  image: string
  online?: boolean
  showCallButtons?: boolean
}

export function FriendChatButton({ friend, showCallButtons = false }: { friend: FriendProps; showCallButtons?: boolean }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { makeCall, makeVideoCall } = useCall()

  const handleChatClick = () => {
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
  }

  const handleCallClick = () => {
    makeCall(friend.id)
  }

  const handleVideoCallClick = () => {
    makeVideoCall(friend.id)
  }

  return (
    <>
      <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-accent transition-colors">
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={friend.image || "/placeholder.svg"} alt={friend.username} />
              <AvatarFallback>{friend?.username ? friend.username.charAt(0) : "U"}</AvatarFallback>
            </Avatar>
            {friend.online && (
              <span className="absolute bottom-0 right-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
            )}
          </div>
          <span className="text-sm font-medium">{friend.username}</span>
        </div>
        <div className="flex items-center gap-1">
          {showCallButtons && (
            <>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCallClick}>
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleVideoCallClick}>
                <Video className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleChatClick}>
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {isChatOpen && (
        <ChatWidget
          user={{
            id: friend.id,
            username: friend.username,
            image: friend.image,
          }}
          onClose={handleCloseChat}
        />
      )}
    </>
  )
}
