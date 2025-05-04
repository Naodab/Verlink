"use client"

import { formatDistance } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ThumbsUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface CommentAuthor {
  id: string | number
  username: string
  image?: string
  profileUrl?: string
}

export interface CommentData {
  id: string | number
  content: string
  createdAt: string | Date
  author: CommentAuthor
  likes: number
  isLiked?: boolean
  replies?: CommentData[]
}

interface CommentItemProps {
  comment: CommentData
  onReply?: (commentId: string | number) => void
  onLike?: (commentId: string | number) => void
  onDelete?: (commentId: string | number) => void
  isReply?: boolean
}

export function CommentItem({ comment, onReply, onLike, onDelete, isReply = false }: CommentItemProps) {
  const formattedDate =
    typeof comment.createdAt === "string"
      ? formatDistance(new Date(comment.createdAt), new Date(), {
          addSuffix: true,
          locale: vi,
        })
      : formatDistance(comment.createdAt, new Date(), {
          addSuffix: true,
          locale: vi,
        })

  return (
    <div className={`flex gap-2 ${isReply ? "ml-12 mt-2" : "mt-4"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.author.image ?? "/placeholder.svg"} alt={comment.author.username} />
        <AvatarFallback className="bg-primary/80 text-primary-foreground">
          {comment.author.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-muted rounded-2xl px-3 py-2">
          <div className="font-medium text-sm">{comment.author.username}</div>
          <p className="text-sm break-words">{comment.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs">
          <Button
            variant="ghost"
            size="sm"
            className={`h-auto py-0 px-1 ${comment.isLiked ? "text-primary font-medium" : "text-muted-foreground"}`}
            onClick={() => onLike && onLike(comment.id)}
          >
            Thích
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-0 px-1 text-muted-foreground"
            onClick={() => onReply && onReply(comment.id)}
          >
            Phản hồi
          </Button>
          <span className="text-muted-foreground">{formattedDate}</span>
          {comment.likes > 0 && (
            <div className="flex items-center gap-1 ml-1">
              <div className="bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center">
                <ThumbsUp className="h-2 w-2" />
              </div>
              <span className="text-muted-foreground">{comment.likes}</span>
            </div>
          )}
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onLike={onLike}
                onDelete={onDelete}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <MoreHorizontal className="h-3 w-3" />
            <span className="sr-only">Tùy chọn</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
          <DropdownMenuItem>Báo cáo</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => onDelete && onDelete(comment.id)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
