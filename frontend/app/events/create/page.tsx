"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Calendar, Clock, MapPin, Globe, Lock, Users } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CreateEventPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [eventName, setEventName] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [eventEndTime, setEventEndTime] = useState("")
  const [eventPrivacy, setEventPrivacy] = useState("public")
  const [eventCoverImage, setEventCoverImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    router.push("/login")
    return null
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setEventCoverImage(imageUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventName || !eventDate || !eventTime) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin sự kiện",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để tạo sự kiện
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Giả lập API call

      toast({
        title: "Tạo sự kiện thành công",
        description: `Sự kiện "${eventName}" đã được tạo thành công`,
      })

      // Chuyển hướng đến trang sự kiện
      router.push("/events")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo sự kiện. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Tạo sự kiện mới</h1>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin sự kiện</CardTitle>
              <CardDescription>Tạo một sự kiện để mời bạn bè và chia sẻ với cộng đồng.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Tên sự kiện</Label>
                  <Input
                    id="event-name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Nhập tên sự kiện"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-description">Mô tả</Label>
                  <Textarea
                    id="event-description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Mô tả về sự kiện của bạn"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event-location">Địa điểm</Label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="event-location"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Nhập địa điểm sự kiện"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Ngày bắt đầu</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Giờ bắt đầu</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="event-time"
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-end-date">Ngày kết thúc</Label>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="event-end-date"
                        type="date"
                        value={eventEndDate}
                        onChange={(e) => setEventEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-end-time">Giờ kết thúc</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="event-end-time"
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quyền riêng tư</Label>
                  <RadioGroup value={eventPrivacy} onValueChange={setEventPrivacy} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="public" id="privacy-public" />
                      <Label htmlFor="privacy-public" className="flex items-center cursor-pointer">
                        <Globe className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Công khai</p>
                          <p className="text-sm text-muted-foreground">Ai cũng có thể thấy sự kiện này</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="friends" id="privacy-friends" />
                      <Label htmlFor="privacy-friends" className="flex items-center cursor-pointer">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Chỉ bạn bè</p>
                          <p className="text-sm text-muted-foreground">
                            Chỉ bạn bè của bạn mới có thể thấy sự kiện này
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="private" id="privacy-private" />
                      <Label htmlFor="privacy-private" className="flex items-center cursor-pointer">
                        <Lock className="h-4 w-4 mr-2 text-primary" />
                        <div>
                          <p className="font-medium">Riêng tư</p>
                          <p className="text-sm text-muted-foreground">
                            Chỉ những người được mời mới có thể thấy sự kiện này
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Ảnh bìa sự kiện</Label>
                  <div
                    className="h-40 w-full bg-muted rounded-md flex items-center justify-center relative cursor-pointer group overflow-hidden"
                    style={
                      eventCoverImage
                        ? {
                            backgroundImage: `url(${eventCoverImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : {}
                    }
                    onClick={() => document.getElementById("event-cover-upload")?.click()}
                  >
                    {!eventCoverImage && (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Tải lên ảnh bìa sự kiện</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="bg-black/50 text-white hover:bg-black/70">
                        <Camera className="h-4 w-4 mr-2" />
                        Thay đổi ảnh bìa
                      </Button>
                    </div>
                    <input
                      id="event-cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverImageChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
                      Đang tạo sự kiện...
                    </>
                  ) : (
                    "Tạo sự kiện"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
