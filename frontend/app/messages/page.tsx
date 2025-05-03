"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, MessageSquare, Edit, Phone, Video, ImageIcon } from "lucide-react"
import { getWebSocketService } from "@/lib/websocket"
import { ChatWidget } from "@/components/chat/chat-widget"

// Mock data for contacts
const CONTACTS = [
  {
    id: 1,
    name: "Anna Nguyễn",
    image: "/placeholder.svg?height=40&width=40&text=AN",
    lastMessage: "Hẹn gặp bạn vào cuối tuần nhé!",
    timestamp: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Minh Trần",
    image: "/placeholder.svg?height=40&width=40&text=MT",
    lastMessage: "Bạn đã xem bài viết mới của tôi chưa?",
    timestamp: "Hôm qua",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Hương Lê",
    image: "/placeholder.svg?height=40&width=40&text=HL",
    lastMessage: "Cảm ơn bạn rất nhiều!",
    timestamp: "Thứ 2",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Tuấn Phạm",
    image: "/placeholder.svg?height=40&width=40&text=TP",
    lastMessage: "Dự án đang tiến triển tốt.",
    timestamp: "15/04",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "Linh Đặng",
    image: "/placeholder.svg?height=40&width=40&text=LD",
    lastMessage: "Bạn có rảnh không? Tôi cần hỏi một chút.",
    timestamp: "12/04",
    unread: 0,
    online: false,
  },
]

export default function MessagesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState<number | null>(null)
  const [openChats, setOpenChats] = useState<number[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    // Connect to WebSocket and listen for status updates
    const websocket = getWebSocketService()
    websocket.connect()

    const handleStatus = (data: any) => {
      if (data.type === "status" && data.users) {
        const statusMap: Record<number, boolean> = {}
        data.users.forEach((u: any) => {
          statusMap[u.id] = u.status === "online"
        })
        setOnlineUsers(statusMap)
      }
    }

    const unsubscribe = websocket.on("status", handleStatus)

    return () => {
      unsubscribe()
    }
  }, [])

  const filteredContacts = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenChat = (contactId: number) => {
    if (!openChats.includes(contactId)) {
      setOpenChats((prev) => [...prev, contactId])
    }
    setActiveChat(contactId)
  }

  const handleCloseChat = (contactId: number) => {
    setOpenChats((prev) => prev.filter((id) => id !== contactId))
    if (activeChat === contactId) {
      setActiveChat(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Contacts List */}
          <Card className="w-full md:w-80 md:h-[calc(100vh-120px)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Tin nhắn</CardTitle>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto h-[calc(100%-100px)]">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Không tìm thấy tin nhắn</h3>
                  <p className="text-muted-foreground">Hãy thử tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent ${
                        activeChat === contact.id ? "bg-accent" : ""
                      }`}
                      onClick={() => handleOpenChat(contact.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.image || "/placeholder.svg"} alt={contact.name} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {(contact.online || onlineUsers[contact.id]) && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                          <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread > 0 && (
                        <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 md:h-[calc(100vh-120px)] hidden md:flex flex-col">
            {activeChat ? (
              <>
                {(() => {
                  const selectedContact = CONTACTS.find((c) => c.id === activeChat)
                  if (!selectedContact) return null

                  return (
                    <>
                      <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={selectedContact.image || "/placeholder.svg"}
                                alt={selectedContact.name}
                              />
                              <AvatarFallback>
                                {selectedContact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{selectedContact.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {selectedContact.online || onlineUsers[selectedContact.id]
                                  ? "Đang hoạt động"
                                  : "Không hoạt động"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Video className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full flex flex-col">
                          <div className="flex-1 overflow-y-auto p-4">
                            <div className="text-center text-xs text-muted-foreground my-4">
                              <Separator className="mb-2" />
                              <span>Hôm nay</span>
                              <Separator className="mt-2" />
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={selectedContact.image || "/placeholder.svg"}
                                    alt={selectedContact.name}
                                  />
                                  <AvatarFallback>
                                    {selectedContact.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
                                    <p>Xin chào! Bạn khỏe không?</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">10:30</span>
                                </div>
                              </div>
                              <div className="flex flex-row-reverse items-end gap-2">
                                <div className="flex flex-col items-end">
                                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-xs">
                                    <p>Chào bạn! Tôi khỏe, còn bạn thì sao?</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">10:32</span>
                                </div>
                              </div>
                              <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={selectedContact.image || "/placeholder.svg"}
                                    alt={selectedContact.name}
                                  />
                                  <AvatarFallback>
                                    {selectedContact.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-sm max-w-xs">
                                    <p>Tôi cũng khỏe! Bạn đang làm gì vậy?</p>
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">10:35</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 border-t">
                            <form className="flex items-center gap-2">
                              <Button type="button" variant="ghost" size="icon">
                                <ImageIcon className="h-5 w-5" />
                              </Button>
                              <Input type="text" placeholder="Nhập tin nhắn..." className="flex-1" />
                              <Button type="submit">Gửi</Button>
                            </form>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )
                })()}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">Tin nhắn của bạn</h2>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  Chọn một cuộc trò chuyện từ danh sách bên trái hoặc bắt đầu một cuộc trò chuyện mới.
                </p>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Tạo tin nhắn mới
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Floating Chat Windows */}
        {openChats.map((chatId) => {
          const contact = CONTACTS.find((c) => c.id === chatId)
          if (!contact) return null

          return (
            <div key={chatId} className="md:hidden">
              {contact && (
                <ChatWidget
                  user={{
                    id: contact.id,
                    name: contact.name,
                    image: contact.image,
                  }}
                  onClose={() => handleCloseChat(chatId)}
                />
              )}
            </div>
          )
        })}
      </main>
    </div>
  )
}
