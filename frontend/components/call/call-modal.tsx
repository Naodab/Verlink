"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, MicOff, Mic } from "lucide-react"
import { CallData } from "@/types/dto/response/call-data"

interface CallModalProps {
  call: CallData
  active?: boolean
  onAnswer?: (answer: "accept" | "reject" | "missed") => void
  onEnd?: () => void
}

export function CallModal({ call, active = false, onAnswer, onEnd }: CallModalProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

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

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClose = () => {
    if (!active && onAnswer) {
      onAnswer("missed")
    }
    setIsOpen(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={call.callerImage.url ?? "/placeholder.svg"} alt={call.callerUsername} />
            <AvatarFallback className="text-2xl">{call.callerUsername.charAt(0)}</AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-semibold mb-1">{call.callerUsername}</h2>

          {active ? (
            <p className="text-sm text-muted-foreground mb-6">{formatCallDuration(callDuration)}</p>
          ) : (
            <p className="text-sm text-muted-foreground mb-6">Đang gọi...</p>
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
                  <Phone className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
