"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, Users, Bookmark, Calendar, Cake, MapPin, Sparkles, Newspaper, Compass, Loader2 } from "lucide-react"
import { PostCard, type PostData } from "@/components/post-card"
import { FriendChatButton } from "@/components/friends/friend-chat-button"
import { PostForm } from "@/components/post/post-form"
import type { CommentData } from "@/components/comments/comment-item"
import { Button } from "@/components/ui/button"

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

const INITIAL_POSTS: PostData[] = [
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
    visibility: "PUBLIC",
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
    visibility: "FRIENDS",
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
    visibility: "PUBLIC",
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
    visibility: "PRIVATE",
  },
]

// Tạo thêm bài viết giả lập cho việc tải thêm
const generateMorePosts = (page: number): PostData[] => {
  return Array(4)
    .fill(0)
    .map((_, index) => ({
      id: 100 + page * 10 + index,
      content: `Đây là bài viết được tải thêm ở trang ${page}, số thứ tự ${index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      createdAt: new Date(Date.now() - 3600000 * (24 + page * 24 + index)),
      author: {
        id: (index % 4) + 1,
        username: ["Anna Nguyễn", "Minh Trần", "Hương Lê", "Tuấn Phạm"][index % 4],
        image: `/placeholder.svg?height=40&width=40&text=${["AN", "MT", "HL", "TP"][index % 4]}`,
        profileUrl: `/profile/${(index % 4) + 1}`,
      },
      commentsCount: Math.floor(Math.random() * 20),
      sharesCount: Math.floor(Math.random() * 10),
      visibility: ["PUBLIC", "FRIENDS", "PRIVATE"][Math.floor(Math.random() * 3)] as "PUBLIC" | "FRIENDS" | "PRIVATE",
      ...(Math.random() > 0.5 && {
        images: [
          `/placeholder.svg?height=400&width=600&text=Image+${page}-${index + 1}`,
          ...(Math.random() > 0.7 ? [`/placeholder.svg?height=400&width=600&text=Image+${page}-${index + 2}`] : []),
        ],
      }),
      ...(Math.random() > 0.7 && {
        location: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế"][Math.floor(Math.random() * 4)],
      }),
    }))
}

// Mock data for online friends
const ONLINE_FRIENDS = [
  { id: 1, username: "Anna Nguyễn", image: "/placeholder.svg?height=40&width=40&text=AN", online: true },
  { id: 2, username: "Minh Trần", image: "/placeholder.svg?height=40&width=40&text=MT", online: true },
  { id: 3, username: "Hương Lê", image: "/placeholder.svg?height=40&width=40&text=HL", online: false },
  { id: 4, username: "Tuấn Phạm", image: "/placeholder.svg?height=40&width=40&text=TP", online: true },
  { id: 5, username: "Linh Đặng", image: "/placeholder.svg?height=40&width=40&text=LD", online: false },
]

// Mock data for trending topics
const TRENDING_TOPICS = [
  { id: 1, name: "Công nghệ", count: "12.5K" },
  { id: 2, name: "Du lịch", count: "8.3K" },
  { id: 3, name: "Ẩm thực", count: "6.7K" },
  { id: 4, name: "Thể thao", count: "5.2K" },
]

// Mock data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: 1,
    name: "Hội thảo Công nghệ AI",
    date: "15/06/2023",
    location: "TP. Hồ Chí Minh",
    attendees: 120,
  },
  {
    id: 2,
    name: "Workshop Nhiếp ảnh",
    date: "22/06/2023",
    location: "Hà Nội",
    attendees: 45,
  },
]

// Mock data for suggested pages
const SUGGESTED_PAGES = [
  { id: 1, name: "Yêu thích Du lịch", followers: "15K", image: "/placeholder.svg?height=40&width=40&text=DL" },
  { id: 2, name: "Ẩm thực Việt Nam", followers: "12K", image: "/placeholder.svg?height=40&width=40&text=AT" },
  { id: 3, name: "Công nghệ 4.0", followers: "8K", image: "/placeholder.svg?height=40&width=40&text=CN" },
]

// Hàm giả lập API để lấy thêm bài viết
const fetchMorePosts = async (page: number, limit = 4): Promise<PostData[]> => {
  // Giả lập thời gian tải
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Trong môi trường thực tế, bạn sẽ gọi API thực sự
    // return await fetchApi<PostData[]>(`/api/posts?page=${page}&limit=${limit}`)

    // Giả lập dữ liệu cho môi trường phát triển
    return generateMorePosts(page)
  } catch (error) {
    console.error("Error fetching more posts:", error)
    return []
  }
}

export default function FeedPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS)
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you")
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  // Cập nhật hàm handleSubmitPost để chỉ sử dụng visibility
  const handleSubmitPost = async (data: {
    content: string
    images: File[]
    videos: File[]
    docs: File[]
    location?: string
    visibility: "PUBLIC" | "FRIENDS" | "PRIVATE"
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
      visibility: data.visibility,
      createdAt: new Date(),
      author: {
        id: user?.id || "user",
        username: user?.username || "User",
        image: user?.profileImage?.url,
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

  // Hàm tải thêm bài viết
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    try {
      const newPosts = await fetchMorePosts(page)

      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [page, isLoadingMore, hasMore])

  // Thiết lập Intersection Observer để phát hiện khi người dùng cuộn đến nút "Load thêm"
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoadingMore && hasMore) {
          loadMorePosts()
        }
      },
      { threshold: 1.0 },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadMorePosts, isLoadingMore, hasMore])

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
          {/* Left Sidebar - Profile & Navigation */}
          <div className="hidden md:block">
            <Card className="card-hover sticky top-20 overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-primary/30 to-primary/10"></div>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col items-center -mt-8 mb-4">
                  <Avatar className="h-16 w-16 border-4 border-background">
                    <AvatarImage src={user.profileImage?.url || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.username ? user.username.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium mt-2">{user.username}</h3>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-muted/50 rounded-md p-2">
                    <div className="font-bold">1.5K</div>
                    <div className="text-xs text-muted-foreground">Bạn bè</div>
                  </div>
                  <div className="bg-muted/50 rounded-md p-2">
                    <div className="font-bold">42</div>
                    <div className="text-xs text-muted-foreground">Bài viết</div>
                  </div>
                  <div className="bg-muted/50 rounded-md p-2">
                    <div className="font-bold">350</div>
                    <div className="text-xs text-muted-foreground">Ảnh</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm">Trang cá nhân</span>
                  </Link>
                  <Link
                    href="/friends"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">Bạn bè</span>
                  </Link>
                  <Link
                    href="/saved"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Bookmark className="h-4 w-4 text-primary" />
                    <span className="text-sm">Đã lưu</span>
                  </Link>
                  <Link
                    href="/events"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">Sự kiện</span>
                  </Link>
                  <Link
                    href="/memories"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Cake className="h-4 w-4 text-primary" />
                    <span className="text-sm">Kỷ niệm</span>
                  </Link>
                  <Link
                    href="/explore"
                    className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Compass className="h-4 w-4 text-primary" />
                    <span className="text-sm">Khám phá</span>
                  </Link>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">© 2023 Verlink</span>
                  <Link href="/terms" className="text-primary hover:underline">
                    Điều khoản
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Feed */}
          <div className="md:col-span-2 space-y-6 animate-slide-up">
            {/* Feed Tabs */}
            <Card className="overflow-hidden">
              <div className="grid grid-cols-2 border-b">
                <Button
                  variant="ghost"
                  className={`rounded-none h-12 ${
                    activeTab === "for-you" ? "border-b-2 border-primary font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("for-you")}
                >
                  <Sparkles className={`h-4 w-4 mr-2 ${activeTab === "for-you" ? "text-primary" : ""}`} />
                  Dành cho bạn
                </Button>
                <Button
                  variant="ghost"
                  className={`rounded-none h-12 ${
                    activeTab === "following" ? "border-b-2 border-primary font-medium" : ""
                  }`}
                  onClick={() => setActiveTab("following")}
                >
                  <Users className={`h-4 w-4 mr-2 ${activeTab === "following" ? "text-primary" : ""}`} />
                  Đang theo dõi
                </Button>
              </div>
            </Card>

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

              {/* Load More Button */}
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore ? (
                  <Button disabled className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải...
                  </Button>
                ) : hasMore ? (
                  <Button variant="outline" onClick={loadMorePosts} className="px-8">
                    Xem thêm bài viết
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Bạn đã xem hết bài viết</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="hidden md:block space-y-6">
            {/* Trending Topics */}
            <Card className="card-hover overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 flex items-center">
                <Newspaper className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Xu hướng</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((topic) => (
                    <div key={topic.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium hover:text-primary cursor-pointer">#{topic.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-hover overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Sự kiện sắp tới</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {UPCOMING_EVENTS.map((event) => (
                    <div key={event.id} className="space-y-1">
                      <div className="font-medium text-sm">{event.name}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{event.attendees} người tham gia</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Pages */}
            <Card className="card-hover overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 flex items-center">
                <Compass className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Trang gợi ý</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {SUGGESTED_PAGES.map((page) => (
                    <div key={page.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={page.image || "/placeholder.svg"} alt={page.name} />
                          <AvatarFallback>{page?.name ? page.name.charAt(0) : "P"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{page.name}</div>
                          <div className="text-xs text-muted-foreground">{page.followers} người theo dõi</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-8">
                        Theo dõi
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Online Friends - Di chuyển xuống dưới cùng */}
            <Card className="card-hover overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Bạn bè đang hoạt động</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {ONLINE_FRIENDS.map((friend) => (
                    <FriendChatButton key={friend.id} friend={friend} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
