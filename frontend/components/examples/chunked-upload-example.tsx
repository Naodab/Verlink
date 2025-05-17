"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createPost, updatePost, type PostData, type UploadProgress } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, FileText, ImageIcon, RefreshCcw, Video, X } from "lucide-react"

export function ChunkedUploadExample() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"create" | "edit">("create")

  // State cho việc tạo bài viết mới
  const [content, setContent] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedVideos, setSelectedVideos] = useState<File[]>([])
  const [selectedDocs, setSelectedDocs] = useState<File[]>([])
  const [visibility, setVisibility] = useState<"PUBLIC" | "FRIENDS" | "PRIVATE">("PUBLIC")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)

  // State cho việc chỉnh sửa bài viết
  const [editPostId, setEditPostId] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editImages, setEditImages] = useState<(File | string)[]>([])
  const [editVideos, setEditVideos] = useState<(File | string)[]>([])
  const [editDocs, setEditDocs] = useState<(File | any)[]>([])
  const [editVisibility, setEditVisibility] = useState<"PUBLIC" | "FRIENDS" | "PRIVATE">("PUBLIC")
  const [isEditing, setIsEditing] = useState(false)
  const [editUploadProgress, setEditUploadProgress] = useState<UploadProgress[]>([])
  const [editUploadError, setEditUploadError] = useState<string | null>(null)

  // Refs cho input file
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const editImageInputRef = useRef<HTMLInputElement>(null)
  const editVideoInputRef = useRef<HTMLInputElement>(null)
  const editDocInputRef = useRef<HTMLInputElement>(null)

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  // Xử lý khi người dùng chọn video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files)
      setSelectedVideos([...selectedVideos, ...newVideos])
    }
  }

  // Xử lý khi người dùng chọn tài liệu
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files)
      setSelectedDocs([...selectedDocs, ...newDocs])
    }
  }

  // Xử lý khi người dùng chọn ảnh để chỉnh sửa
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files)
      setEditImages([...editImages, ...newImages])
    }
  }

  // Xử lý khi người dùng chọn video để chỉnh sửa
  const handleEditVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newVideos = Array.from(e.target.files)
      setEditVideos([...editVideos, ...newVideos])
    }
  }

  // Xử lý khi người dùng chọn tài liệu để chỉnh sửa
  const handleEditDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocs = Array.from(e.target.files)
      setEditDocs([...editDocs, ...newDocs])
    }
  }

  // Xử lý khi người dùng xóa media
  const handleRemoveMedia = (type: "image" | "video" | "doc", index: number) => {
    if (type === "image") {
      setSelectedImages(selectedImages.filter((_, i) => i !== index))
    } else if (type === "video") {
      setSelectedVideos(selectedVideos.filter((_, i) => i !== index))
    } else if (type === "doc") {
      setSelectedDocs(selectedDocs.filter((_, i) => i !== index))
    }
  }

  // Xử lý khi người dùng xóa media trong chỉnh sửa
  const handleRemoveEditMedia = (type: "image" | "video" | "doc", index: number) => {
    if (type === "image") {
      setEditImages(editImages.filter((_, i) => i !== index))
    } else if (type === "video") {
      setEditVideos(editVideos.filter((_, i) => i !== index))
    } else if (type === "doc") {
      setEditDocs(editDocs.filter((_, i) => i !== index))
    }
  }

  // Xử lý khi người dùng đăng bài
  const handleCreatePost = async () => {
    if (!content.trim() && selectedImages.length === 0 && selectedVideos.length === 0 && selectedDocs.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung hoặc thêm media",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setUploadError(null)

    try {
      // Tạo đối tượng dữ liệu bài đăng
      const postData: PostData = {
        content,
        images: selectedImages,
        videos: selectedVideos,
        docs: selectedDocs,
        visibility,
      }

      // Gọi API để tạo bài đăng với callback theo dõi tiến trình
      const response = await createPost(postData, (progresses) => {
        setUploadProgress(progresses)
        console.log("Upload progress:", progresses)
      })

      // Thông báo thành công
      toast({
        title: "Thành công",
        description: "Bài viết đã được đăng thành công",
      })

      // Reset form
      setContent("")
      setSelectedImages([])
      setSelectedVideos([])
      setSelectedDocs([])
      setUploadProgress([])

      console.log("Post created:", response)
    } catch (error) {
      console.error("Error creating post:", error)
      setUploadError((error as Error).message || "Đã xảy ra lỗi khi đăng bài")

      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý khi người dùng chỉnh sửa bài viết
  const handleEditPost = async () => {
    if (!editPostId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ID bài viết cần chỉnh sửa",
        variant: "destructive",
      })
      return
    }

    if (!editContent.trim() && editImages.length === 0 && editVideos.length === 0 && editDocs.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung hoặc thêm media",
        variant: "destructive",
      })
      return
    }

    setIsEditing(true)
    setEditUploadError(null)

    try {
      // Tạo đối tượng dữ liệu bài đăng
      const postData: PostData = {
        content: editContent,
        images: editImages as any, // Type assertion vì API hỗ trợ cả File và string
        videos: editVideos as any,
        docs: editDocs as any,
        visibility: editVisibility,
      }

      // Gọi API để cập nhật bài đăng với callback theo dõi tiến trình
      const response = await updatePost(editPostId, postData, (progresses) => {
        setEditUploadProgress(progresses)
        console.log("Edit upload progress:", progresses)
      })

      // Thông báo thành công
      toast({
        title: "Thành công",
        description: "Bài viết đã được cập nhật thành công",
      })

      console.log("Post updated:", response)
    } catch (error) {
      console.error("Error updating post:", error)
      setEditUploadError((error as Error).message || "Đã xảy ra lỗi khi cập nhật bài viết")

      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsEditing(false)
    }
  }

  // Xử lý khi người dùng muốn thử lại việc đăng bài
  const handleRetryCreate = () => {
    setUploadError(null)
    handleCreatePost()
  }

  // Xử lý khi người dùng muốn thử lại việc chỉnh sửa bài viết
  const handleRetryEdit = () => {
    setEditUploadError(null)
    handleEditPost()
  }

  // Tính toán tổng tiến trình upload
  const totalProgress = uploadProgress.length
    ? uploadProgress.reduce((sum, item) => sum + item.progress, 0) / uploadProgress.length
    : 0

  const totalEditProgress = editUploadProgress.length
    ? editUploadProgress.reduce((sum, item) => sum + item.progress, 0) / editUploadProgress.length
    : 0

  // Giải phóng URL objects khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup code if needed
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ví dụ về Upload File theo Chunk</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "edit")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Đăng bài viết mới</TabsTrigger>
            <TabsTrigger value="edit">Chỉnh sửa bài viết</TabsTrigger>
          </TabsList>

          {/* Tab đăng bài viết mới */}
          <TabsContent value="create" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung bài viết</Label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung bài viết..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Hình ảnh</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Chọn ảnh
                  </Button>
                  <input
                    type="file"
                    ref={imageInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
                {selectedImages.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">{file.name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedia("image", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Video</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Chọn video
                  </Button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    className="hidden"
                    accept="video/*"
                    multiple
                    onChange={handleVideoChange}
                  />
                </div>
                {selectedVideos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedVideos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">{file.name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedia("video", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Tài liệu</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => docInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Chọn tài liệu
                  </Button>
                  <input
                    type="file"
                    ref={docInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    multiple
                    onChange={handleDocChange}
                  />
                </div>
                {selectedDocs.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedDocs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">{file.name}</div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedia("doc", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="visibility">Quyền riêng tư</Label>
              <Select value={visibility} onValueChange={(value: any) => setVisibility(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn quyền riêng tư" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Công khai</SelectItem>
                  <SelectItem value="FRIENDS">Chỉ bạn bè</SelectItem>
                  <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hiển thị tiến trình upload */}
            {isSubmitting && uploadProgress.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tổng tiến trình</Label>
                  <Progress value={totalProgress} className="h-2" />
                  <div className="text-xs text-right">{Math.round(totalProgress)}%</div>
                </div>

                <div className="space-y-2">
                  <Label>Chi tiết từng file</Label>
                  {uploadProgress.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate">{item.file.name}</span>
                        <span>{Math.round(item.progress)}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hiển thị lỗi upload */}
            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{uploadError}</span>
                  <Button variant="outline" size="sm" onClick={handleRetryCreate}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Thử lại
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab chỉnh sửa bài viết */}
          <TabsContent value="edit" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="editPostId">ID bài viết</Label>
              <Input
                id="editPostId"
                placeholder="Nhập ID bài viết cần chỉnh sửa..."
                value={editPostId}
                onChange={(e) => setEditPostId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editContent">Nội dung bài viết</Label>
              <Textarea
                id="editContent"
                placeholder="Nhập nội dung bài viết..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Hình ảnh</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editImageInputRef.current?.click()}
                    disabled={isEditing}
                    className="w-full"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Chọn ảnh
                  </Button>
                  <input
                    type="file"
                    ref={editImageInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleEditImageChange}
                  />
                </div>
                {editImages.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {editImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">
                          {typeof file === "string" ? `Ảnh ${index + 1}` : (file as File).name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEditMedia("image", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Video</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editVideoInputRef.current?.click()}
                    disabled={isEditing}
                    className="w-full"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Chọn video
                  </Button>
                  <input
                    type="file"
                    ref={editVideoInputRef}
                    className="hidden"
                    accept="video/*"
                    multiple
                    onChange={handleEditVideoChange}
                  />
                </div>
                {editVideos.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {editVideos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">
                          {typeof file === "string" ? `Video ${index + 1}` : (file as File).name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEditMedia("video", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Tài liệu</Label>
                <div className="flex items-center mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editDocInputRef.current?.click()}
                    disabled={isEditing}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Chọn tài liệu
                  </Button>
                  <input
                    type="file"
                    ref={editDocInputRef}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    multiple
                    onChange={handleEditDocChange}
                  />
                </div>
                {editDocs.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {editDocs.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <div className="truncate text-xs">
                          {typeof file === "object" && "name" in file
                            ? file.name
                            : typeof file === "string"
                              ? `Tài liệu ${index + 1}`
                              : (file as File).name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEditMedia("doc", index)}
                          className="h-6 w-6"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="editVisibility">Quyền riêng tư</Label>
              <Select value={editVisibility} onValueChange={(value: any) => setEditVisibility(value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn quyền riêng tư" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Công khai</SelectItem>
                  <SelectItem value="FRIENDS">Chỉ bạn bè</SelectItem>
                  <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hiển thị tiến trình upload */}
            {isEditing && editUploadProgress.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tổng tiến trình</Label>
                  <Progress value={totalEditProgress} className="h-2" />
                  <div className="text-xs text-right">{Math.round(totalEditProgress)}%</div>
                </div>

                <div className="space-y-2">
                  <Label>Chi tiết từng file</Label>
                  {editUploadProgress.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate">{item.file.name}</span>
                        <span>{Math.round(item.progress)}%</span>
                      </div>
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hiển thị lỗi upload */}
            {editUploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription className="flex justify-between items-center">
                  <span>{editUploadError}</span>
                  <Button variant="outline" size="sm" onClick={handleRetryEdit}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Thử lại
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        {activeTab === "create" ? (
          <Button onClick={handleCreatePost} disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng..." : "Đăng bài"}
          </Button>
        ) : (
          <Button onClick={handleEditPost} disabled={isEditing}>
            {isEditing ? "Đang cập nhật..." : "Cập nhật bài viết"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
