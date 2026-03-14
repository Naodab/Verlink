"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { X, Minimize2, Maximize2, Send, Paperclip, ImageIcon, Phone, Video, Loader2 } from "lucide-react"
import { getWebSocketService } from "@/lib/websocket"
import { ChatMessage, type Message } from "./chat-message"
import { useCall } from "@/components/call/call-provider"

interface ChatWidgetProps {
  user: {
    id: string | number
    username: string
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
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const websocket = getWebSocketService()
  const { makeCall, makeVideoCall } = useCall()
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [hasOlderMessages, setHasOlderMessages] = useState(true)
  const [page, setPage] = useState(1)
  const [initialScrollHeight, setInitialScrollHeight] = useState(0)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  // Fetch initial messages
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
        content: `Xin chào! Tôi là ${user.username}.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        senderId: user.id,
        recipientId: "me",
        sender: {
          id: user.id,
          username: user.username,
          image: user.image,
        },
      },
      {
        id: "msg-2",
        content: `Chào ${user.username}! Bạn khỏe không?`,
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
          username: user.username,
          image: user.image,
        },
      },
    ]

    setMessages(initialMessages)

    return () => {
      unsubscribe()
    }
  }, [user.id, user.username, user.image, websocket])

  // Hàm giả lập để lấy tin nhắn cũ hơn
  const fetchOlderMessages = async (page: number): Promise<Message[]> => {
    // Giả lập thời gian tải
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Trong môi trường thực tế, bạn sẽ gọi API thực sự
    // return await fetchApi<Message[]>(`/api/messages?userId=${user.id}&page=${page}`)

    // Nếu không còn tin nhắn cũ hơn
    if (page > 3) {
      return []
    }

    // Giả lập dữ liệu cho môi trường phát triển
    return Array(5)
      .fill(0)
      .map((_, index) => ({
        id: `old-msg-${page}-${index}`,
        content: `Đây là tin nhắn cũ #${index + 1} từ trang ${page}. Lorem ipsum dolor sit amet.`,
        timestamp: new Date(Date.now() - 3600000 * 24 * page - 3600000 * index).toISOString(),
        senderId: index % 2 === 0 ? user.id : "me",
        recipientId: index % 2 === 0 ? "me" : user.id,
        ...(index % 2 === 0 && {
          sender: {
            id: user.id,
            username: user.username,
            image: user.image,
          },
        }),
      }))
  }

  // Hàm tải thêm tin nhắn cũ
  const loadOlderMessages = useCallback(async () => {
    if (isLoadingOlder || !hasOlderMessages) return

    setIsLoadingOlder(true)

    // Lưu chiều cao cuộn hiện tại
    const scrollContainer = messagesContainerRef.current
    const scrollHeight = scrollContainer?.scrollHeight || 0
    setInitialScrollHeight(scrollHeight)

    try {
      const olderMessages = await fetchOlderMessages(page)

      if (olderMessages.length === 0) {
        setHasOlderMessages(false)
      } else {
        setMessages((prevMessages) => [...olderMessages, ...prevMessages])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error loading older messages:", error)
    } finally {
      setIsLoadingOlder(false)
    }
  }, [page, isLoadingOlder, hasOlderMessages, user.id, user.username, user.image])

  // Duy trì vị trí cuộn sau khi tải thêm tin nhắn cũ
  useEffect(() => {
    if (!isLoadingOlder && initialScrollHeight > 0) {
      const scrollContainer = messagesContainerRef.current
      if (scrollContainer) {
        const newScrollHeight = scrollContainer.scrollHeight
        const scrollDiff = newScrollHeight - initialScrollHeight
        scrollContainer.scrollTop = scrollDiff
      }
      setInitialScrollHeight(0)
    }
  }, [isLoadingOlder, initialScrollHeight])

  // Theo dõi sự kiện cuộn để tải thêm tin nhắn cũ
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = messagesContainerRef.current
      if (scrollContainer && scrollContainer.scrollTop === 0 && !isLoadingOlder && hasOlderMessages) {
        loadOlderMessages()
      }
    }

    const scrollContainer = messagesContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [loadOlderMessages, isLoadingOlder, hasOlderMessages])

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

  const handleCallClick = () => {
    makeCall(user.id)
  }

  const handleVideoCallClick = () => {
    makeVideoCall(user.id)
  }

  return (
    <Card
      className={`shadow-lg fixed bottom-0 z-50 ${isMinimized ? "h-14" : "h-[450px]"}`}
      style={{ width: "320px", right: `${position + 16}px` }}
    >
      <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 bg-primary text-primary-foreground">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback>
              {user.username
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{user.username}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleCallClick}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleVideoCallClick}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={handleMinimize}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-3 h-[calc(100%-110px)] overflow-y-auto" ref={messagesContainerRef}>
            {/* Loading indicator for older messages */}
            {isLoadingOlder && (
              <div className="flex justify-center py-2 mb-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {/* "No more messages" indicator */}
            {!isLoadingOlder && !hasOlderMessages && messages.length > 0 && (
              <div className="text-center py-2 mb-2">
                <span className="text-xs text-muted-foreground">Không còn tin nhắn cũ hơn</span>
              </div>
            )}

            {/* Reference for the start of messages */}
            <div ref={messagesStartRef} />

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
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="h-9 flex-1 text-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" size="icon" className="h-9 w-9 flex-shrink-0">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
