"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SavePostButtonProps {
  postId: string | number
  initialSaved?: boolean
}

export function SavePostButton({ postId, initialSaved = false }: SavePostButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)

  const handleSavePost = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để lưu/bỏ lưu bài viết
      await new Promise((resolve) => setTimeout(resolve, 800)) // Giả lập API call

      setIsSaved(!isSaved)

      toast({
        title: isSaved ? "Đã bỏ lưu bài viết" : "Đã lưu bài viết",
        description: isSaved
          ? "Bài viết đã được xóa khỏi danh sách đã lưu"
          : "Bài viết đã được thêm vào danh sách đã lưu",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện thao tác. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 hover:bg-muted ${isSaved ? "text-primary" : ""}`}
      onClick={handleSavePost}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
      ) : (
        <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-current" : ""}`} />
      )}
      <span>{isSaved ? "Đã lưu" : "Lưu"}</span>
    </Button>
  )
}
