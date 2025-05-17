let instance: WebSocketService | null = null

type WebSocketListener = (data: any) => void
type WebSocketEvent = "auth" | "message" | "notification" | "call" | "video-call"

export class WebSocketService {
  private ws: WebSocket | null = null
  private readonly listeners: Map<WebSocketEvent, WebSocketListener[]> = new Map()
  private reconnectAttempts = 0
  private readonly maxReconnectAttempts = 5
  private reconnectTimeout: NodeJS.Timeout | null = null
  private isConnecting = false

  constructor() {
    this.listeners.set("message", [])
    this.listeners.set("notification", [])
    this.listeners.set("call", [])
    this.listeners.set("video-call", [])
    this.listeners.set("auth", [])
  }

  connect() {
    const token = localStorage.getItem("verlink-token")

    if (!token) {
      return
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    if (this.isConnecting) {
      return
    }

    this.isConnecting = true

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "wss://api.verlink.com/ws"

    try {
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
        this.isConnecting = false

        this.send({
          type: "auth",
          token,
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "auth") {
            if (!data.success) {
              console.error("WebSocket authentication failed")
              this.disconnect()
              return
            }
          }
          const listeners = this.listeners.get(data.type as WebSocketEvent) || []
          listeners.forEach((listener) => listener(data))
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.ws = null
        this.isConnecting = false
        this.attemptReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.ws?.close()
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.isConnecting = false
      this.attemptReconnect()
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached")
      return
    }

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000)
    console.log(`Attempting to reconnect in ${delay}ms`)

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  on(event: WebSocketEvent, callback: WebSocketListener) {
    const listeners = this.listeners.get(event) || []
    listeners.push(callback)
    this.listeners.set(event, listeners)

    return () => {
      const updatedListeners = this.listeners.get(event) || []
      this.listeners.set(
        event,
        updatedListeners.filter((listener) => listener !== callback),
      )
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    } else {
      console.warn("WebSocket is not connected, message not sent")
      this.connect()
    }
  }
}

export function getWebSocketService() {
  instance ??= new WebSocketService();
  return instance
}
