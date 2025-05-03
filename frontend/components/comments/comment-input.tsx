"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Smile, Send } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CommentInputProps {
  userImage?: string
  userName: string
  onSubmit: (content: string) => void
  placeholder?: string
  autoFocus?: boolean
  replyingTo?: string
  onCancelReply?: () => void
}

export function CommentInput({
  userImage,
  userName,
  onSubmit,
  placeholder = "Viết bình luận...",
  autoFocus = false,
  replyingTo,
  onCancelReply,
}: CommentInputProps) {
  const [content, setContent] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  // Emoji picker
  const emojis = ["😀", "😂", "❤️", "👍", "👏", "🎉", "🔥", "😍", "🤔", "😎", "🙏", "👌", "✨", "🌟", "💯"]

  const handleEmojiClick = (emoji: string) => {
    setContent((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
        <AvatarFallback className="bg-primary/80 text-primary-foreground">{userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 flex items-center bg-muted rounded-full px-3 py-1">
        {replyingTo && (
          <div className="flex items-center mr-2">
            <span className="text-xs text-primary">
              Đang trả lời {replyingTo}{" "}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs hover:bg-transparent"
                onClick={onCancelReply}
              >
                ×
              </Button>
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Smile className="h-4 w-4" />
                <span className="sr-only">Chọn emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <div className="flex flex-wrap gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEmojiClick(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={!content.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Gửi</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
