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

  const getImageGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-2"
      case 3:
        return "grid-cols-2"
      default:
        return "grid-cols-2"
    }
  }

  const getImagePositionClass = (count: number, index: number) => {
    if (count === 1) {
      return "aspect-video"
    }

    if (count === 2) {
      return "aspect-square"
    }

    if (count === 3) {
      if (index === 0) {
        return "row-span-2 aspect-[4/5]"
      }
      return "aspect-square"
    }

    if (count >= 4) {
      if (index === 0) {
        return "row-span-2 aspect-[4/5]"
      }
      return "aspect-square"
    }

    return ""
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
                <div className={`grid gap-1 ${getImageGridLayout(post.images.length)}`}>
                  {post.images.slice(0, Math.min(post.images.length, 4)).map((image, index) => {
                    // Nếu là ảnh cuối cùng và có nhiều hơn 4 ảnh, hiển thị overlay
                    const isLastWithMore = index === 3 && post.images && post.images.length > 4

                    return (
                        <div
                            key={index}
                            className={`relative rounded-lg overflow-hidden ${getImagePositionClass(
                                post.images?.length ?? 0,
                                index,
                            )}`}
                        >
                          <img
                              src={image || "/placeholder.svg"}
                              alt={`Ảnh bài đăng ${index + 1}`}
                              className="w-full h-full object-cover"
                          />

                          {isLastWithMore && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">+{post.images.length - 4}</span>
                              </div>
                          )}
                        </div>
                    )
                  })}
                </div>
            )}

            {/* Videos */}
            {post.videos && post.videos.length > 0 && (
                <div className={`grid gap-1 ${getImageGridLayout(post.videos.length)}`}>
                  {post.videos.slice(0, Math.min(post.videos.length, 4)).map((video, index) => {
                    // Nếu là video cuối cùng và có nhiều hơn 4 video, hiển thị overlay
                    const isLastWithMore = index === 3 && post.videos && post.videos.length > 4

                    return (
                        <div
                            key={index}
                            className={`relative rounded-lg overflow-hidden ${getImagePositionClass(
                                post.videos?.length || 0,
                                index,
                            )}`}
                        >
                          <video
                              src={video}
                              controls
                              className="w-full h-full object-cover"
                              poster="/placeholder.svg?height=400&width=600&text=Video+Thumbnail"
                          />

                          {isLastWithMore && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">+{post.videos.length - 4}</span>
                              </div>
                          )}
                        </div>
                    )
                  })}
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
