"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play, Volume2, VolumeX, Maximize, MoreVertical, MessageSquare, Share } from "lucide-react"
import { PostReactions } from "@/components/post-reactions"
import { CommentsSection } from "@/components/comments/comments-section"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Mock video data
const VIDEOS = [
  {
    id: 1,
    title: "Hướng dẫn nấu món phở Việt Nam",
    author: "Đầu Bếp Việt",
    authorId: 101,
    authorImage: "/placeholder.svg?height=40&width=40&text=ĐBV",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Phở+Việt+Nam",
    videoUrl: "/placeholder.svg?height=400&width=600&text=Phở+Việt+Nam",
    views: "125K",
    posted: "2 ngày trước",
    duration: "12:45",
    description:
      "Hướng dẫn chi tiết cách nấu món phở Việt Nam truyền thống. Từ cách ninh xương, pha nước dùng đến cách chọn thịt và gia vị đi kèm.",
    likes: 1250,
    comments: [
      {
        id: "v1c1",
        content: "Món phở này trông ngon quá! Tôi sẽ thử làm theo công thức của bạn.",
        createdAt: new Date(Date.now() - 3600000),
        author: {
          id: 1,
          name: "Anna Nguyễn",
          image: "/placeholder.svg?height=40&width=40&text=AN",
        },
        likes: 15,
        isLiked: false,
      },
      {
        id: "v1c2",
        content: "Cảm ơn bạn đã chia sẻ công thức chi tiết như vậy!",
        createdAt: new Date(Date.now() - 7200000),
        author: {
          id: 3,
          name: "Hương Lê",
          image: "/placeholder.svg?height=40&width=40&text=HL",
        },
        likes: 8,
        isLiked: true,
      },
    ],
  },
  {
    id: 2,
    title: "Review iPhone 15 Pro Max sau 1 tháng sử dụng",
    author: "Tech Review",
    authorId: 102,
    authorImage: "/placeholder.svg?height=40&width=40&text=TR",
    thumbnail: "/placeholder.svg?height=400&width=600&text=iPhone+15+Pro+Max",
    videoUrl: "/placeholder.svg?height=400&width=600&text=iPhone+15+Pro+Max",
    views: "89K",
    posted: "5 ngày trước",
    duration: "18:22",
    description:
      "Đánh giá chi tiết iPhone 15 Pro Max sau 1 tháng sử dụng. Ưu điểm, nhược điểm và những trải nghiệm thực tế với chiếc flagship mới nhất của Apple.",
    likes: 890,
    comments: [
      {
        id: "v2c1",
        content: "Bài review rất chi tiết và khách quan. Cảm ơn bạn!",
        createdAt: new Date(Date.now() - 2600000),
        author: {
          id: 4,
          name: "Tuấn Phạm",
          image: "/placeholder.svg?height=40&width=40&text=TP",
        },
        likes: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: 3,
    title: "Khám phá Đà Lạt - Thành phố ngàn hoa",
    author: "Du Lịch Việt",
    authorId: 103,
    authorImage: "/placeholder.svg?height=40&width=40&text=DLV",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Đà+Lạt",
    videoUrl: "/placeholder.svg?height=400&width=600&text=Đà+Lạt",
    views: "56K",
    posted: "1 tuần trước",
    duration: "22:10",
    description:
      "Cùng khám phá Đà Lạt - thành phố ngàn hoa với những địa điểm du lịch nổi tiếng, ẩm thực đặc sắc và khí hậu mát mẻ quanh năm.",
    likes: 560,
    comments: [],
  },
  {
    id: 4,
    title: "Bài tập Yoga giảm stress tại nhà",
    author: "Healthy Life",
    authorId: 104,
    authorImage: "/placeholder.svg?height=40&width=40&text=HL",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Yoga",
    videoUrl: "/placeholder.svg?height=400&width=600&text=Yoga",
    views: "42K",
    posted: "3 ngày trước",
    duration: "15:30",
    description:
      "Hướng dẫn các bài tập Yoga đơn giản giúp giảm stress, tăng cường sức khỏe và cải thiện tinh thần mà bạn có thể thực hiện tại nhà.",
    likes: 420,
    comments: [
      {
        id: "v4c1",
        content: "Tôi đã thử các bài tập này và cảm thấy rất hiệu quả. Cảm ơn bạn!",
        createdAt: new Date(Date.now() - 1600000),
        author: {
          id: 2,
          name: "Minh Trần",
          image: "/placeholder.svg?height=40&width=40&text=MT",
        },
        likes: 9,
        isLiked: true,
      },
    ],
  },
  {
    id: 5,
    title: "Hướng dẫn làm bánh trung thu nhân thập cẩm",
    author: "Bếp Nhà Mình",
    authorId: 105,
    authorImage: "/placeholder.svg?height=40&width=40&text=BNM",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Bánh+Trung+Thu",
    videoUrl: "/placeholder.svg?height=400&width=600&text=Bánh+Trung+Thu",
    views: "78K",
    posted: "2 tuần trước",
    duration: "25:15",
    description:
      "Hướng dẫn chi tiết cách làm bánh trung thu nhân thập cẩm truyền thống. Từ cách làm vỏ bánh, nhân bánh đến cách nướng bánh đúng kỹ thuật.",
    likes: 780,
    comments: [],
  },
  {
    id: 6,
    title: "Mẹo tiết kiệm pin cho điện thoại Android",
    author: "Tech Tips",
    authorId: 106,
    authorImage: "/placeholder.svg?height=40&width=40&text=TT",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Android+Tips",
    videoUrl: "/placeholder.svg?height=400&width=600&text=Android+Tips",
    views: "35K",
    posted: "4 ngày trước",
    duration: "08:45",
    description:
      "Chia sẻ những mẹo hữu ích giúp tiết kiệm pin cho điện thoại Android, giúp kéo dài thời lượng sử dụng và tối ưu hiệu suất thiết bị.",
    likes: 350,
    comments: [],
  },
]

export default function VideosPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)
  const [muted, setMuted] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showComments, setShowComments] = useState(false)
  const [activeTab, setActiveTab] = useState<"trending" | "following" | "recommended">("trending")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video)
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
    setShowComments(false)
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
        {/* Video Categories */}
        <div className="mb-6">
          <Tabs defaultValue="trending" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Video</h1>
              <div className="relative w-64">
                <Input type="search" placeholder="Tìm kiếm video..." className="pl-8" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <TabsList className="mb-6 bg-muted/50">
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Thịnh hành
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Đang theo dõi
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Đề xuất cho bạn
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden card-hover"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1 py-0.5 text-xs rounded">
                  {video.duration}
                </div>

                {hoveredVideo === video.id && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/30 backdrop-blur-sm">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </Button>

                    <div className="absolute bottom-2 left-2 flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation()
                          setMuted(!muted)
                        }}
                      >
                        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <Link href={`/profile/${video.authorId}`}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={video.authorImage || "/placeholder.svg"} alt={video.author} />
                      <AvatarFallback>{video.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Link href={`/profile/${video.authorId}`} className="hover:text-primary">
                        <span>{video.author}</span>
                      </Link>
                      <span className="mx-1">•</span>
                      <span>{video.views} lượt xem</span>
                      <span className="mx-1">•</span>
                      <span>{video.posted}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="px-4 py-3 border-t">
                <PostReactions postId={`video-${video.id}`} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Video Detail Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && handleCloseVideo()}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row h-[80vh]">
            {/* Video Player */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center">
              <div className="relative w-full h-full">
                <video
                  src={selectedVideo?.videoUrl}
                  poster={selectedVideo?.thumbnail}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Video Info and Comments */}
            <div className="w-full md:w-1/3 flex flex-col h-full border-l">
              {/* Video Info */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">{selectedVideo?.title}</h2>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Link href={`/profile/${selectedVideo?.authorId}`}>
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={selectedVideo?.authorImage || "/placeholder.svg"}
                          alt={selectedVideo?.author}
                        />
                        <AvatarFallback>{selectedVideo?.author?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link
                        href={`/profile/${selectedVideo?.authorId}`}
                        className="text-sm font-medium hover:text-primary"
                      >
                        {selectedVideo?.author}
                      </Link>
                      <div className="text-xs text-muted-foreground">{selectedVideo?.views} lượt xem</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Theo dõi
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 border-b">
                <p className="text-sm">{selectedVideo?.description}</p>
              </div>

              {/* Actions */}
              <div className="p-4 border-b">
                <div className="flex justify-between">
                  <PostReactions postId={`video-detail-${selectedVideo?.id}`} />
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-muted"
                    onClick={() => setShowComments(!showComments)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Bình luận</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-muted">
                    <Share className="h-4 w-4 mr-1" />
                    <span>Chia sẻ</span>
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-4">
                {showComments ? (
                  selectedVideo?.comments?.length > 0 ? (
                    <CommentsSection
                      postId={`video-${selectedVideo?.id}`}
                      initialComments={selectedVideo?.comments || []}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Chưa có bình luận nào</p>
                      <p className="text-sm text-muted-foreground">Hãy là người đầu tiên bình luận!</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nhấn vào nút bình luận để xem và thêm bình luận</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
