"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit, Users, Pencil } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PostCard, type PostData } from "@/components/post-card"
import { PostForm } from "@/components/post/post-form"
import type { CommentData } from "@/components/comments/comment-item"
import { MediaPreview } from "@/components/post/media-preview"
import { fetchApi } from "@/lib/api"

// Define types for Visibility and Post
type Visibility = "PUBLIC" | "FRIENDS" | "PRIVATE"

interface Post {
  id: string
  content: string
  images?: {
    id: string
    url: string
    name: string
    type: string
    size: number
  }[]
  videos?: {
    id: string
    url: string
    name: string
    type: string
    size: number
  }[]
  docs?: {
    id: string
    url: string
    name: string
    type: string
    size: number
  }[]
  visibility: Visibility
  createdAt: Date
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    email: string
    gender: string
    createdAt: Date
    profileImage: {
      id: string
      url: string
    }
  }
  reactionCounts: {
    like: number
    love: number
    haha: number
    wow: number
    sad: number
    angry: number
  }
  isEdited: boolean
  shareCount: number
}

// Mock comments data
const MOCK_COMMENTS: CommentData[] = [
  {
    id: "comment-1",
    content: "Thật tuyệt vời! Chúc mừng bạn nhé.",
    createdAt: new Date(Date.now() - 3600000),
    author: {
      id: 1,
      name: "Anna Nguyễn",
      image: "/placeholder.svg?height=40&width=40&text=AN",
    },
    likes: 5,
    isLiked: false,
  },
  {
    id: "comment-2",
    content: "Cảm ơn bạn đã chia sẻ!",
    createdAt: new Date(Date.now() - 7200000),
    author: {
      id: 3,
      name: "Hương Lê",
      image: "/placeholder.svg?height=40&width=40&text=HL",
    },
    likes: 2,
    isLiked: true,
    replies: [
      {
        id: "reply-1",
        content: "Không có gì, rất vui khi bạn thích nó!",
        createdAt: new Date(Date.now() - 3600000),
        author: {
          id: 2,
          name: "Minh Trần",
          image: "/placeholder.svg?height=40&width=40&text=MT",
        },
        likes: 1,
        isLiked: false,
      },
    ],
  },
]

// Mock data for profile posts
const PROFILE_POSTS: PostData[] = []

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<PostData[]>(PROFILE_POSTS)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewType, setPreviewType] = useState<"cover" | "profile">("cover")

  const coverInputRef = useRef<HTMLInputElement>(null)
  const profileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      setProfileImage(user.profileImage?.url || null)
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchPosts = async () => {
      const postResponse = await fetchApi<PostData[]>("/posts/my-posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("verlink-token")}`,
        },
      })
      setPosts(postResponse)
    }

    fetchPosts()
  }, [])

  // Xử lý khi người dùng thay đổi ảnh bìa
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setCoverImage(imageUrl)
    }
  }

  // Xử lý khi người dùng thay đổi ảnh đại diện
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  // Xử lý khi người dùng nhấp vào ảnh bìa để xem
  const handleViewCoverImage = () => {
    if (coverImage) {
      setPreviewType("cover")
      setIsPreviewOpen(true)
    }
  }

  // Xử lý khi người dùng nhấp vào ảnh đại diện để xem
  const handleViewProfileImage = () => {
    if (profileImage) {
      setPreviewType("profile")
      setIsPreviewOpen(true)
    }
  }

  // Cập nhật hàm handleSubmitPost để chỉ sử dụng visibility
  const handleSubmitPost = async (data: {
    content: string
    images: File[]
    videos: File[]
    docs: File[]
    location?: string
    visibility: Visibility
  }) => {
    try {
      const formData = new FormData()
      formData.append("content", data.content)
      data.images.forEach((image, i) => formData.append(`images[${i}]`, image))
      data.videos.forEach((video, i) => formData.append(`videos[${i}]`, video))
      data.docs.forEach((doc, i) => formData.append(`docs[${i}]`, doc))
      formData.append("targetId", user?.id ?? "")
      formData.append("visibility", data.visibility)
      if (data.location) formData.append("location", data.location || "")
      const response = await fetchApi<PostData>("/posts", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("verlink-token")}`,
        },
      })
      setPosts((prevPosts) => [response, ...prevPosts])
    } catch (error) {
      console.error("Error submitting post:", error)
    }
  }

  const handleCommentClick = (postId: string | number) => {
    console.log(`Comment clicked for post ${postId}`)
  }

  const handleShareClick = (postId: string | number) => {
    console.log(`Share clicked for post ${postId}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <div className="relative">
        {/* Ảnh bìa */}
        <div
          className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/20 to-black/50 relative cursor-pointer group"
          style={
            coverImage
              ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
              : {}
          }
          onClick={handleViewCoverImage}
        >
          {/* Overlay khi hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {coverImage && (
              <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                <Pencil className="h-4 w-4 mr-2" />
                Xem ảnh bìa
              </Button>
            )}
          </div>

          {/* Nút thay đổi ảnh bìa */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-4 right-4 bg-background/20 backdrop-blur-sm hover:bg-background/30"
            onClick={() => coverInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Thay đổi ảnh bìa</span>
          </Button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverImageChange}
          />
        </div>

        <div className="container relative">
          {/* Ảnh đại diện */}
          <div className="absolute -top-16 left-4 md:left-8 group">
            <div className="relative cursor-pointer" onClick={handleViewProfileImage}>
              <Avatar className="h-32 w-32 border-4 border-background glow-effect">
                <AvatarImage src={profileImage || user.profileImage?.url || "/placeholder.svg"} alt={user?.username || "User"} />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {user?.username ? user.username.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>

              {/* Overlay khi hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                  <Pencil className="h-4 w-4 mr-2" />
                  Xem ảnh
                </Button>
              </div>
            </div>

            {/* Nút thay đổi ảnh đại diện */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
              onClick={() => profileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Thay đổi ảnh đại diện</span>
            </Button>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
          </div>
        </div>
      </div>

      <main className="container py-6 pt-20">
        <Card className="mb-6 card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text">{user?.username || "User"}</h1>
                <p className="text-muted-foreground">{user?.email || "user@example.com"}</p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{posts.length}</span>
                    <span className="text-xs text-muted-foreground">Bài viết</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold">1.5K</span>
                    <span className="text-xs text-muted-foreground">Bạn bè</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold">350</span>
                    <span className="text-xs text-muted-foreground">Ảnh</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="animate-slide-up">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Bài viết
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Ảnh
            </TabsTrigger>
            <TabsTrigger
              value="friends"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Bạn bè
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6 space-y-6">
            {/* Post Form */}
            <PostForm onSubmit={handleSubmitPost} />

            {/* Posts */}
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  author: {
                    ...post.author,
                    name: user?.username || "User",
                    image: profileImage ?? user.profileImage?.url ?? "/placeholder.svg",
                  },
                }}
                onCommentClick={handleCommentClick}
                onShareClick={handleShareClick}
              />
            ))}
          </TabsContent>
          <TabsContent value="photos" className="mt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-md card-hover group">
                  <img
                    src={`/placeholder.svg?height=300&width=300&text=Photo+${i + 1}`}
                    alt={`Photo ${i + 1}`}
                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="friends" className="mt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-2">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64&text=F${i + 1}`} />
                        <AvatarFallback className="bg-primary/80 text-primary-foreground">F{i + 1}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">Friend {i + 1}</div>
                      <div className="text-xs text-muted-foreground">Kết nối {i + 1} tháng trước</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full hover:bg-primary hover:text-primary-foreground"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Xem hồ sơ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Preview cho ảnh bìa và ảnh đại diện */}
      {isPreviewOpen && (
        <MediaPreview
          media={previewType === "cover" ? [coverImage || ""] : [profileImage || ""]}
          mediaType="image"
          initialIndex={0}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          author={{
            name: user?.username || "User",
            image: profileImage || user.profileImage?.url,
          }}
          content={previewType === "cover" ? "Ảnh bìa" : "Ảnh đại diện"}
        />
      )}
    </div>
  )
}
