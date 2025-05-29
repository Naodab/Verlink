/**
 * API utilities for Verlink
 * Hỗ trợ gửi request JSON và upload file (hình ảnh, video, tài liệu)
 * Có khả năng chia nhỏ file lớn để tải lên server
 */

// Kích thước chunk mặc định: 1MB
const DEFAULT_CHUNK_SIZE = 1024 * 1024

// Cấu hình API
interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
  timeout?: number
}

// Cấu hình mặc định
const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.verlink.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 giây
}

// Cập nhật hàm fetchApi
export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {},
  config: Partial<ApiConfig> = {},
): Promise<T> {
  const mergedConfig = { ...defaultConfig, ...config }
  const { baseUrl, headers, timeout } = mergedConfig

  const controller = new AbortController()
  const { signal } = controller

  // Thiết lập timeout
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    // Kiểm tra baseUrl
    if (!baseUrl) {
      throw new Error("API base URL is not configured")
    }

    // Merge headers
    const mergedHeaders = {
      ...defaultConfig.headers,
      ...headers,
      ...options.headers,
    }

    // Thêm token xác thực nếu có
    const token = localStorage.getItem("verlink-token")
    if (token && !mergedHeaders.Authorization) {
      mergedHeaders.Authorization = `Bearer ${token}`
    }

    // Thêm log để debug
    console.log(`Fetching ${baseUrl}${endpoint}`)

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: mergedHeaders,
      signal,
    })

    // Xóa timeout
    clearTimeout(timeoutId)

    // Kiểm tra response status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message ?? `API request failed with status ${response.status}`)
    }

    // Kiểm tra nếu response là rỗng
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      return await response.json()
    }

    return (await response.text()) as unknown as T
  } catch (error) {
    // Xóa timeout nếu có lỗi
    clearTimeout(timeoutId)

    // Xử lý lỗi timeout
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`)
    }

    // Ném lại lỗi
    throw error
  }
}

/**
 * Interface cho thông tin file đã upload
 */
export interface UploadedFile {
  id: string
  url: string
  name: string
  type: string
  size: number
}

/**
 * Interface cho thông tin tiến trình upload
 */
export interface UploadProgress {
  file: File
  progress: number // 0-100
  uploaded: boolean
  error?: string
}

/**
 * Hàm chia file thành các chunk nhỏ
 */
function createFileChunks(file: File, chunkSize: number = DEFAULT_CHUNK_SIZE): Blob[] {
  const chunks: Blob[] = []
  let start = 0

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    chunks.push(file.slice(start, end))
    start = end
  }

  return chunks
}

/**
 * Hàm upload một file lên server với khả năng chia nhỏ file
 */
export async function uploadFile(
  file: File,
  endpoint: string,
  onProgress?: (progress: number) => void,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): Promise<UploadedFile> {
  // Nếu file nhỏ hơn kích thước chunk, upload trực tiếp
  if (file.size <= chunkSize) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetchApi<UploadedFile>(
      endpoint,
      {
        method: "POST",
        body: formData,
        headers: {
          // Không thiết lập Content-Type để browser tự thiết lập với boundary
        },
      },
      {
        headers: {
          // Xóa header Content-Type mặc định
          "Content-Type": undefined as any,
        },
      },
    )

    return response
  }

  // Nếu file lớn, chia thành các chunk và upload từng chunk
  const chunks = createFileChunks(file, chunkSize)
  const totalChunks = chunks.length
  const fileId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, "")}`

  // Upload từng chunk
  for (let i = 0; i < totalChunks; i++) {
    const chunk = chunks[i]
    const formData = new FormData()
    formData.append("file", chunk, file.name)
    formData.append("fileId", fileId)
    formData.append("chunkIndex", i.toString())
    formData.append("totalChunks", totalChunks.toString())

    await fetchApi(
      `${endpoint}/chunk`,
      {
        method: "POST",
        body: formData,
        headers: {
          // Không thiết lập Content-Type để browser tự thiết lập với boundary
        },
      },
      {
        headers: {
          // Xóa header Content-Type mặc định
          "Content-Type": undefined as any,
        },
      },
    )

    // Cập nhật tiến trình
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100))
    }
  }

  // Hoàn tất upload và lấy thông tin file
  const response = await fetchApi<UploadedFile>(`${endpoint}/complete`, {
    method: "POST",
    body: JSON.stringify({
      fileId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  })

  return response
}

/**
 * Hàm upload nhiều file lên server
 */
export async function uploadFiles(
  files: File[],
  endpoint: string,
  onProgress?: (progresses: UploadProgress[]) => void,
): Promise<UploadedFile[]> {
  const progresses: UploadProgress[] = files.map((file) => ({
    file,
    progress: 0,
    uploaded: false,
  }))

  // Cập nhật tiến trình
  const updateProgress = (index: number, progress: number) => {
    progresses[index].progress = progress
    if (onProgress) {
      onProgress([...progresses])
    }
  }

  // Upload các file song song
  const uploadPromises = files.map((file, index) =>
    uploadFile(file, endpoint, (progress) => updateProgress(index, progress))
      .then((result) => {
        progresses[index].uploaded = true
        progresses[index].progress = 100
        if (onProgress) {
          onProgress([...progresses])
        }
        return result
      })
      .catch((error) => {
        progresses[index].error = error.message
        if (onProgress) {
          onProgress([...progresses])
        }
        throw error
      }),
  )

  return Promise.all(uploadPromises)
}

/**
 * Interface cho dữ liệu bài đăng
 */
export interface PostData {
  content: string
  images?: File[]
  videos?: File[]
  docs?: File[]
  location?: string
  visibility: "PUBLIC" | "FRIENDS" | "PRIVATE"
}

/**
 * Hàm tạo bài đăng mới
 */
export async function createPost(
  postData: PostData,
  onProgress?: (progresses: UploadProgress[]) => void,
): Promise<any> {
  const { content, images = [], videos = [], docs = [], location, visibility } = postData

  // Upload các file media trước
  const allFiles = [...images, ...videos, ...docs]
  let mediaFiles: UploadedFile[] = []

  if (allFiles.length > 0) {
    mediaFiles = await uploadFiles(allFiles, "/api/upload", onProgress)
  }

  // Phân loại các file đã upload
  const uploadedImages = mediaFiles.slice(0, images.length)
  const uploadedVideos = mediaFiles.slice(images.length, images.length + videos.length)
  const uploadedDocs = mediaFiles.slice(images.length + videos.length)

  // Tạo bài đăng với các URL của file đã upload
  const postPayload = {
    content,
    images: uploadedImages.map((file) => file.url), // Chỉ gửi URL của ảnh
    videos: uploadedVideos.map((file) => file.url), // Chỉ gửi URL của video
    docs: uploadedDocs, // Giữ nguyên thông tin đầy đủ của tài liệu
    location,
    visibility,
  }

  return fetchApi("/api/posts", {
    method: "POST",
    body: JSON.stringify(postPayload),
  })
}

/**
 * Hàm cập nhật bài đăng
 */
export async function updatePost(
  postId: string,
  postData: PostData,
  onProgress?: (progresses: UploadProgress[]) => void,
): Promise<any> {
  const { content, images = [], videos = [], docs = [], location, visibility } = postData

  // Upload các file media mới (nếu có)
  const newImageFiles = images.filter((img): img is File => img instanceof File)
  const newVideoFiles = videos.filter((vid): vid is File => vid instanceof File)
  const newDocFiles = docs.filter((doc): doc is File => doc instanceof File)

  const allNewFiles = [...newImageFiles, ...newVideoFiles, ...newDocFiles]
  let newMediaFiles: UploadedFile[] = []

  if (allNewFiles.length > 0) {
    newMediaFiles = await uploadFiles(allNewFiles, "/api/upload", onProgress)
  }

  // Phân loại các file mới đã upload
  const uploadedImages = newMediaFiles.slice(0, newImageFiles.length)
  const uploadedVideos = newMediaFiles.slice(newImageFiles.length, newImageFiles.length + newVideoFiles.length)
  const uploadedDocs = newMediaFiles.slice(newImageFiles.length + newVideoFiles.length)

  // Chuẩn bị dữ liệu ảnh (kết hợp URL cũ và URL mới)
  const processedImages = images
    .map((img) => {
      if (img instanceof File) {
        // Lấy URL từ file đã upload
        const uploadedFile = uploadedImages.shift()
        return uploadedFile ? uploadedFile.url : null
      }
      // Giữ nguyên URL cũ
      return img
    })
    .filter(Boolean) as string[]

  // Chuẩn bị dữ liệu video (kết hợp URL cũ và URL mới)
  const processedVideos = videos
    .map((vid) => {
      if (vid instanceof File) {
        // Lấy URL từ file đã upload
        const uploadedFile = uploadedVideos.shift()
        return uploadedFile ? uploadedFile.url : null
      }
      // Giữ nguyên URL cũ
      return vid
    })
    .filter(Boolean) as string[]

  // Chuẩn bị dữ liệu tài liệu (kết hợp đối tượng cũ và đối tượng mới)
  const processedDocs = docs
    .map((doc) => {
      if (doc instanceof File) {
        // Lấy thông tin từ file đã upload
        return uploadedDocs.shift()
      }
      // Giữ nguyên thông tin cũ
      return doc
    })
    .filter(Boolean) as UploadedFile[]

  // Cập nhật bài đăng với các URL đã xử lý
  const postPayload = {
    content,
    images: processedImages,
    videos: processedVideos,
    docs: processedDocs,
    location,
    visibility,
  }

  return fetchApi(`/api/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(postPayload),
  })
}

/**
 * Interface cho dữ liệu bình luận
 */
export interface CommentData {
  content: string
  postId: string
  parentId?: string
  images?: File[]
}

/**
 * Hàm tạo bình luận mới
 */
export async function createComment(
  commentData: CommentData,
  onProgress?: (progresses: UploadProgress[]) => void,
): Promise<any> {
  const { content, postId, parentId, images = [] } = commentData

  // Upload các file hình ảnh (nếu có)
  let uploadedImages: UploadedFile[] = []

  if (images.length > 0) {
    uploadedImages = await uploadFiles(images, "/api/upload", onProgress)
  }

  // Tạo bình luận với các URL của hình ảnh đã upload
  const commentPayload = {
    content,
    postId,
    parentId,
    images: uploadedImages.map((file) => file.url), // Chỉ gửi URL của ảnh
  }

  return fetchApi("/api/comments", {
    method: "POST",
    body: JSON.stringify(commentPayload),
  })
}

/**
 * Interface cho dữ liệu tin nhắn
 */
export interface MessageData {
  content: string
  recipientId: string
  images?: File[]
  videos?: File[]
  docs?: File[]
}

/**
 * Hàm gửi tin nhắn mới
 */
export async function sendMessage(
  messageData: MessageData,
  onProgress?: (progresses: UploadProgress[]) => void,
): Promise<any> {
  const { content, recipientId, images = [], videos = [], docs = [] } = messageData

  // Upload các file media trước
  const allFiles = [...images, ...videos, ...docs]
  let mediaFiles: UploadedFile[] = []

  if (allFiles.length > 0) {
    mediaFiles = await uploadFiles(allFiles, "/api/upload", onProgress)
  }

  // Phân loại các file đã upload
  const uploadedImages = mediaFiles.slice(0, images.length)
  const uploadedVideos = mediaFiles.slice(images.length, images.length + videos.length)
  const uploadedDocs = mediaFiles.slice(images.length + videos.length)

  // Gửi tin nhắn với các URL của file đã upload
  const messagePayload = {
    content,
    recipientId,
    images: uploadedImages.map((file) => file.url), // Chỉ gửi URL của ảnh
    videos: uploadedVideos.map((file) => file.url), // Chỉ gửi URL của video
    docs: uploadedDocs, // Giữ nguyên thông tin đầy đủ của tài liệu
  }

  return fetchApi("/api/messages", {
    method: "POST",
    body: JSON.stringify(messagePayload),
  })
}

/**
 * Hàm lấy danh sách bài viết với phân trang
 */
export async function fetchPosts(page = 1, limit = 10): Promise<any> {
  return fetchApi(`/api/posts?page=${page}&limit=${limit}`, {
    method: "GET",
  })
}

/**
 * Hàm lấy danh sách tin nhắn với phân trang
 */
export async function fetchMessages(userId: string | number, page = 1, limit = 20): Promise<any> {
  return fetchApi(`/api/messages?userId=${userId}&page=${page}&limit=${limit}`, {
    method: "GET",
  })
}

/**
 * Hàm kiểm tra kích thước file và loại file
 * @returns Đối tượng chứa thông tin về tính hợp lệ của file
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // Kích thước tối đa (bytes)
    allowedTypes?: string[] // Các loại file được phép
  } = {},
): { valid: boolean; error?: string } {
  const { maxSize = 50 * 1024 * 1024, allowedTypes } = options // Mặc định 50MB

  // Kiểm tra kích thước
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File quá lớn. Kích thước tối đa là ${Math.round(maxSize / (1024 * 1024))}MB.`,
    }
  }

  // Kiểm tra loại file (nếu có)
  const fileType = file.type.split("/")[0] // Lấy phần chính của MIME type (image, video, ...)
  const fileExtension = file.name.split(".").pop()?.toLowerCase()

  const isTypeAllowed = allowedTypes?.some((type) => {
    // Kiểm tra MIME type
    if (file.type.startsWith(type)) {
      return true
    }

    // Kiểm tra extension
    if (fileExtension && type.startsWith(".") && type.substring(1) === fileExtension) {
      return true
    }

    return false
  })

  if (allowedTypes && !isTypeAllowed) {
    return {
      valid: false,
      error: `Loại file không được hỗ trợ. Các loại file được phép: ${allowedTypes.join(", ")}`,
    }
  }

  return { valid: true }
}

/**
 * Hàm kiểm tra và tối ưu hóa hình ảnh trước khi upload
 * @returns Promise<File> File đã được tối ưu hóa
 */
export async function optimizeImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  } = {},
): Promise<File> {
  // Nếu không phải là hình ảnh, trả về file gốc
  if (!file.type.startsWith("image/")) {
    return file
  }

  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Tính toán kích thước mới
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Tạo canvas để vẽ hình ảnh đã resize
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Không thể tạo context canvas"))
        return
      }

      // Vẽ hình ảnh lên canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Chuyển đổi canvas thành blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Không thể tạo blob từ canvas"))
            return
          }

          // Tạo file mới từ blob
          const optimizedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          })

          resolve(optimizedFile)
        },
        "image/jpeg",
        quality,
      )
    }

    img.onerror = () => {
      reject(new Error("Không thể tải hình ảnh"))
    }

    // Tạo URL cho hình ảnh
    img.src = URL.createObjectURL(file)
  })
}
