"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Camera, CheckCircle2, Lock, Bell, Eye, Globe, UserCog, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [commentNotifications, setCommentNotifications] = useState(true)
  const [tagNotifications, setTagNotifications] = useState(true)
  const [groupNotifications, setGroupNotifications] = useState(true)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [friendRequestsFrom, setFriendRequestsFrom] = useState("everyone")
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [showLastSeen, setShowLastSeen] = useState(true)
  const [showReadReceipts, setShowReadReceipts] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      setName(user.name)
      setEmail(user.email)
      setBio("Xin chào! Tôi đang sử dụng Verlink.") // Mock data
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name || !email) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would make an API call to update the profile
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      setSuccess("Cập nhật thông tin thành công")
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp")
      return
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would make an API call to update the password
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      setSuccess("Cập nhật mật khẩu thành công")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md"
                    >
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Thay đổi ảnh đại diện</span>
                    </Button>
                  </div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-value="profile"]')?.click()}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Thông tin cá nhân
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-value="security"]')?.click()}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Bảo mật
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-value="notifications"]')?.click()}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Thông báo
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => document.querySelector('[data-value="privacy"]')?.click()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Quyền riêng tư
                  </Button>
                </nav>

                <Separator className="my-4" />

                <Button variant="destructive" className="w-full" onClick={logout}>
                  Đăng xuất
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                <TabsTrigger value="notifications">Thông báo</TabsTrigger>
                <TabsTrigger value="privacy">Quyền riêng tư</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn. Thông tin này sẽ được hiển thị công khai.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Lỗi</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Thành công</AlertTitle>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Giới thiệu</Label>
                        <Input
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Giới thiệu ngắn gọn về bản thân (tối đa 160 ký tự)
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                            Đang lưu...
                          </>
                        ) : (
                          "Lưu thay đổi"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật</CardTitle>
                    <CardDescription>Thay đổi mật khẩu và cài đặt bảo mật tài khoản của bạn.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordUpdate}>
                    <CardContent className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Lỗi</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>Thành công</AlertTitle>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                            Đang lưu...
                          </>
                        ) : (
                          "Cập nhật mật khẩu"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                    <CardDescription>Quản lý cài đặt thông báo của bạn.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Kênh thông báo</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="font-normal">
                            Thông báo qua email
                          </Label>
                          <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="push-notifications" className="font-normal">
                            Thông báo đẩy
                          </Label>
                          <p className="text-sm text-muted-foreground">Nhận thông báo đẩy trên thiết bị</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={pushNotifications}
                          onCheckedChange={setPushNotifications}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Loại thông báo</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="message-notifications" className="font-normal">
                            Tin nhắn
                          </Label>
                          <p className="text-sm text-muted-foreground">Thông báo khi có tin nhắn mới</p>
                        </div>
                        <Switch
                          id="message-notifications"
                          checked={messageNotifications}
                          onCheckedChange={setMessageNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="comment-notifications" className="font-normal">
                            Bình luận
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Thông báo khi có người bình luận về bài viết của bạn
                          </p>
                        </div>
                        <Switch
                          id="comment-notifications"
                          checked={commentNotifications}
                          onCheckedChange={setCommentNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="tag-notifications" className="font-normal">
                            Gắn thẻ
                          </Label>
                          <p className="text-sm text-muted-foreground">Thông báo khi có người gắn thẻ bạn</p>
                        </div>
                        <Switch
                          id="tag-notifications"
                          checked={tagNotifications}
                          onCheckedChange={setTagNotifications}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="group-notifications" className="font-normal">
                            Nhóm
                          </Label>
                          <p className="text-sm text-muted-foreground">Thông báo về hoạt động trong nhóm của bạn</p>
                        </div>
                        <Switch
                          id="group-notifications"
                          checked={groupNotifications}
                          onCheckedChange={setGroupNotifications}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Quyền riêng tư</CardTitle>
                    <CardDescription>Quản lý cài đặt quyền riêng tư của bạn.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Hiển thị hồ sơ</h3>
                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Ai có thể xem hồ sơ của bạn?</Label>
                        <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                          <SelectTrigger id="profile-visibility">
                            <SelectValue placeholder="Chọn quyền riêng tư" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2" />
                                <span>Công khai</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="friends">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Chỉ bạn bè</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center">
                                <Lock className="h-4 w-4 mr-2" />
                                <span>Chỉ mình tôi</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="friend-requests">Ai có thể gửi lời mời kết bạn cho bạn?</Label>
                        <Select value={friendRequestsFrom} onValueChange={setFriendRequestsFrom}>
                          <SelectTrigger id="friend-requests">
                            <SelectValue placeholder="Chọn quyền riêng tư" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Tất cả mọi người</SelectItem>
                            <SelectItem value="friends-of-friends">Bạn của bạn bè</SelectItem>
                            <SelectItem value="nobody">Không ai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Trạng thái hoạt động</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="online-status" className="font-normal">
                            Hiển thị trạng thái hoạt động
                          </Label>
                          <p className="text-sm text-muted-foreground">Cho phép người khác biết khi bạn đang online</p>
                        </div>
                        <Switch id="online-status" checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="last-seen" className="font-normal">
                            Hiển thị thời gian hoạt động gần đây
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Cho phép người khác biết thời gian bạn hoạt động gần đây
                          </p>
                        </div>
                        <Switch id="last-seen" checked={showLastSeen} onCheckedChange={setShowLastSeen} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="read-receipts" className="font-normal">
                            Xác nhận đã đọc
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Cho phép người khác biết khi bạn đã đọc tin nhắn của họ
                          </p>
                        </div>
                        <Switch id="read-receipts" checked={showReadReceipts} onCheckedChange={setShowReadReceipts} />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Lưu thay đổi</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
