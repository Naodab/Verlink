"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getWebSocketService } from "@/lib/websocket"
import { CallOverlay } from "./call-overlay"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CallData } from "@/types/dto/response/call-data"

interface CallContextType {
  currentCall: CallData | null
  activeCall: CallData | null
  makeCall: (userId: number | string) => void
  makeVideoCall: (userId: number | string) => void
  endCall: () => void
}

const CallContext = createContext<CallContextType | undefined>(undefined)

export function CallProvider({ children }: { children: ReactNode }) {
  const [currentCall, setCurrentCall] = useState<CallData | null>(null)
  const [activeCall, setActiveCall] = useState<CallData | null>(null)
  const [minimized, setMinimized] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const websocket = getWebSocketService()

  useEffect(() => {
    websocket.connect()

    const handleIncomingCall = (data: any) => {
      if (data.type === "call") {
        // Nếu đang có cuộc gọi, từ chối cuộc gọi mới
        if (activeCall) {
          websocket.send({
            type: "call_response",
            callId: data.id,
            response: "busy",
          })
          return
        }

        const callData: CallData = {
          id: data.id,
          callerId: data.callerId,
          callerUsername: data.callerUsername || `User ${data.callerId}`, // Thêm giá trị mặc định
          callerImage: data.callerImage || "/placeholder.svg",
          timestamp: data.timestamp,
          roomId: data.roomId,
          type: data.callType || "voice",
        }

        setCurrentCall(callData)

        // Hiển thị toast thông báo
        toast({
          title: "Cuộc gọi đến",
          description: `${data.callerUsername || `User ${data.callerId}`} đang gọi cho bạn`,
          action: (
            <div className="flex gap-2">
              <button
                onClick={() => handleCallAnswer("accept")}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-xs"
              >
                Trả lời
              </button>
              <button
                onClick={() => handleCallAnswer("reject")}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
              >
                Từ chối
              </button>
            </div>
          ),
        })
      }
    }

    const handleCallEnded = (data: any) => {
      if (data.type === "call_ended" && activeCall && activeCall.id === data.callId) {
        toast({
          title: "Cuộc gọi đã kết thúc",
          description: "Người gọi đã kết thúc cuộc gọi",
        })
        setActiveCall(null)
        setCurrentCall(null)
        setMinimized(false)
      }
    }

    const unsubscribeIncomingCall = websocket.on("call", handleIncomingCall)
    const unsubscribeCallEnded = websocket.on("call_ended", handleCallEnded)

    return () => {
      unsubscribeIncomingCall()
      unsubscribeCallEnded()
    }
  }, [activeCall, toast, websocket])

  const makeCall = (userId: string | number) => {
    if (activeCall) {
      toast({
        title: "Không thể thực hiện cuộc gọi",
        description: "Bạn đang trong một cuộc gọi khác",
        variant: "destructive",
      })
      return
    }

    // Giả lập tạo cuộc gọi
    const callId = `call-${Date.now()}`
    const roomId = `room-${Date.now()}`

    // Trong ứng dụng thực tế, bạn sẽ gửi yêu cầu gọi qua WebSocket
    websocket.send({
      type: "make_call",
      callId,
      roomId,
      recipientId: userId,
      callType: "voice",
    })

    // Giả lập cuộc gọi được chấp nhận
    setTimeout(() => {
      const callData: CallData = {
        id: callId,
        callerId: String(userId),
        callerUsername: `User ${userId}`, // Đảm bảo luôn có giá trị
        callerImage: {
          url: "/placeholder.svg",
          id: ""
        },
        timestamp: new Date().toISOString(),
        roomId,
        type: "voice",
      }
      setActiveCall(callData)
    }, 1000)

    toast({
      title: "Đang gọi",
      description: `Đang gọi cho User ${userId}...`,
    })
  }

  const makeVideoCall = (userId: number | string) => {
    if (activeCall) {
      toast({
        title: "Không thể thực hiện cuộc gọi",
        description: "Bạn đang trong một cuộc gọi khác",
        variant: "destructive",
      })
      return
    }

    // Giả lập tạo cuộc gọi video
    const callId = `call-${Date.now()}`
    const roomId = `room-${Date.now()}`

    // Trong ứng dụng thực tế, bạn sẽ gửi yêu cầu gọi qua WebSocket
    websocket.send({
      type: "make_call",
      callId,
      roomId,
      recipientId: userId,
      callType: "video",
    })

    // Giả lập cuộc gọi được chấp nhận
    setTimeout(() => {
      const callData: CallData = {
        id: callId,
        callerId: String(userId),
        callerUsername: `User ${userId}`, // Đảm bảo luôn có giá trị
        callerImage: {
          url: "/placeholder.svg",
          id: ""
        },
        timestamp: new Date().toISOString(),
        roomId,
        type: "video",
      }
      setActiveCall(callData)
    }, 1000)

    toast({
      title: "Đang gọi video",
      description: `Đang gọi video cho User ${userId}...`,
    })
  }

  const handleCallAnswer = (answer: "accept" | "reject" | "missed") => {
    if (!currentCall) return

    if (answer === "accept") {
      setActiveCall(currentCall)
      setCurrentCall(null)

      // Trong ứng dụng thực tế, bạn sẽ gửi phản hồi qua WebSocket
      websocket.send({
        type: "call_response",
        callId: currentCall.id,
        response: "accepted",
      })

      // Nếu là cuộc gọi video, chuyển hướng đến trang cuộc gọi video
      if (currentCall.type === "video") {
        // Trong ứng dụng thực tế, bạn có thể chuyển hướng đến trang cuộc gọi video
        // router.push(`/call/${currentCall.roomId}`);
      }
    } else {
      // Từ chối hoặc bỏ lỡ cuộc gọi
      setCurrentCall(null)

      // Trong ứng dụng thực tế, bạn sẽ gửi phản hồi qua WebSocket
      websocket.send({
        type: "call_response",
        callId: currentCall.id,
        response: answer === "reject" ? "rejected" : "missed",
      })

      toast({
        title: answer === "reject" ? "Đã từ chối cuộc gọi" : "Cuộc gọi bị nhỡ",
        description: `Cuộc gọi từ ${currentCall.callerUsername} đã ${answer === "reject" ? "bị từ chối" : "bị nhỡ"}`,
      })
    }
  }

  const endCall = () => {
    if (!activeCall) return

    // Trong ứng dụng thực tế, bạn sẽ gửi yêu cầu kết thúc cuộc gọi qua WebSocket
    websocket.send({
      type: "end_call",
      callId: activeCall.id,
    })

    setActiveCall(null)
    setMinimized(false)

    toast({
      title: "Cuộc gọi đã kết thúc",
      description: "Bạn đã kết thúc cuộc gọi",
    })
  }

  return (
    <CallContext.Provider
      value={{
        currentCall,
        activeCall,
        makeCall,
        makeVideoCall,
        endCall,
      }}
    >
      {children}

      {/* Hiển thị overlay cuộc gọi đến */}
      {currentCall && !activeCall && (
        <CallOverlay call={currentCall} onAnswer={handleCallAnswer} onEnd={() => handleCallAnswer("reject")} />
      )}

      {/* Hiển thị overlay cuộc gọi đang diễn ra */}
      {activeCall && (
        <CallOverlay
          call={activeCall}
          active={true}
          onEnd={endCall}
          minimized={minimized}
          onMinimize={() => setMinimized(true)}
          onMaximize={() => setMinimized(false)}
        />
      )}
    </CallContext.Provider>
  )
}

export function useCall() {
  const context = useContext(CallContext)
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider")
  }
  return context
}
