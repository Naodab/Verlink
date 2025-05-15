"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Play, Plus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaPreview } from "./media-preview"
import type { MediaFile } from "@/components/post-card"

// Cập nhật interface MediaGridProps để làm rõ rằng images và videos là mảng URL

interface MediaGridProps {
  images: string[] // URLs của ảnh
  videos: string[] // URLs của video
  docs?: MediaFile[] // Thông tin đầy đủ của tài liệu
  editable?: boolean
  onRemove?: (type: "image" | "video" | "doc", index: number) => void
  videoFirst?: boolean
}

// Hàm kiểm tra xem một media có phải là MediaFile object hay không
const isMediaFile = (media: any): media is MediaFile => {
  return media && typeof media === "object" && "id" in media && "url" in media
}

// Hàm lấy URL từ media (có thể là string hoặc MediaFile)
const getMediaUrl = (media: string | MediaFile): string => {
  if (isMediaFile(media)) {
    return media.url
  }
  return media
}

// Hàm lấy tên file từ media
const getMediaName = (media: string | MediaFile): string => {
  if (isMediaFile(media)) {
    return media.name
  }
  // Nếu là string URL, lấy phần cuối cùng sau dấu /
  const parts = media.split("/")
  return parts[parts.length - 1]
}

export function MediaGrid({
  images,
  videos = [],
  docs = [],
  editable = false,
  onRemove,
  videoFirst = false,
}: MediaGridProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previewType, setPreviewType] = useState<"image" | "video">("image")

  const hasImages = images && images.length > 0
  const hasVideos = videos && videos.length > 0
  const hasDocs = docs && docs.length > 0
  const hasMedia = hasImages || hasVideos || hasDocs

  if (!hasMedia) return null

  // Sắp xếp media theo thứ tự ưu tiên (video trước hoặc ảnh trước)
  const allMedia = [...(hasImages ? images : []), ...(hasVideos ? videos : [])]
  const sortedMedia = videoFirst
    ? [...(hasVideos ? videos : []), ...(hasImages ? images : [])]
    : [...(hasImages ? images : []), ...(hasVideos ? videos : [])]

  // Xác định layout dựa trên số lượng media
  const getGridLayout = () => {
    const totalMedia = (hasImages ? images.length : 0) + (hasVideos ? videos.length : 0)

    if (totalMedia === 1) return "grid-cols-1"
    if (totalMedia === 2) return "grid-cols-2"
    if (totalMedia === 3) return "grid-cols-2"
    if (totalMedia === 4) return "grid-cols-2"
    return "grid-cols-3"
  }

  // Xác định kích thước của từng item dựa trên layout
  const getItemClass = (index: number) => {
    const totalMedia = (hasImages ? images.length : 0) + (hasVideos ? videos.length : 0)

    if (totalMedia === 1) return "col-span-1 row-span-2"
    if (totalMedia === 2) return "col-span-1 row-span-2"
    if (totalMedia === 3 && index === 0) return "col-span-2 row-span-2"
    if (totalMedia === 4 && index < 2) return "col-span-1 row-span-1"
    return "col-span-1 row-span-1"
  }

  // Xác định media type
  const getMediaType = (media: string | MediaFile): "image" | "video" => {
    if (isMediaFile(media)) {
      return media.type.startsWith("video/") ? "video" : "image"
    }
    return media.includes("Video") ? "video" : "image"
  }

  // Xử lý khi click vào media để mở preview
  const handleMediaClick = (index: number, type: "image" | "video") => {
    setPreviewIndex(index)
    setPreviewType(type)
    setIsPreviewOpen(true)
  }

  // Xử lý khi click vào nút xóa
  const handleRemove = (type: "image" | "video" | "doc", mediaIndex: number) => {
    if (onRemove) {
      onRemove(type, mediaIndex)
    }
  }

  // Xử lý khi click vào file PDF để mở trong tab mới
  const handleDocClick = (doc: MediaFile) => {
    window.open(doc.url, "_blank")
  }

  return (
    <div className="space-y-4">
      {/* Grid hiển thị ảnh và video */}
      {(hasImages || hasVideos) && (
        <div className={`grid ${getGridLayout()} gap-1 rounded-lg overflow-hidden`}>
          {sortedMedia.slice(0, 5).map((media, index) => {
            const mediaUrl = getMediaUrl(media)
            const mediaType = getMediaType(media)
            const isVideo = mediaType === "video"

            return (
              <div key={`media-${index}`} className={`relative ${getItemClass(index)} overflow-hidden bg-muted`}>
                <div className="w-full h-full cursor-pointer group" onClick={() => handleMediaClick(index, mediaType)}>
                  <Image
                    src={mediaUrl || "/placeholder.svg"}
                    alt={`Media ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay cho video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="bg-black/50 rounded-full p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                        Video
                      </span>
                    </div>
                  )}

                  {/* Hiển thị "+n" nếu có nhiều hơn 5 media */}
                  {index === 4 && allMedia.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-white text-xl font-bold flex items-center">
                        <Plus className="h-6 w-6 mr-1" />
                        {allMedia.length - 5}
                      </div>
                    </div>
                  )}
                </div>

                {/* Nút xóa nếu editable = true */}
                {editable && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() =>
                      handleRemove(isVideo ? "video" : "image", isVideo ? videos.indexOf(media) : images.indexOf(media))
                    }
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Hiển thị danh sách file PDF */}
      {hasDocs && (
        <div className="space-y-2 mt-2">
          {docs.map((doc, index) => (
            <div
              key={`doc-${index}`}
              className="flex items-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
            >
              <FileText className="h-5 w-5 mr-2 text-primary" />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate">{doc.name}</div>
                <div className="text-xs text-muted-foreground">{(doc.size / 1024 / 1024).toFixed(2)} MB • PDF</div>
              </div>
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleDocClick(doc)}>
                Mở
              </Button>
              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleRemove("doc", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media Preview */}
      {isPreviewOpen && (
        <MediaPreview
          media={
            previewType === "image" ? images.map((img) => getMediaUrl(img)) : videos.map((vid) => getMediaUrl(vid))
          }
          mediaType={previewType}
          initialIndex={previewIndex}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  )
}
