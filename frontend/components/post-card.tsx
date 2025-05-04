"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageSquare, Share } from "lucide-react"
import { PostReactions } from "@/components/post-reactions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentsSection } from "./comments/comments-section"
import type { CommentData } from "./comments/comment-item"

export interface PostAuthor {
  id: string | number
  username: string
  image?: string
  profileUrl?: string
}

export interface PostData {
  id: string | number
  content: string
  images?: string[]
  videos?: string[]
  location?: string
  createdAt: string | Date
  author: PostAuthor
  commentsCount?: number
  sharesCount?: number
  comments?: CommentData[]
}

interface PostCardProps {
  post: PostData
  onCommentClick?: (postId: string | number) => void
  onShareClick?: (postId: string | number) => void
}

export function PostCard({ post, onCommentClick, onShareClick }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const maxLength = 280 // Độ dài tối đa của nội dung hiển thị ban đầu

  const formattedDate =
    typeof post.createdAt === "string"
      ? new Date(post.createdAt).toLocaleString("vi-VN", {
          day: "numeric",
          month: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : post.createdAt.toLocaleString("vi-VN", {
          day: "numeric",
          month: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })

  const isLongContent = post.content.length > maxLength
  const displayContent = isLongContent && !isExpanded ? `${post.content.substring(0, maxLength)}...` : post.content

  const handleCommentClick = () => {
    setShowComments(!showComments)
    if (onCommentClick) onCommentClick(post.id)
  }

  return (
    <Card className="overflow-hidden card-hover mb-6">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Link href={post.author.profileUrl ?? `/profile/${post.author.id}`} className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={post.author.image ?? "/placeholder.svg"} alt={post.author.username} />
            <AvatarFallback className="bg-primary/80 text-primary-foreground">
              {post.author.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author.username}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{formattedDate}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">Tùy chọn</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
            <DropdownMenuItem>Sao chép liên kết</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Báo cáo bài viết</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="whitespace-pre-line">{displayContent}</p>
            {isLongContent && (
              <Button
                variant="link"
                className="p-0 h-auto text-muted-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </Button>
            )}
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={`grid gap-2 ${
                post.images.length === 1
                  ? "grid-cols-1"
                  : post.images.length === 2
                    ? "grid-cols-2"
                    : post.images.length === 3
                      ? "grid-cols-2"
                      : "grid-cols-2"
              }`}
            >
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden ${
                    post.images && post.images.length === 3 && index === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Ảnh bài đăng ${index + 1}`}
                    className="w-full h-full object-cover aspect-video transition-transform hover:scale-105 duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Videos */}
          {post.videos && post.videos.length > 0 && (
            <div className="space-y-2">
              {post.videos.map((video, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <video
                    src={video}
                    controls
                    className="w-full"
                    poster="/placeholder.svg?height=400&width=600&text=Video+Thumbnail"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col border-t px-6 py-3 bg-muted/30">
        <div className="w-full">
          <PostReactions postId={`post-${post.id}`} />
          <div className="flex justify-between mt-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-muted"
              onClick={handleCommentClick}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Bình luận{post.commentsCount ? ` (${post.commentsCount})` : ""}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-muted"
              onClick={() => onShareClick && onShareClick(post.id)}
            >
              <Share className="h-4 w-4 mr-1" />
              <span>Chia sẻ{post.sharesCount ? ` (${post.sharesCount})` : ""}</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && <CommentsSection postId={post.id} initialComments={post.comments || []} />}
      </CardFooter>
    </Card>
  )
}
