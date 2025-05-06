"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ThumbsUp, Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type ReactionType = "like" | "love" | "haha" | "wow" | "angry" | null

interface ReactionOption {
  type: ReactionType
  emoji: string
  label: string
  color: string
}

const reactionOptions: ReactionOption[] = [
  { type: "like", emoji: "👍", label: "Thích", color: "text-blue-500" },
  { type: "love", emoji: "❤️", label: "Yêu thích", color: "text-red-500" },
  { type: "haha", emoji: "😂", label: "Haha", color: "text-yellow-500" },
  { type: "wow", emoji: "😮", label: "Wow", color: "text-yellow-500" },
  { type: "angry", emoji: "😡", label: "Phẫn nộ", color: "text-orange-500" },
]

interface PostReactionsProps {
  postId: string
}

export function PostReactions({ postId }: PostReactionsProps) {
  const [currentReaction, setCurrentReaction] = useState<ReactionType>(null)
  const [reactionCounts, setReactionCounts] = useState({
    like: Math.floor(Math.random() * 50),
    love: Math.floor(Math.random() * 30),
    haha: Math.floor(Math.random() * 20),
    wow: Math.floor(Math.random() * 10),
    angry: Math.floor(Math.random() * 5),
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleReaction = (reaction: ReactionType) => {
    // If clicking the same reaction, remove it
    if (currentReaction === reaction) {
      setReactionCounts((prev) => ({
        ...prev,
        [reaction]: Math.max(0, prev[reaction as keyof typeof prev] - 1),
      }))
      setCurrentReaction(null)
    }
    // If changing reaction, decrement old one and increment new one
    else if (currentReaction) {
      setReactionCounts((prev) => ({
        ...prev,
        [currentReaction]: Math.max(0, prev[currentReaction as keyof typeof prev] - 1),
        [reaction as string]: prev[reaction as keyof typeof prev] + 1,
      }))
      setCurrentReaction(reaction)
    }
    // If no previous reaction, just increment the new one
    else {
      setReactionCounts((prev) => ({
        ...prev,
        [reaction as string]: prev[reaction as keyof typeof prev] + 1,
      }))
      setCurrentReaction(reaction)
    }

    setIsOpen(false)
  }

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)

  // Get the current reaction details
  const getCurrentReaction = () => {
    if (!currentReaction) return null
    return reactionOptions.find((option) => option.type === currentReaction)
  }

  const currentReactionDetails = getCurrentReaction()

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-1">
        {totalReactions > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex -space-x-1 mr-1">
              {Object.entries(reactionCounts)
                .filter(([_, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([type]) => {
                  const reaction = reactionOptions.find((r) => r.type === type)
                  return reaction ? (
                    <div key={type} className="w-4 h-4 flex items-center justify-center rounded-full bg-background">
                      {reaction.emoji}
                    </div>
                  ) : null
                })}
            </div>
            <span>{totalReactions}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 hover:bg-muted ${currentReactionDetails?.color || ""}`}
            >
              {currentReactionDetails ? (
                <>
                  <span className="text-lg mr-1">{currentReactionDetails.emoji}</span>
                  <span>{currentReactionDetails.label}</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Thích</span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1" align="start">
            <div className="flex space-x-1">
              {reactionOptions.map((reaction) => (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1 h-auto hover:bg-muted transition-transform hover:scale-125"
                  onClick={() => handleReaction(reaction.type)}
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-muted">
          <Smile className="h-4 w-4 mr-1" />
          <span>Bình luận</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-muted">
          <Heart className="h-4 w-4 mr-1" />
          <span>Chia sẻ</span>
        </Button>
      </div>
    </div>
  )
}
