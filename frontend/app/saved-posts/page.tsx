"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { PostCard, type PostData } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, Search, Filter } from "lucide-react"

// Mock data cho các bài viết đã lưu
const MOCK_SAVED_POSTS: PostData[] = [
  {
    id: "saved-1",
    content: "Chia sẻ 10 mẹo học tiếng Anh hiệu quả cho người mới bắt đầu. Các bạn hãy xem và áp dụng nhé!",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2),
    author: {
      id: "user-1",
      name: "Nguyễn Văn A",
      image: "/placeholder.svg?height=40&width=40&text=NVA",
      profileUrl: "/profile/user-1",
    },
    commentsCount: 15,
    sharesCount: 5,
  },
  {
    id: "saved-2",
    content: "Vừa hoàn thành khóa học lập trình web. Đây là dự án cuối khóa của mình, mọi người góp ý nhé!",
    images: ["/placeholder.svg?height=300&width=600&text=Web+Project"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 5),
    author: {
      id: "user-2",
      name: "Trần Thị B",
      image: "/placeholder.svg?height=40&width=40&text=TTB",
      profileUrl: "/profile/user-2",
    },
    commentsCount: 8,
    sharesCount: 2,
  },
  {
    id: "saved-3",
    content: "Công thức làm bánh chocolate ngon tuyệt. Mình đã thử và thành công ngay lần đầu tiên!",
    images: [
      "/placeholder.svg?height=300&width=600&text=Chocolate+Cake+1",
      "/placeholder.svg?height=300&width=600&text=Chocolate+Cake+2",
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 10),
    author: {
      id: "user-3",
      name: "Lê Văn C",
      image: "/placeholder.svg?height=40&width=40&text=LVC",
      profileUrl: "/profile/user-3",
    },
    commentsCount: 25,
    sharesCount: 12,
  },
  {
    id: "saved-4",
    content: "Tổng hợp các địa điểm du lịch đẹp nhất miền Bắc. Lưu lại để dành cho chuyến đi sắp tới nhé!",
    images: [
      "/placeholder.svg?height=300&width=600&text=Northern+Vietnam+1",
      "/placeholder.svg?height=300&width=600&text=Northern+Vietnam+2",
      "/placeholder.svg?height=300&width=600&text=Northern+Vietnam+3",
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 15),
    author: {
      id: "user-4",
      name: "Phạm Thị D",
      image: "/placeholder.svg?height=40&width=40&text=PTD",
      profileUrl: "/profile/user-4",
    },
    commentsCount: 32,
    sharesCount: 18,
  },
]

export default function SavedPostsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [savedPosts, setSavedPosts] = useState<PostData[]>(MOCK_SAVED_POSTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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

  // Lọc bài viết theo tab và từ khóa tìm kiếm
  const filteredPosts = savedPosts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "photos") return matchesSearch && post.images && post.images.length > 0
    if (activeTab === "videos") return matchesSearch && post.videos && post.videos.length > 0
    if (activeTab === "links") return matchesSearch && post.content.includes("http")

    return matchesSearch
  })

  const handleCommentClick = (postId: string | number) => {
    console.log(`Comment clicked for post ${postId}`)
  }

  const handleShareClick = (postId: string | number) => {
    console.log(`Share clicked for post ${postId}`)
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Bookmark className="h-6 w-6 mr-2" />
              Bài viết đã lưu
            </h1>
            <p className="text-muted-foreground">Danh sách các bài viết bạn đã lưu để xem sau</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm bài viết đã lưu..."
                className="pl-8 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="photos">Ảnh</TabsTrigger>
            <TabsTrigger value="videos">Video</TabsTrigger>
            <TabsTrigger value="links">Liên kết</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có bài viết nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa lưu bài viết nào hoặc không có bài viết nào phù hợp với tìm kiếm của bạn
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có bài viết nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa lưu bài viết nào có ảnh hoặc không có bài viết nào phù hợp với tìm kiếm của bạn
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có bài viết nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa lưu bài viết nào có video hoặc không có bài viết nào phù hợp với tìm kiếm của bạn
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Không có bài viết nào</h3>
                <p className="text-muted-foreground mb-4">
                  Bạn chưa lưu bài viết nào có liên kết hoặc không có bài viết nào phù hợp với tìm kiếm của bạn
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
