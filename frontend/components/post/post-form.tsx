"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Smile, MapPin, X, Video, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PostFormProps {
  onSubmit: (data: {
    content: string
    images: File[]
    videos: File[]
    location?: string
  }) => Promise<void>
}

export function PostForm({ onSubmit }: PostFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [videos, setVideos] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([])
  const [location, setLocation] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Emoji picker
  const emojis = ["😀", "😂", "❤️", "👍", "👏", "🎉", "🔥", "😍", "🤔", "😎", "🙏", "👌", "✨", "🌟", "💯"]

  const handleEmojiClick = (emoji: string) => {
    setContent((prev) => prev + emoji)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...selectedFiles])

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setVideos((prev) => [...prev, ...selectedFiles])

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file))
      setVideoPreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(videoPreviewUrls[index])

    setVideos((prev) => prev.filter((_, i) => i !== index))
    setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const getLocation = () => {
    setIsLoadingLocation(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Sử dụng Nominatim OpenStreetMap API (miễn phí) thay vì Google Maps
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            )
            const data = await response.json()

            // Lấy thông tin địa điểm
            let locationName = ""
            if (data.address) {
              const { road, suburb, city, town, village, state, country } = data.address
              locationName = [road, suburb, city || town || village, state, country]
                .filter(Boolean)
                .slice(0, 2)
                .join(", ")
            } else {
              locationName = data.display_name.split(",").slice(0, 2).join(",")
            }

            setLocation(locationName)
          } catch (error) {
            console.error("Error getting location:", error)
            setLocation("Không thể xác định vị trí")
          } finally {
            setIsLoadingLocation(false)
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error)
          setLocation("Không thể xác định vị trí")
          setIsLoadingLocation(false)
        },
      )
    } else {
      setLocation("Trình duyệt không hỗ trợ định vị")
      setIsLoadingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && images.length === 0 && videos.length === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        content,
        images,
        videos,
        location: location ?? undefined,
      })

      // Reset form
      setContent("")
      setImages([])
      setVideos([])
      setImagePreviewUrls([])
      setVideoPreviewUrls([])
      setLocation(null)
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url))
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreviewUrls, videoPreviewUrls])

  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImage?.url ?? "/placeholder.svg"} alt={user?.username ?? ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.username?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Bạn đang nghĩ gì?"
                className="resize-none border-none focus-visible:ring-1 focus-visible:ring-primary/50 bg-muted/50"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={`img-${index}`} className="relative rounded-md overflow-hidden">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video Previews */}
              {videoPreviewUrls.length > 0 && (
                <div className="mt-3 space-y-2">
                  {videoPreviewUrls.map((url, index) => (
                    <div key={`video-${index}`} className="relative rounded-md overflow-hidden">
                      <video src={url} controls className="w-full h-48 object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => removeVideo(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Location */}
              {location && (
                <div className="mt-3 flex items-center bg-muted/50 rounded-md p-2">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{location}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-auto"
                    onClick={() => setLocation(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center">
                <div className="flex space-x-2 flex-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Ảnh
                  </Button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoChange}
                  />

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
                        <Smile className="h-4 w-4 mr-2" />
                        Cảm xúc
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
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
                    size="sm"
                    className="text-muted-foreground"
                    onClick={getLocation}
                    disabled={isLoadingLocation}
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4 mr-2" />
                    )}
                    Vị trí
                  </Button>
                </div>
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={(content.trim() === "" && images.length === 0 && videos.length === 0) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang đăng...
                    </>
                  ) : (
                    "Đăng"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
