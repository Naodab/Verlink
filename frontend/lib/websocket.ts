const isClient = typeof window !== "undefined"

// Utility để xử lý kết nối websocket

type WebSocketCallback = (data: any) => void

interface WebSocketHandlers {
  message: WebSocketCallback[]
  notification: WebSocketCallback[]
  status: WebSocketCallback[]
  error: WebSocketCallback[]
  open: WebSocketCallback[]
  close: WebSocketCallback[]
}

class WebSocketService {
  private socket: WebSocket | null = null
  private handlers: WebSocketHandlers = {
    message: [],
    notification: [],
    status: [],
    error: [],
    open: [],
    close: [],
  }
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private url: string
  private mockMode: boolean

  constructor(url: string, mockMode = true) {
    this.url = url
    this.mockMode = mockMode
  }

  connect() {
    if (!isClient) return // Không kết nối nếu không phải môi trường client

    if (this.mockMode) {
      console.log("WebSocket running in mock mode")
      this.simulateMockConnection()
      return
    }

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        console.log("WebSocket connection established")
        this.reconnectAttempts = 0
        this.handlers.open.forEach((callback) => callback({ type: "open" }))
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "message") {
            this.handlers.message.forEach((callback) => callback(data))
          } else if (data.type === "notification") {
            this.handlers.notification.forEach((callback) => callback(data))
          } else if (data.type === "status") {
            this.handlers.status.forEach((callback) => callback(data))
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.handlers.error.forEach((callback) => callback({ type: "error", error }))
      }

      this.socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason)
        this.handlers.close.forEach((callback) => callback({ type: "close", code: event.code, reason: event.reason }))

        // Attempt to reconnect if the connection was closed unexpectedly
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnect()
        }
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error)
    }
  }

  private reconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectAttempts++
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)

    console.log(`Attempting to reconnect in ${delay / 1000} seconds...`)

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close(1000, "User initiated disconnect")
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.mockMode) {
      console.log("Mock WebSocket disconnected")
    }
  }

  on(event: keyof WebSocketHandlers, callback: WebSocketCallback) {
    if (this.handlers[event]) {
      this.handlers[event].push(callback)
    }
    return () => this.off(event, callback)
  }

  off(event: keyof WebSocketHandlers, callback: WebSocketCallback) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter((cb) => cb !== callback)
    }
  }

  send(data: any) {
    if (this.mockMode) {
      console.log("Mock WebSocket sending:", data)
      this.handleMockResponse(data)
      return
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    } else {
      console.error("WebSocket is not connected")
    }
  }

  // Mock functionality for development without a real WebSocket server
  private simulateMockConnection() {
    setTimeout(() => {
      this.handlers.open.forEach((callback) => callback({ type: "open" }))

      // Simulate receiving online status for friends
      setTimeout(() => {
        this.handlers.status.forEach((callback) =>
          callback({
            type: "status",
            users: [
              { id: 1, name: "Anna Nguyễn", status: "online" },
              { id: 2, name: "Minh Trần", status: "online" },
              { id: 3, name: "Hương Lê", status: "offline" },
              { id: 4, name: "Tuấn Phạm", status: "online" },
              { id: 5, name: "Linh Đặng", status: "offline" },
            ],
          }),
        )
      }, 1000)

      // Simulate receiving a notification after 3 seconds
      setTimeout(() => {
        this.handlers.notification.forEach((callback) =>
          callback({
            type: "notification",
            id: "notif-1",
            content: "Minh Trần đã bình luận về bài viết của bạn",
            timestamp: new Date().toISOString(),
            read: false,
            link: "/feed",
            user: {
              id: 2,
              name: "Minh Trần",
              image: "/placeholder.svg?height=40&width=40&text=MT",
            },
          }),
        )
      }, 3000)

      // Simulate receiving another notification after 7 seconds
      setTimeout(() => {
        this.handlers.notification.forEach((callback) =>
          callback({
            type: "notification",
            id: "notif-2",
            content: "Anna Nguyễn đã gửi cho bạn lời mời kết bạn",
            timestamp: new Date().toISOString(),
            read: false,
            link: "/friends",
            user: {
              id: 1,
              name: "Anna Nguyễn",
              image: "/placeholder.svg?height=40&width=40&text=AN",
            },
          }),
        )
      }, 7000)
    }, 500)
  }

  private handleMockResponse(data: any) {
    // Simulate responses based on the sent data
    if (data.type === "message") {
      // Simulate receiving a response message after a short delay
      setTimeout(
        () => {
          const recipientId = data.recipientId
          const mockUsers: Record<number, { name: string; image: string }> = {
            1: { name: "Anna Nguyễn", image: "/placeholder.svg?height=40&width=40&text=AN" },
            2: { name: "Minh Trần", image: "/placeholder.svg?height=40&width=40&text=MT" },
            3: { name: "Hương Lê", image: "/placeholder.svg?height=40&width=40&text=HL" },
            4: { name: "Tuấn Phạm", image: "/placeholder.svg?height=40&width=40&text=TP" },
            5: { name: "Linh Đặng", image: "/placeholder.svg?height=40&width=40&text=LD" },
          }

          if (recipientId && mockUsers[recipientId]) {
            const responses = [
              "Xin chào! Bạn khỏe không?",
              "Hôm nay thời tiết đẹp nhỉ!",
              "Bạn đang làm gì vậy?",
              "Tôi vừa xem một bộ phim hay, bạn có muốn biết không?",
              "Đã lâu không gặp bạn rồi!",
            ]

            const randomResponse = responses[Math.floor(Math.random() * responses.length)]

            this.handlers.message.forEach((callback) =>
              callback({
                type: "message",
                id: `msg-${Date.now()}`,
                content: randomResponse,
                timestamp: new Date().toISOString(),
                senderId: recipientId,
                recipientId: "me",
                sender: {
                  id: recipientId,
                  name: mockUsers[recipientId].name,
                  image: mockUsers[recipientId].image,
                },
              }),
            )
          }
        },
        1000 + Math.random() * 2000,
      )
    }
  }
}

// Singleton instance
let websocketInstance: WebSocketService | null = null

export const getWebSocketService = () => {
  if (!isClient) {
    // Trả về một đối tượng giả nếu không phải môi trường client
    return {
      connect: () => {},
      disconnect: () => {},
      on: () => () => {},
      off: () => {},
      send: () => {},
    } as WebSocketService
  }

  if (!websocketInstance) {
    // In a real app, this would be your WebSocket server URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://api.example.com/ws"
    websocketInstance = new WebSocketService(wsUrl, true) // true for mock mode
  }
  return websocketInstance
}
