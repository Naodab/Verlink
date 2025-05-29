"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, MicOff, Mic, Video, VideoOff, X, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CallData } from "@/types/dto/response/call-data"

interface CallOverlayProps {
  call: CallData
  active?: boolean
  onAnswer?: (answer: "accept" | "reject" | "missed") => void
  onEnd?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  minimized?: boolean
}

export function CallOverlay({
  call,
  active = false,
  onAnswer,
  onEnd,
  onMinimize,
  onMaximize,
  minimized = false,
}: CallOverlayProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  // Tính thời gian cuộc gọi
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (active) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [active])

  // Format thời gian cuộc gọi
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Xử lý khi bật/tắt mic
  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Trong ứng dụng thực tế, bạn sẽ thực hiện các thao tác với audio stream
  }

  // Xử lý khi bật/tắt video
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    // Trong ứng dụng thực tế, bạn sẽ thực hiện các thao tác với video stream
  }

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-background rounded-full shadow-lg p-2 flex items-center gap-2 border border-border animate-bounce">
        <Avatar className="h-8 w-8">
          <AvatarImage src={call.callerImage.url ?? "/placeholder.svg"} alt={call.callerUsername || "User"} />
          <AvatarFallback>{call.callerUsername?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-1">
          {call.type === "voice" ? (
            <Phone className="h-4 w-4 text-green-500" />
          ) : (
            <Video className="h-4 w-4 text-blue-500" />
          )}
          <span className="text-xs font-medium">{formatCallDuration(callDuration)}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMaximize}>
          <Maximize2 className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={onEnd}>
          <PhoneOff className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed z-50 shadow-lg transition-all duration-300",
        active
          ? call.type === "video"
            ? "inset-0 md:inset-4 bg-background rounded-lg flex flex-col"
            : "bottom-4 right-4 w-80 bg-background rounded-lg"
          : "bottom-4 right-4 w-80 bg-background rounded-lg",
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={call.callerImage.url ?? "/placeholder.svg"} alt={call.callerUsername || "User"} />
            <AvatarFallback className="text-2xl">{call.callerUsername?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{call.callerUsername || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {active ? formatCallDuration(callDuration) : call.type === "voice" ? "Cuộc gọi thoại" : "Cuộc gọi video"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {active && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMinimize}>
              <Minimize2 className="h-3 w-3" />
            </Button>
          )}
          {active ? (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={onEnd}>
              <PhoneOff className="h-3 w-3" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onAnswer && onAnswer("reject")}>
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col items-center">
        {call.type === "video" && active ? (
          <div className="relative w-full flex-1 bg-black rounded-lg mb-4 overflow-hidden">
            {/* Video content would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={call.callerImage.url ?? "/placeholder.svg"} alt={call.callerUsername || "User"} />
                <AvatarFallback className="text-2xl">{call.callerUsername?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ) : (
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={call.callerImage.url ?? "/placeholder.svg"} alt={call.callerUsername || "User"} />
            <AvatarFallback className="text-2xl">{call.callerUsername?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        )}

        {!active && <p className="text-sm mb-4">{call.type === "voice" ? "Đang gọi..." : "Cuộc gọi video đến..."}</p>}

        <div className="flex gap-3">
          {active ? (
            <>
              <Button
                variant={isMuted ? "default" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              {call.type === "video" && (
                <Button
                  variant={isVideoOff ? "default" : "outline"}
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </Button>
              )}

              <Button variant="destructive" size="icon" className="h-10 w-10 rounded-full" onClick={onEnd}>
                <PhoneOff className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="destructive"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => onAnswer && onAnswer("reject")}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-green-600 hover:bg-green-700"
                onClick={() => onAnswer && onAnswer("accept")}
              >
                {call.type === "voice" ? <Phone className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
