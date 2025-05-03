"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { X, Minimize2, Maximize2, Send, Paperclip, ImageIcon } from "lucide-react"
import { getWebSocketService } from "@/lib/websocket"
import { ChatMessage, type Message } from "./chat-message"

interface ChatWidgetProps {
  user: {
    id: string | number
    name: string
    image: string
  }
  onClose: () => void
  onMinimize?: () => void
  position?: number
}

export function ChatWidget({ user, onClose, onMinimize, position = 0 }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const websocket = getWebSocketService()

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Connect to WebSocket and listen for messages
    websocket.connect()

    const handleMessage = (data: any) => {
      if (data.type === "message") {
        // Only add messages relevant to this chat
        if (
          (data.senderId === user.id && data.recipientId === "me") ||
          (data.senderId === "me" && data.recipientId === user.id)
        ) {
          setMessages((prev) => [...prev, data])
        }
      }
    }

    const unsubscribe = websocket.on("message", handleMessage)

    // Add some initial messages for demo
    const initialMessages: Message[] = [
      {
        id: "msg-1",
        content: `Xin chào! Tôi là ${user.name}.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        senderId: user.id,
        recipientId: "me",
        sender: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      },
      {
        id: "msg-2",
        content: `Chào ${user.name}! Bạn khỏe không?`,
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        senderId: "me",
        recipientId: user.id,
      },
      {
        id: "msg-3",
        content: "Tôi khỏe, cảm ơn bạn! Bạn đang làm gì vậy?",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        senderId: user.id,
        recipientId: "me",
        sender: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      },
    ]

    setMessages(initialMessages)

    return () => {
      unsubscribe()
    }
  }, [user.id, user.name, user.image, websocket])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderId: "me",
      recipientId: user.id,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Send message via WebSocket
    websocket.send({
      type: "message",
      content: newMessage,
      recipientId: user.id,
    })
  }

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize()
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  return (
    <Card
      className={`shadow-lg fixed bottom-0 z-50 ${isMinimized ? "h-12" : "h-96"}`}
      style={{ width: "280px", right: `${position + 16}px` }}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{user.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClose}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-3 h-[calc(100%-96px)] overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isCurrentUser={message.senderId === "me"} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-3">
            <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="h-8 flex-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" size="icon" className="h-8 w-8 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
