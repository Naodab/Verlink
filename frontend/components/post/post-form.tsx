"use client"

import { CardHeader } from "@/components/ui/card"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { ImageIcon, Video, MapPin, X, FileText } from "lucide-react"
import { MediaGrid } from "./media-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PostFormProps {
  onSubmit: (data: {
    content: string
    images: File[]
    videos: File[]
    docs: File[]
    location?: string
    visibility: "PUBLIC" | "FRIENDS" | "PRIVATE"
  }) => Promise<void>
}

export function PostForm({ onSubmit }: PostFormProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedVideos, setSelectedVideos] = useState<File[]>([])
  const [selectedDocs, setSelectedDocs] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([])
  const [location, setLocation] = useState<string>("")
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [manualLocation, setManualLocation] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [visibility, setVisibility] = useState<"PUBLIC" | "FRIENDS" | "PRIVATE">("PUBLIC")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewPost, setPreviewPost] = useState<any>(null)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      content: "",
    },
  })

  const content = watch("content")

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setSelectedImages([...selectedImages, ...newImages])

      // Tạo URL preview cho ảnh
      const newImageUrls = newImages.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
    }
  }

  // Xử lý khi người dùng chọn video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files)
      setSelectedVideos([...selectedVideos, ...newVideos])

      // Tạo URL preview cho video
      const newVideoUrls = newVideos.map((file) => URL.createObjectURL(file))
      setVideoPreviewUrls([...videoPreviewUrls, ...newVideoUrls])
    }
  }

  // Xử lý khi người dùng chọn tài liệu PDF
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files).filter((file) => file.type === "application/pdf")
      setSelectedDocs([...selectedDocs, ...newDocs])
    }
  }

  // Xử lý khi người dùng xóa media
  const handleRemoveMedia = (type: "image" | "video" | "doc", index: number) => {
    if (type === "image") {
      // Giải phóng URL object để tránh memory leak
      URL.revokeObjectURL(imagePreviewUrls[index])

      setSelectedImages(selectedImages.filter((_, i) => i !== index))
      setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
    } else if (type === "video") {
      // Giải phóng URL object để tránh memory leak
      URL.revokeObjectURL(videoPreviewUrls[index])

      setSelectedVideos(selectedVideos.filter((_, i) => i !== index))
      setVideoPreviewUrls(videoPreviewUrls.filter((_, i) => i !== index))
    } else if (type === "doc") {
      setSelectedDocs(selectedDocs.filter((_, i) => i !== index))
    }
  }

  // Xử lý khi người dùng muốn lấy vị trí hiện tại
  const getCurrentLocation = () => {
    setIsGettingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            )
            const data = await response.json()
            const locationName = data.display_name.split(",").slice(0, 3).join(", ")
            setLocation(locationName)
            setIsGettingLocation(false)
            setIsLocationDialogOpen(false)
          } catch (error) {
            console.error("Error getting location:", error)
            setIsGettingLocation(false)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
          setIsGettingLocation(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  // Xử lý khi người dùng nhập vị trí thủ công
  const handleManualLocationSubmit = () => {
    if (manualLocation.trim()) {
      setLocation(manualLocation.trim())
      setIsLocationDialogOpen(false)
    }
  }

  // Xử lý khi người dùng xóa vị trí
  const handleRemoveLocation = () => {
    setLocation("")
  }

  // Xử lý khi người dùng muốn xem trước bài đăng
  const handlePreview = () => {
    setPreviewPost({
      id: "preview",
      content,
      images: imagePreviewUrls,
      videos: videoPreviewUrls,
      docs: selectedDocs.map((doc, index) => ({
        id: `doc-preview-${index}`,
        url: URL.createObjectURL(doc),
        name: doc.name,
        type: doc.type,
        size: doc.size,
      })),
      location,
      visibility,
      createdAt: new Date(),
      author: {
        id: user?.id || "user",
        name: user?.name || "User",
        image: user?.profileImage,
      },
    })
    setIsPreviewOpen(true)
  }

  // Xử lý khi người dùng đăng bài
  const handleFormSubmit = async (data: { content: string }) => {
    if (
      !data.content.trim() &&
      selectedImages.length === 0 &&
      selectedVideos.length === 0 &&
      selectedDocs.length === 0
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        content: data.content,
        images: selectedImages,
        videos: selectedVideos,
        docs: selectedDocs,
        location: location || undefined,
        visibility,
      })

      // Reset form sau khi đăng thành công
      reset()
      setSelectedImages([])
      setSelectedVideos([])
      setSelectedDocs([])
      setImagePreviewUrls([])
      setVideoPreviewUrls([])
      setLocation("")
      setVisibility("PUBLIC")

      // Giải phóng URL objects để tránh memory leak
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Giải phóng URL objects khi component unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls, videoPreviewUrls])

  const isFormValid =
    content.trim() || selectedImages.length > 0 || selectedVideos.length > 0 || selectedDocs.length > 0

  return (
    <Card className="card-hover">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={`${user?.name || "Bạn"} ơi, bạn đang nghĩ gì?`}
                className="resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50"
                {...register("content")}
              />

              {/* Hiển thị vị trí nếu có */}
              {location && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{location}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-1 text-muted-foreground"
                    onClick={handleRemoveLocation}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* Hiển thị media đã chọn */}
              {(selectedImages.length > 0 || selectedVideos.length > 0 || selectedDocs.length > 0) && (
                <div className="mt-3">
                  <MediaGrid
                    images={imagePreviewUrls}
                    videos={videoPreviewUrls}
                    docs={selectedDocs.map((doc, index) => ({
                      id: `doc-${index}`,
                      url: URL.createObjectURL(doc),
                      name: doc.name,
                      type: doc.type,
                      size: doc.size,
                    }))}
                    editable={true}
                    onRemove={handleRemoveMedia}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col px-4 py-3 border-t">
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() => imageInputRef.current?.click()}
                    >
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm ảnh</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Video className="h-5 w-5 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm video</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() => docInputRef.current?.click()}
                    >
                      <FileText className="h-5 w-5 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm tài liệu PDF</TooltipContent>
                </Tooltip>

                <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                          <MapPin className="h-5 w-5 text-primary" />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Thêm vị trí</TooltipContent>
                  </Tooltip>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Thêm vị trí</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {isGettingLocation ? "Đang lấy vị trí..." : "Sử dụng vị trí hiện tại"}
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="manual-location">Hoặc nhập vị trí thủ công</Label>
                        <Input
                          id="manual-location"
                          placeholder="Nhập tên địa điểm..."
                          value={manualLocation}
                          onChange={(e) => setManualLocation(e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        className="w-full"
                        onClick={handleManualLocationSubmit}
                        disabled={!manualLocation.trim()}
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </TooltipProvider>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Quyền riêng tư" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Công khai</SelectItem>
                  <SelectItem value="FRIENDS">Chỉ bạn bè</SelectItem>
                  <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!isFormValid || isSubmitting}
              >
                Xem trước
              </Button>

              <Button type="submit" size="sm" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? "Đang đăng..." : "Đăng"}
              </Button>
            </div>
          </div>
        </CardFooter>
      </form>

      {/* Input ẩn cho việc chọn ảnh */}
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />

      {/* Input ẩn cho việc chọn video */}
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        multiple
        onChange={handleVideoChange}
      />

      {/* Input ẩn cho việc chọn tài liệu PDF */}
      <input
        type="file"
        ref={docInputRef}
        className="hidden"
        accept="application/pdf"
        multiple
        onChange={handleDocChange}
      />

      {/* Dialog xem trước bài đăng */}
      {isPreviewOpen && previewPost && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Xem trước bài đăng</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex items-center flex-1">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user?.name || "User"}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{new Date().toLocaleString("vi-VN")}</span>
                        {location && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="whitespace-pre-line">{content}</p>
                    <MediaGrid
                      images={imagePreviewUrls}
                      videos={videoPreviewUrls}
                      docs={previewPost.docs}
                      editable={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsPreviewOpen(false)}>Đóng</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
