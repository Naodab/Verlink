"use client"

import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import type { UploadProgress as UploadProgressType } from "@/lib/api"

interface UploadProgressProps {
  progresses: UploadProgressType[]
  error: string | null
  onRetry: () => void
}

export function UploadProgress({ progresses, error, onRetry }: UploadProgressProps) {
  // Tính toán tổng tiến trình
  const totalProgress = progresses.length
    ? progresses.reduce((sum, item) => sum + item.progress, 0) / progresses.length
    : 0

  // Đếm số lượng file đã upload thành công
  const uploadedCount = progresses.filter((item) => item.uploaded).length
  const totalCount = progresses.length

  return (
    <div className="mt-3 space-y-2">
      <Progress value={totalProgress} className="h-2" />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          Đang tải lên: {Math.round(totalProgress)}% ({uploadedCount}/{totalCount} files)
        </span>
        {uploadedCount > 0 && uploadedCount < totalCount && <span>{uploadedCount} file đã tải lên</span>}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi tải lên</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={onRetry} className="ml-2 bg-background hover:bg-background/80">
              <RefreshCw className="h-3 w-3 mr-1" />
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
