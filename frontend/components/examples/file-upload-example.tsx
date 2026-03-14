"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadProgress } from "@/components/ui/upload-progress"
import { uploadFile, uploadFiles, validateFile, type UploadProgress as UploadProgressType } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"

export function FileUploadExample() {
  const { toast } = useToast()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Validate files
      for (const file of newFiles) {
        const validation = validateFile(file, {
          maxSize: 100 * 1024 * 1024, // 100MB
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

      setSelectedFiles([...selectedFiles, ...newFiles])
    }
  }

  // Xử lý khi người dùng xóa file
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  // Xử lý khi người dùng upload một file
  const handleUploadSingleFile = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Không có file",
        description: "Vui lòng chọn file để tải lên",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadError(null)
    setUploadProgress([{ file: selectedFiles[0], progress: 0, uploaded: false }])

    try {
      // Upload file đầu tiên
      const uploadedFile = await uploadFile(selectedFiles[0], "/api/upload", (progress) => {
        setUploadProgress([{ file: selectedFiles[0], progress, uploaded: progress === 100 }])
      })

      // Thông báo thành công
      toast({
        title: "Tải lên thành công",
        description: `File ${uploadedFile.name} đã được tải lên thành công.`,
      })

      // Lưu URL đã upload
      setUploadedUrls([...uploadedUrls, uploadedFile.url])

      // Xóa file đã upload khỏi danh sách
      setSelectedFiles(selectedFiles.slice(1))
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadError((error as Error).message || "Đã xảy ra lỗi khi tải lên file. Vui lòng thử lại sau.")

      toast({
        title: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải lên file. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Xử lý khi người dùng upload nhiều file
  const handleUploadMultipleFiles = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Không có file",
        description: "Vui lòng chọn file để tải lên",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Upload tất cả các file
      const uploadedFiles = await uploadFiles(selectedFiles, "/api/upload", (progresses) => {
        setUploadProgress(progresses)
      })

      // Thông báo thành công
      toast({
        title: "Tải lên thành công",
        description: `${uploadedFiles.length} file đã được tải lên thành công.`,
      })

      // Lưu URL đã upload
      setUploadedUrls([...uploadedUrls, ...uploadedFiles.map((file) => file.url)])

      // Xóa tất cả file đã upload
      setSelectedFiles([])
    } catch (error) {
      console.error("Error uploading files:", error)
      setUploadError((error as Error).message || "Đã xảy ra lỗi khi tải lên file. Vui lòng thử lại sau.")

      toast({
        title: "Lỗi tải lên",
        description: "Đã xảy ra lỗi khi tải lên file. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Xử lý khi người dùng thử lại upload
  const handleRetry = () => {
    if (selectedFiles.length === 1) {
      handleUploadSingleFile()
    } else {
      handleUploadMultipleFiles()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ví dụ Upload File với Chunking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Chọn file để tải lên</Label>
          <div className="flex items-center gap-2">
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="flex-1"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <UploadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hiển thị danh sách file đã chọn */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>File đã chọn ({selectedFiles.length})</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hiển thị tiến trình upload */}
        {isUploading && uploadProgress.length > 0 && (
          <UploadProgress progresses={uploadProgress} error={uploadError} onRetry={handleRetry} />
        )}

        {/* Hiển thị URL đã upload */}
        {uploadedUrls.length > 0 && (
          <div className="space-y-2">
            <Label>URL đã tải lên ({uploadedUrls.length})</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded-md">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline break-all"
                  >
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSelectedFiles([])
            setUploadProgress([])
            setUploadError(null)
          }}
          disabled={isUploading || selectedFiles.length === 0}
        >
          Xóa tất cả
        </Button>
        <div className="flex gap-2">
          <Button type="button" onClick={handleUploadSingleFile} disabled={isUploading || selectedFiles.length === 0}>
            Upload 1 file
          </Button>
          <Button
            type="button"
            onClick={handleUploadMultipleFiles}
            disabled={isUploading || selectedFiles.length === 0}
          >
            Upload tất cả
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
