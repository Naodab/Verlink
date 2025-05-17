/**
 * Đây là ví dụ về cách triển khai chunking upload trên server
 * Lưu ý: Đây chỉ là code mẫu, không thực sự chạy trong ứng dụng
 */

import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, appendFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Thư mục lưu trữ các chunk tạm thời
const TEMP_DIR = join(process.cwd(), "tmp", "uploads")

// Thư mục lưu trữ file hoàn chỉnh
const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

// API endpoint để upload một chunk
export async function POST(request: NextRequest) {
  try {
    // Đảm bảo thư mục tồn tại
    if (!existsSync(TEMP_DIR)) {
      await mkdir(TEMP_DIR, { recursive: true })
    }
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    const formData = await request.formData()

    // Kiểm tra xem đây là upload thông thường hay chunked upload
    const fileId = formData.get("fileId") as string
    const chunkIndex = formData.get("chunkIndex") as string
    const totalChunks = formData.get("totalChunks") as string
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Nếu là chunked upload
    if (fileId && chunkIndex !== undefined && totalChunks) {
      const chunkBuffer = Buffer.from(await file.arrayBuffer())
      const chunkPath = join(TEMP_DIR, `${fileId}-${chunkIndex}`)

      // Lưu chunk vào thư mục tạm
      await writeFile(chunkPath, chunkBuffer)

      return NextResponse.json({
        success: true,
        message: `Chunk ${Number.parseInt(chunkIndex) + 1}/${totalChunks} uploaded successfully`,
      })
    }
    // Nếu là upload thông thường
    else {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`
      const filePath = join(UPLOAD_DIR, fileName)

      await writeFile(filePath, buffer)

      const fileUrl = `/uploads/${fileName}`

      return NextResponse.json({
        success: true,
        id: fileName,
        url: fileUrl,
        name: file.name,
        type: file.type,
        size: file.size,
      })
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

// API endpoint để hoàn tất quá trình upload
export async function POST_COMPLETE(request: NextRequest) {
  try {
    const { fileId, fileName, fileType, fileSize } = await request.json()

    if (!fileId || !fileName) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Đọc tất cả các chunk và ghép lại
    const finalFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.]/g, "")}`
    const finalFilePath = join(UPLOAD_DIR, finalFileName)

    // Tạo file trống
    await writeFile(finalFilePath, Buffer.from([]))

    // Đọc từng chunk và ghi vào file cuối cùng
    let chunkIndex = 0
    while (existsSync(join(TEMP_DIR, `${fileId}-${chunkIndex}`))) {
      const chunkPath = join(TEMP_DIR, `${fileId}-${chunkIndex}`)
      const chunkData = await import("fs").then((fs) => fs.readFileSync(chunkPath))

      // Ghi thêm vào file cuối cùng
      await appendFile(finalFilePath, chunkData)

      // Xóa chunk đã xử lý
      await import("fs").then((fs) => fs.unlinkSync(chunkPath))

      chunkIndex++
    }

    const fileUrl = `/uploads/${finalFileName}`

    return NextResponse.json({
      success: true,
      id: finalFileName,
      url: fileUrl,
      name: fileName,
      type: fileType,
      size: fileSize,
    })
  } catch (error) {
    console.error("Error completing file upload:", error)
    return NextResponse.json({ error: "Failed to complete file upload" }, { status: 500 })
  }
}
