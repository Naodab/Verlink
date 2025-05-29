"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, UserPlus, UserCheck, MapPin, Calendar, Cake, Mail, Link2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PostCard, type PostData } from "@/components/post-card"
import type { CommentData } from "@/components/comments/comment-item"
import { MediaPreview } from "@/components/post/media-preview"

// Mock user data
const MOCK_USERS = [
  {
    id: "1",
    name: "Anna Nguyễn",
    email: "anna@example.com",
    profileImage: "/placeholder.svg?height=40&width=40&text=AN",
    coverImage: "/placeholder.svg?height=300&width=1200&text=Cover+Image",
    bio: "Nhiếp ảnh gia, yêu thích du lịch và khám phá ẩm thực",
    location: "TP. Hồ Chí Minh",
    birthday: "15/05/1992",
    joinDate: "Tháng 3, 2020",
    website: "annanguyen.com",
    followers: 1250,
    following: 450,
    isFollowing: false,
  },
  {
    id: "2",
    name: "Minh Trần",
    email: "minh@example.com",
    profileImage: "/placeholder.svg?height=40&width=40&text=MT",
    coverImage: "/placeholder.svg?height=300&width=1200&text=Cover+Image",
    bio: "Kỹ sư phần mềm, đam mê công nghệ và âm nhạc",
    location: "Hà Nội",
    birthday: "22/08/1990",
    joinDate: "Tháng 6, 2019",
    website: "minhtran.dev",
    followers: 980,
    following: 320,
    isFollowing: true,
  },
  {
    id: "3",
    name: "Hương Lê",
    email: "huong@example.com",
    profileImage: "/placeholder.svg?height=40&width=40&text=HL",
    coverImage: "/placeholder.svg?height=300&width=1200&text=Cover+Image",
    bio: "Giáo viên tiếng Anh, yêu thích đọc sách và nấu ăn",
    location: "Đà Nẵng",
    birthday: "10/12/1995",
    joinDate: "Tháng 9, 2021",
    website: "huongle.edu",
    followers: 750,
    following: 280,
    isFollowing: false,
  },
  {
    id: "4",
    name: "Tuấn Phạm",
    email: "tuan@example.com",
    profileImage: "/placeholder.svg?height=40&width=40&text=TP",
    coverImage: "/placeholder.svg?height=300&width=1200&text=Cover+Image",
    bio: "Nhà thiết kế đồ họa, chuyên gia UI/UX",
    location: "TP. Hồ Chí Minh",
    birthday: "05/03/1988",
    joinDate: "Tháng 1, 2018",
    website: "tuanpham.design",
    followers: 2100,
    following: 520,
    isFollowing: true,
  },
]

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

// Generate mock posts for each user
const generateMockPosts = (userId: string, userName: string, userImage: string): PostData[] => {
  return [
    {
      id: `${userId}-post-1`,
      content: "Vừa hoàn thành một dự án mới! Cảm thấy rất hào hứng với kết quả đạt được.",
      createdAt: new Date(Date.now() - 3600000 * 24),
      author: {
        id: userId,
        name: userName,
        image: userImage,
        profileUrl: `/profile/${userId}`,
      },
      commentsCount: 5,
      sharesCount: 1,
      comments: MOCK_COMMENTS,
    },
    {
      id: `${userId}-post-2`,
      content: "Cuối tuần vừa rồi đi du lịch, thời tiết đẹp và phong cảnh tuyệt vời!",
      images: [
        `/placeholder.svg?height=300&width=600&text=Travel+Photo+1+by+${userName}`,
        `/placeholder.svg?height=300&width=600&text=Travel+Photo+2+by+${userName}`,
      ],
      location: "Đà Lạt, Lâm Đồng",
      createdAt: new Date(Date.now() - 3600000 * 72),
      author: {
        id: userId,
        name: userName,
        image: userImage,
        profileUrl: `/profile/${userId}`,
      },
      commentsCount: 12,
      sharesCount: 3,
    },
    {
      id: `${userId}-post-3`,
      content: "Hôm nay là một ngày tuyệt vời! #SocialMedia",
      createdAt: new Date(Date.now() - 3600000 * 120),
      author: {
        id: userId,
        name: userName,
        image: userImage,
        profileUrl: `/profile/${userId}`,
      },
      commentsCount: 3,
      sharesCount: 0,
    },
  ]
}

export default function UserProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const [profileUser, setProfileUser] = useState<any>(null)
  const [posts, setPosts] = useState<PostData[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewType, setPreviewType] = useState<"cover" | "profile">("cover")
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    // Find the user from mock data
    const foundUser = MOCK_USERS.find((u) => u.id === userId)
    if (foundUser) {
      setProfileUser(foundUser)
      setIsFollowing(foundUser.isFollowing)
      setPosts(generateMockPosts(foundUser.id, foundUser.name, foundUser.profileImage))

      // Check if this is the current user's profile
      setIsCurrentUser(user?.id === foundUser.id)
    } else {
      // Handle user not found
      router.push("/404")
    }
  }, [userId, user, isLoading, router])

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
  }

  // Handle view profile/cover image
  const handleViewImage = (type: "profile" | "cover") => {
    setPreviewType(type)
    setIsPreviewOpen(true)
  }

  const handleCommentClick = (postId: string | number) => {
    console.log(`Comment clicked for post ${postId}`)
  }

  const handleShareClick = (postId: string | number) => {
    console.log(`Share clicked for post ${postId}`)
  }

  if (isLoading || !profileUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <div className="relative">
        {/* Cover Image */}
        <div
          className="h-48 md:h-64 w-full bg-gradient-to-r from-primary/20 to-black/50 relative cursor-pointer group"
          style={{
            backgroundImage: `url(${profileUser.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => handleViewImage("cover")}
        >
          {/* Overlay when hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              Xem ảnh bìa
            </Button>
          </div>
        </div>

        <div className="container relative">
          {/* Profile Image */}
          <div className="absolute -top-16 left-4 md:left-8 group">
            <div className="relative cursor-pointer" onClick={() => handleViewImage("profile")}>
              <Avatar className="h-32 w-32 border-4 border-background glow-effect">
                <AvatarImage src={profileUser.profileImage || "/placeholder.svg"} alt={profileUser.name} />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {profileUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Overlay when hover */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                  Xem ảnh
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6 pt-20">
        <Card className="mb-6 card-hover glass-effect">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold gradient-text">{profileUser.name}</h1>
                <p className="text-muted-foreground">{profileUser.bio}</p>
                <div className="flex items-center mt-4 space-x-6">
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{posts.length}</span>
                    <span className="text-xs text-muted-foreground">Bài viết</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{profileUser.followers}</span>
                    <span className="text-xs text-muted-foreground">Người theo dõi</span>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex flex-col items-center">
                    <span className="font-bold">{profileUser.following}</span>
                    <span className="text-xs text-muted-foreground">Đang theo dõi</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                {isCurrentUser ? (
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Chỉnh sửa hồ sơ</Button>
                ) : (
                  <>
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                      onClick={handleFollowToggle}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Đang theo dõi
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Theo dõi
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Nhắn tin
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {profileUser.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>Sống tại {profileUser.location}</span>
                </div>
              )}
              {profileUser.birthday && (
                <div className="flex items-center text-sm">
                  <Cake className="h-4 w-4 mr-2 text-primary" />
                  <span>Sinh nhật: {profileUser.birthday}</span>
                </div>
              )}
              {profileUser.joinDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span>Tham gia từ {profileUser.joinDate}</span>
                </div>
              )}
              {profileUser.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>{profileUser.email}</span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center text-sm">
                  <Link2 className="h-4 w-4 mr-2 text-primary" />
                  <a
                    href={`https://${profileUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profileUser.website}
                  </a>
                </div>
              )}
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
            {/* Posts */}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onCommentClick={handleCommentClick} onShareClick={handleShareClick} />
            ))}
          </TabsContent>
          <TabsContent value="photos" className="mt-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-md card-hover group">
                  <img
                    src={`/placeholder.svg?height=300&width=300&text=Photo+${i + 1}+by+${profileUser.name}`}
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

      {/* Preview for cover and profile images */}
      {isPreviewOpen && (
        <MediaPreview
          media={previewType === "cover" ? [profileUser.coverImage] : [profileUser.profileImage]}
          mediaType="image"
          initialIndex={0}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          author={{
            name: profileUser.name,
            image: profileUser.profileImage,
          }}
          content={previewType === "cover" ? "Ảnh bìa" : "Ảnh đại diện"}
        />
      )}
    </div>
  )
}
