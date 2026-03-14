"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageSquare, Share, Globe, Users, Lock } from "lucide-react"
import { PostReactions } from "@/components/post-reactions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentsSection } from "./comments/comments-section"
import { MediaGrid } from "./post/media-grid"
import { SavePostButton } from "./post/save-post-button"
import { Media } from "@/types/models/media"
import { PostData } from "@/types/dto/response/post-data"

interface PostCardProps {
  post: PostData
  onCommentClick?: (postId: string | number) => void
  onShareClick?: (postId: string | number) => void
}

// Thêm hàm để lấy icon và label cho quyền riêng tư
const getPrivacyIcon = (visibility: string) => {
  switch (visibility) {
    case "FRIENDS":
      return <Users className="h-3 w-3" />
    case "PRIVATE":
      return <Lock className="h-3 w-3" />
    case "PUBLIC":
    default:
      return <Globe className="h-3 w-3" />
  }
}

const getPrivacyLabel = (visibility: string) => {
  switch (visibility) {
    case "FRIENDS":
      return "Chỉ bạn bè"
    case "PRIVATE":
      return "Riêng tư"
    case "PUBLIC":
    default:
      return "Công khai"
  }
}

// Hàm kiểm tra xem một media có phải là MediaFile object hay không
const isMediaFile = (media: any): media is Media => {
  return media && typeof media === "object" && "id" in media && "url" in media
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

  // Cập nhật hàm prepareImages và prepareVideos để xử lý đúng URL

  // Chuẩn bị dữ liệu media cho MediaGrid
  const prepareImages = () => {
    if (!post.images) return []
    return post.images.map((img) => {
      if (isMediaFile(img)) {
        return img.url
      }
      return img // Đã là URL string
    })
  }

  const prepareVideos = () => {
    if (!post.videos) return []
    return post.videos.map((vid) => {
      if (isMediaFile(vid)) {
        return vid.url
      }
      return vid // Đã là URL string
    })
  }

  const prepareDocs = () => {
    return post.docs || []
  }

  return (
    <Card className="overflow-hidden card-hover mb-6">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Link href={post.author.profileUrl ?? `/profile/${post.author.id}`} className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={post.author.profileImage?.url ?? "/placeholder.svg"} alt={post.author.username} />
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
              <span className="mx-1">•</span>
              <span className="flex items-center">
                {getPrivacyIcon(post.visibility)}
                <span className="ml-1">{getPrivacyLabel(post.visibility)}</span>
              </span>
              {post.isEdited && (
                <>
                  <span className="mx-1">•</span>
                  <span>Đã chỉnh sửa</span>
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

          {/* Sử dụng MediaGrid component để hiển thị media */}
          <MediaGrid
            images={prepareImages()}
            videos={prepareVideos()}
            docs={prepareDocs()}
            editable={false}
            videoFirst={true}
          />
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
            <SavePostButton postId={post.id} />
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

        {showComments && <CommentsSection postId={post.id} initialComments={post.comments || []} />}
      </CardFooter>
    </Card>
  )
}
