"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { ChatWidget } from "./chat-widget"

interface ChatUser {
  id: string | number
  name: string
  image: string
}

interface ChatContainerProps {
  maxVisibleChats?: number
}

export function ChatContainer({ maxVisibleChats = 3 }: ChatContainerProps) {
  const [activeChats, setActiveChats] = useState<ChatUser[]>([])
  const [minimizedChats, setMinimizedChats] = useState<ChatUser[]>([])
  const [isMinimizedListOpen, setIsMinimizedListOpen] = useState(false)

  // Giới hạn số lượng chat hiển thị dựa trên độ rộng màn hình
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      let visibleChatsCount = maxVisibleChats

      // Điều chỉnh số lượng chat hiển thị dựa trên độ rộng màn hình
      if (screenWidth < 768) {
        visibleChatsCount = 1
      } else if (screenWidth < 1024) {
        visibleChatsCount = 2
      }

      // Nếu có nhiều chat hơn số lượng cho phép, di chuyển các chat vượt quá vào danh sách thu nhỏ
      if (activeChats.length > visibleChatsCount) {
        const visibleChats = activeChats.slice(0, visibleChatsCount)
        const hidden = activeChats.slice(visibleChatsCount)
        setActiveChats(visibleChats)
        setMinimizedChats([...minimizedChats, ...hidden])
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Gọi ngay khi component mount

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [activeChats, minimizedChats, maxVisibleChats])

  const addChat = (user: ChatUser) => {
    // Kiểm tra xem chat đã tồn tại chưa
    const existingChatIndex = activeChats.findIndex((chat) => chat.id === user.id)
    const existingMinimizedIndex = minimizedChats.findIndex((chat) => chat.id === user.id)

    if (existingChatIndex !== -1) {
      // Nếu chat đã tồn tại trong danh sách active, không làm gì cả
      return
    }

    if (existingMinimizedIndex !== -1) {
      // Nếu chat đã tồn tại trong danh sách minimized, chuyển nó sang active
      const updatedMinimized = [...minimizedChats]
      const [chat] = updatedMinimized.splice(existingMinimizedIndex, 1)

      // Kiểm tra xem có vượt quá số lượng chat hiển thị không
      if (activeChats.length >= maxVisibleChats) {
        // Nếu vượt quá, chuyển chat cuối cùng trong active sang minimized
        const updatedActive = [chat, ...activeChats.slice(0, maxVisibleChats - 1)]
        updatedMinimized.push(activeChats[activeChats.length - 1])
        setActiveChats(updatedActive)
        setMinimizedChats(updatedMinimized)
      } else {
        // Nếu không vượt quá, thêm chat vào đầu danh sách active
        setActiveChats([chat, ...activeChats])
        setMinimizedChats(updatedMinimized)
      }
      return
    }

    // Nếu là chat mới
    if (activeChats.length >= maxVisibleChats) {
      // Nếu vượt quá số lượng cho phép, thêm vào danh sách thu nhỏ
      setMinimizedChats([...minimizedChats, user])
    } else {
      // Nếu không vượt quá, thêm vào danh sách active
      setActiveChats([...activeChats, user])
    }
  }

  const removeChat = (userId: string | number) => {
    setActiveChats(activeChats.filter((chat) => chat.id !== userId))

    // Nếu có chat trong danh sách thu nhỏ, chuyển chat đầu tiên sang danh sách active
    if (minimizedChats.length > 0) {
      const [firstMinimized, ...restMinimized] = minimizedChats
      setActiveChats([...activeChats.filter((chat) => chat.id !== userId), firstMinimized])
      setMinimizedChats(restMinimized)
    }
  }

  const minimizeChat = (userId: string | number) => {
    const chatToMinimize = activeChats.find((chat) => chat.id === userId)
    if (chatToMinimize) {
      setActiveChats(activeChats.filter((chat) => chat.id !== userId))
      setMinimizedChats([...minimizedChats, chatToMinimize])
    }
  }

  const restoreChat = (userId: string | number) => {
    const chatToRestore = minimizedChats.find((chat) => chat.id === userId)
    if (chatToRestore) {
      // Nếu đã đạt số lượng tối đa, chuyển chat cuối cùng trong active sang minimized
      if (activeChats.length >= maxVisibleChats) {
        const lastActiveChat = activeChats[activeChats.length - 1]
        setActiveChats([...activeChats.slice(0, maxVisibleChats - 1), chatToRestore])
        setMinimizedChats([...minimizedChats.filter((chat) => chat.id !== userId), lastActiveChat])
      } else {
        setActiveChats([...activeChats, chatToRestore])
        setMinimizedChats(minimizedChats.filter((chat) => chat.id !== userId))
      }
    }
  }

  // Expose addChat function to global window object for external access
  useEffect(() => {
    // @ts-ignore
    window.addChat = addChat
  }, [activeChats, minimizedChats])

  return (
    <div className="fixed bottom-0 right-4 z-50 flex items-end space-x-2">
      {/* Minimized chats dropdown */}
      {minimizedChats.length > 0 && (
        <div className="relative mb-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full flex items-center gap-1"
            onClick={() => setIsMinimizedListOpen(!isMinimizedListOpen)}
          >
            <div className="flex -space-x-2">
              {minimizedChats.slice(0, 3).map((chat) => (
                <Avatar key={chat.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={chat.image || "/placeholder.svg"} alt={chat.name} />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span>{minimizedChats.length}</span>
            {isMinimizedListOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>

          {isMinimizedListOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-background rounded-lg shadow-lg border p-2 w-48">
              <div className="max-h-60 overflow-y-auto">
                {minimizedChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start mb-1 px-2 py-1 h-auto"
                    onClick={() => {
                      restoreChat(chat.id)
                      setIsMinimizedListOpen(false)
                    }}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={chat.image || "/placeholder.svg"} alt={chat.name} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{chat.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active chat windows */}
      {activeChats.map((chat, index) => (
        <ChatWidget
          key={chat.id}
          user={chat}
          onClose={() => removeChat(chat.id)}
          onMinimize={() => minimizeChat(chat.id)}
          position={index * 84} // 84px là độ rộng của mỗi chat window + margin
        />
      ))}
    </div>
  )
}
