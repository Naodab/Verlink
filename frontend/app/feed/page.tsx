"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, Users, Bookmark, Calendar } from "lucide-react"
import { PostCard, type PostData } from "@/components/post-card"
import { FriendChatButton } from "@/components/friends/friend-chat-button"
import { PostForm } from "@/components/post/post-form"
import type { CommentData } from "@/components/comments/comment-item"

// Mock comments data
const MOCK_COMMENTS: CommentData[] = [
  {
    id: "comment-1",
    content: "Thật tuyệt vời! Chúc mừng bạn nhé.",
    createdAt: new Date(Date.now() - 3600000),
    author: {
      id: 1,
      username: "Anna Nguyễn",
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
      username: "Hương Lê",
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
          username: "Minh Trần",
          image: "/placeholder.svg?height=40&width=40&text=MT",
        },
        likes: 1,
        isLiked: false,
      },
    ],
  },
]

// Mock data for posts
const POSTS: PostData[] = [
  {
    id: 1,
    content:
      "Hôm nay là một ngày tuyệt vời! Vừa hoàn thành dự án lớn và được sếp khen ngợi. Cảm thấy rất hạnh phúc và tự hào về những gì đã làm được. Đôi khi những nỗ lực của chúng ta cần thời gian để được ghi nhận, nhưng cuối cùng thì mọi việc đều xứng đáng. Hãy luôn cố gắng và kiên nhẫn, thành công sẽ đến!",
    createdAt: new Date(Date.now() - 3600000 * 2),
    author: {
      id: 2,
      username: "Minh Trần",
      image: "/placeholder.svg?height=40&width=40&text=MT",
      profileUrl: "/profile/2",
    },
    commentsCount: 15,
    sharesCount: 3,
    comments: MOCK_COMMENTS,
  },
  {
    id: 2,
    content: "Vừa thử một quán cà phê mới mở ở quận 1. Không gian rất đẹp và đồ uống ngon tuyệt!",
    images: ["/placeholder.svg?height=400&width=600&text=Quán+Cà+Phê"],
    location: "Quận 1, TP. Hồ Chí Minh",
    createdAt: new Date(Date.now() - 3600000 * 5),
    author: {
      id: 1,
      username: "Anna Nguyễn",
      image: "/placeholder.svg?height=40&width=40&text=AN",
      profileUrl: "/profile/1",
    },
    commentsCount: 8,
    sharesCount: 2,
  },
  {
    id: 3,
    content: "Cuối tuần này ai có kế hoạch gì không? Mình đang nghĩ đến việc đi leo núi Bà Đen.",
    createdAt: new Date(Date.now() - 3600000 * 10),
    author: {
      id: 4,
      username: "Tuấn Phạm",
      image: "/placeholder.svg?height=40&width=40&text=TP",
      profileUrl: "/profile/4",
    },
    commentsCount: 23,
    sharesCount: 0,
  },
  {
    id: 4,
    content:
      "Vừa đọc xong cuốn sách 'Atomic Habits'. Thực sự là một cuốn sách tuyệt vời về việc xây dựng thói quen tốt và phá bỏ thói quen xấu. Khuyên mọi người nên đọc!",
    images: [
      "/placeholder.svg?height=400&width=600&text=Atomic+Habits",
      "/placeholder.svg?height=400&width=600&text=Reading",
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
    author: {
      id: 3,
      username: "Hương Lê",
      image: "/placeholder.svg?height=40&width=40&text=HL",
      profileUrl: "/profile/3",
    },
    commentsCount: 12,
    sharesCount: 5,
  },
]

// Mock data for online friends
const ONLINE_FRIENDS = [
  { id: 1, name: "Anna Nguyễn", image: "/placeholder.svg?height=40&width=40&text=AN", online: true },
  { id: 2, name: "Minh Trần", image: "/placeholder.svg?height=40&width=40&text=MT", online: true },
  { id: 3, name: "Hương Lê", image: "/placeholder.svg?height=40&width=40&text=HL", online: false },
  { id: 4, name: "Tuấn Phạm", image: "/placeholder.svg?height=40&width=40&text=TP", online: true },
  { id: 5, name: "Linh Đặng", image: "/placeholder.svg?height=40&width=40&text=LD", online: false },
]

export default function FeedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<PostData[]>(POSTS)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleSubmitPost = async (data: {
    content: string
    images: File[]
    videos: File[]
    location?: string
  }) => {
    // Trong ứng dụng thực tế, bạn sẽ tải lên ảnh và video lên server
    // Ở đây chúng ta sẽ giả lập bằng cách tạo URL cho các file
    const imageUrls = data.images.map(
      (_, index) => `/placeholder.svg?height=400&width=600&text=Uploaded+Image+${index + 1}`,
    )

    const videoUrls = data.videos.map(
      (_, index) => `/placeholder.svg?height=400&width=600&text=Uploaded+Video+${index + 1}`,
    )

    // Tạo bài đăng mới
    const newPost: PostData = {
      id: Date.now(),
      content: data.content,
      images: imageUrls.length > 0 ? imageUrls : undefined,
      videos: videoUrls.length > 0 ? videoUrls : undefined,
      location: data.location,
      createdAt: new Date(),
      author: {
        id: user?.id ?? "user",
        username: user?.username ?? "User",
        image: user?.profileImage?.url ?? "/placeholder.svg",
        profileUrl: "/profile",
      },
      commentsCount: 0,
      sharesCount: 0,
    }

    // Thêm bài đăng mới vào đầu danh sách
    setPosts([newPost, ...posts])

    // Giả lập thời gian xử lý
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
      <main className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Left Sidebar - Profile (Smaller) */}
          <div className="hidden md:block">
            <Card className="card-hover sticky top-20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profileImage?.url || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{user.username}</h3>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Link href="/profile" className="flex items-center space-x-2 text-sm hover:text-primary">
                    <User className="h-4 w-4" />
                    <span>Trang cá nhân</span>
                  </Link>
                  <Link href="/friends" className="flex items-center space-x-2 text-sm hover:text-primary">
                    <Users className="h-4 w-4" />
                    <span>Bạn bè</span>
                  </Link>
                  <Link href="/saved" className="flex items-center space-x-2 text-sm hover:text-primary">
                    <Bookmark className="h-4 w-4" />
                    <span>Đã lưu</span>
                  </Link>
                  <Link href="/events" className="flex items-center space-x-2 text-sm hover:text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>Sự kiện</span>
                  </Link>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xs">
                  <span>Bạn bè</span>
                  <span className="font-medium">1.5K</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Feed */}
          <div className="md:col-span-2 space-y-6 animate-slide-up">
            {/* Post Form */}
            <PostForm onSubmit={handleSubmitPost} />

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onCommentClick={handleCommentClick}
                  onShareClick={handleShareClick}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar - Online Friends */}
          <div className="hidden md:block">
            <Card className="card-hover sticky top-20">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3">Bạn bè đang hoạt động</h3>
                <div className="space-y-1">
                  {ONLINE_FRIENDS.map((friend) => (
                    <FriendChatButton key={friend.id} friend={friend} />
                  ))}
                </div>

                <Separator className="my-4" />

                <h4 className="text-xs font-medium mb-3">Nhóm trò chuyện</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=40&width=40&text=NT" />
                        <AvatarFallback className="bg-primary/80 text-primary-foreground">NT</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Nhóm Thân Thiết</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      3
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=40&width=40&text=GĐ" />
                        <AvatarFallback className="bg-primary/80 text-primary-foreground">GĐ</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Gia đình</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      1
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
