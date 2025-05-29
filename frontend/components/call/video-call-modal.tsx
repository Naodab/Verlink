"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Video, VideoOff, PhoneOff, MicOff, Mic } from "lucide-react"

interface CallData {
  id: string
  callerId: number | string
  callerName: string
  callerImage: string
  timestamp: string
  roomId: string
}

interface VideoCallModalProps {
  call: CallData
  active?: boolean
  onAnswer?: (answer: "accept" | "reject" | "missed") => void
  onEnd?: () => void
}

export function VideoCallModal({ call, active = false, onAnswer, onEnd }: VideoCallModalProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  // Tính thời gian cuộc gọi
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (active) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      // Trong ứng dụng thực tế, bạn sẽ thiết lập kết nối WebRTC ở đây
      // Giả lập hiển thị video
      if (localVideoRef.current) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream
            }
          })
          .catch(console.error)
      }
    }

    return () => {
      if (interval) clearInterval(interval)

      // Dọn dẹp stream khi component unmount
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [active])

  // Format thời gian cuộc gọi
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Xử lý khi đóng modal
  const handleClose = () => {
    if (!active && onAnswer) {
      onAnswer("missed")
    }
    setIsOpen(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} className="max-w-3xl">
      <DialogContent className="sm:max-w-3xl">
        <div className="flex flex-col items-center justify-center py-4">
          {active ? (
            <div className="relative w-full h-[400px] bg-black rounded-lg mb-4 overflow-hidden">
              {/* Video của người gọi */}
              <video
                ref={remoteVideoRef}
                className={`absolute inset-0 w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
                autoPlay
                playsInline
              />

              {/* Hiển thị avatar nếu video bị tắt */}
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={call.callerImage || "/placeholder.svg"} alt={call.callerName} />
                    <AvatarFallback className="text-4xl">{call.callerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Video của bạn (nhỏ ở góc) */}
              <div className="absolute bottom-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-background">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              </div>

              {/* Thời gian cuộc gọi */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {formatCallDuration(callDuration)}
              </div>

              {/* Tên người gọi */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                {call.callerName}
              </div>
            </div>
          ) : (
            <>
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={call.callerImage || "/placeholder.svg"} alt={call.callerName} />
                <AvatarFallback className="text-2xl">{call.callerName.charAt(0)}</AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-semibold mb-1">{call.callerName}</h2>

              <p className="text-sm text-muted-foreground mb-6">Cuộc gọi video đến...</p>
            </>
          )}

          <div className="flex gap-4">
            {active ? (
              <>
                <Button
                  variant={isMuted ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isVideoOff ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={toggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>

                <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={onEnd}>
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => onAnswer && onAnswer("reject")}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>

                <Button
                  variant="default"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700"
                  onClick={() => onAnswer && onAnswer("accept")}
                >
                  <Video className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
