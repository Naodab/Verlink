"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Smile, Send, ImageIcon, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createComment, validateFile, optimizeImage, type UploadProgress } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface CommentInputProps {
  userImage?: string
  userName: string
  postId: string
  parentId?: string
  onSubmit: (content: string, images?: File[]) => void
  placeholder?: string
  autoFocus?: boolean
  replyingTo?: string
  onCancelReply?: () => void
  onCommentSubmit?: () => void
}

export function CommentInput({
  userImage,
  userName,
  postId,
  parentId,
  onSubmit,
  placeholder = "Viết bình luận...",
  autoFocus = false,
  replyingTo,
  onCancelReply,
  onCommentSubmit,
}: CommentInputProps) {
  const [content, setContent] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { toast } = useToast()

  const inputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)

      // Validate files
      for (const file of newImages) {
        const validation = validateFile(file, {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ["image/"],
        })

        if (!validation.valid) {
          toast({
            title: "Lỗi tải lên",
            description: validation.error,
            variant: "destructive",
          })
          return
        }
      }

      // Optimize images
      const optimizedImages = await Promise.all(
        newImages.map((file) =>
          optimizeImage(file, {
            maxWidth: 1200,
            maxHeight: 800,
            quality: 0.8,
          }),
        ),
      )

      setSelectedImages([...selectedImages, ...optimizedImages])

      // Tạo URL preview cho ảnh
      const newImageUrls = optimizedImages.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
    }
  }

  // Xử lý khi người dùng xóa ảnh
  const handleRemoveImage = (index: number) => {
    // Giải phóng URL object để tránh memory leak
    URL.revokeObjectURL(imagePreviewUrls[index])

    setSelectedImages(selectedImages.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() && selectedImages.length === 0) return

    setIsSubmitting(true)
    setUploadError(null)

    try {
      // Sử dụng API mới để tạo bình luận
      await createComment(
        {
          content,
          postId,
          parentId,
          images: selectedImages,
        },
        (progresses) => {
          setUploadProgress(progresses)
        },
      )

      // Reset form sau khi gửi thành công
      setContent("")
      setSelectedImages([])
      setImagePreviewUrls([])
      setUploadProgress([])

      // Giải phóng URL objects để tránh memory leak
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))

      // Thông báo thành công
      toast({
        title: "Bình luận thành công",
        description: "Bình luận của bạn đã được đăng thành công.",
      })

      // Gọi callback nếu có
      if (onCommentSubmit) {
        onCommentSubmit()
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      setUploadError((error as Error).message || "Đã xảy ra lỗi khi đăng bình luận. Vui lòng thử lại sau.")

      toast({
        title: "Lỗi đăng bình luận",
        description: "Đã xảy ra lỗi khi đăng bình luận. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Emoji picker
  const emojis = ["😀", "😂", "❤️", "👍", "👏", "🎉", "🔥", "😍", "🤔", "😎", "🙏", "👌", "✨", "🌟", "💯"]

  const handleEmojiClick = (emoji: string) => {
    setContent((prev) => prev + emoji)
    inputRef.current?.focus()
  }

  // Ensure userName is defined before using charAt
  const userInitial = userName && typeof userName === "string" ? userName.charAt(0) : "U"

  // Tính toán tổng tiến trình upload
  const totalProgress = uploadProgress.length
    ? uploadProgress.reduce((sum, item) => sum + item.progress, 0) / uploadProgress.length
    : 0

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={userImage || "/placeholder.svg"} alt={userName || "User"} />
          <AvatarFallback className="bg-primary/80 text-primary-foreground">{userInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center bg-muted rounded-full px-3 py-1">
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
              disabled={isSubmitting}
            />
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    disabled={isSubmitting}
                  >
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

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => imageInputRef.current?.click()}
                disabled={isSubmitting}
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Thêm ảnh</span>
              </Button>

              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Gửi</span>
              </Button>
            </div>
          </div>

          {/* Hiển thị ảnh đã chọn */}
          {selectedImages.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-5 w-5 absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị tiến trình upload */}
          {isSubmitting && uploadProgress.length > 0 && (
            <div className="mt-2 space-y-1">
              <Progress value={totalProgress} className="h-1" />
              <p className="text-xs text-muted-foreground">Đang tải lên: {Math.round(totalProgress)}%</p>
            </div>
          )}

          {/* Hiển thị lỗi upload nếu có */}
          {uploadError && (
            <Alert variant="destructive" className="mt-2 py-2">
              <AlertDescription className="text-xs">{uploadError}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Input ẩn cho việc chọn ảnh */}
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
    </form>
  )
}
