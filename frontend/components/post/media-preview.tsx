"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight, MessageSquare, Share } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PostReactions } from "@/components/post-reactions"
import { CommentsSection } from "@/components/comments/comments-section"

interface MediaPreviewProps {
  media: string[]
  mediaType: "image" | "video"
  initialIndex?: number
  onClose: () => void
  isOpen: boolean
  content?: string
  author?: {
    name: string
    image?: string
  }
}

export function MediaPreview({
  media,
  mediaType,
  initialIndex = 0,
  onClose,
  isOpen,
  content,
  author,
}: MediaPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      handleNext()
    } else if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 bg-black/90 border-none flex"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Media Display - Left Side */}
        <div className="relative w-full md:w-3/4 h-full flex items-center justify-center">
          <DialogClose className="absolute top-4 right-4 z-50">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>

          <div className="flex items-center justify-center w-full h-full">
            {mediaType === "image" ? (
              <img
                src={media[currentIndex] || "/placeholder.svg"}
                alt={`Media ${currentIndex + 1}`}
                className="max-h-[90vh] max-w-full object-contain"
              />
            ) : (
              <video src={media[currentIndex]} controls autoPlay className="max-h-[90vh] max-w-full object-contain" />
            )}
          </div>

          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {media.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-white/50"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {media.length}
          </div>
        </div>

        {/* Content Display - Right Side */}
        <div className="hidden md:flex md:w-1/4 bg-background flex-col h-[95vh] border-l">
          {author && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.image || "/placeholder.svg"} alt={author.name} />
                  <AvatarFallback className="bg-primary/80 text-primary-foreground">
                    {author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{author.name}</div>
                  <div className="text-xs text-muted-foreground">Vừa xong</div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 flex-1 overflow-y-auto">
            {content && <p className="whitespace-pre-line mb-4">{content}</p>}

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <PostReactions postId={`media-${currentIndex}`} />
            </div>

            <div className="flex justify-between mt-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 hover:bg-muted"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>Bình luận</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-muted">
                <Share className="h-4 w-4 mr-1" />
                <span>Chia sẻ</span>
              </Button>
            </div>

            {showComments && (
              <div className="mt-4">
                <CommentsSection postId={`media-${currentIndex}`} initialComments={[]} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
