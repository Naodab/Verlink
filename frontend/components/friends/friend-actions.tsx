"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserMinus, UserPlus, UserCheck, ChevronDown, UserX, Bell, BellOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export type FriendStatus = "NOT_FRIEND" | "FRIEND" | "PENDING_SENT" | "PENDING_RECEIVED"
export type FollowStatus = "FOLLOWING" | "NOT_FOLLOWING"

interface FriendActionsProps {
  userId: string
  userName: string
  initialFriendStatus: FriendStatus
  initialFollowStatus: FollowStatus
  onStatusChange?: (newFriendStatus: FriendStatus, newFollowStatus: FollowStatus) => void
}

export function FriendActions({
  userId,
  userName,
  initialFriendStatus,
  initialFollowStatus,
  onStatusChange,
}: FriendActionsProps) {
  const [friendStatus, setFriendStatus] = useState<FriendStatus>(initialFriendStatus)
  const [followStatus, setFollowStatus] = useState<FollowStatus>(initialFollowStatus)
  const [isUnfriendDialogOpen, setIsUnfriendDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddFriend = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để gửi lời mời kết bạn
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      setFriendStatus("PENDING_SENT")
      if (onStatusChange) onStatusChange("PENDING_SENT", followStatus)
      toast({
        title: "Đã gửi lời mời kết bạn",
        description: `Lời mời kết bạn đã được gửi đến ${userName}`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi lời mời kết bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để hủy lời mời kết bạn
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      setFriendStatus("NOT_FRIEND")
      if (onStatusChange) onStatusChange("NOT_FRIEND", followStatus)
      toast({
        title: "Đã hủy lời mời kết bạn",
        description: `Lời mời kết bạn với ${userName} đã được hủy`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy lời mời kết bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để chấp nhận lời mời kết bạn
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      setFriendStatus("FRIEND")
      if (onStatusChange) onStatusChange("FRIEND", followStatus)
      toast({
        title: "Đã chấp nhận lời mời kết bạn",
        description: `Bạn và ${userName} đã trở thành bạn bè`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể chấp nhận lời mời kết bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để từ chối lời mời kết bạn
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      setFriendStatus("NOT_FRIEND")
      if (onStatusChange) onStatusChange("NOT_FRIEND", followStatus)
      toast({
        title: "Đã từ chối lời mời kết bạn",
        description: `Lời mời kết bạn từ ${userName} đã bị từ chối`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể từ chối lời mời kết bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfriend = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để hủy kết bạn
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      setFriendStatus("NOT_FRIEND")
      setIsUnfriendDialogOpen(false)
      if (onStatusChange) onStatusChange("NOT_FRIEND", followStatus)
      toast({
        title: "Đã hủy kết bạn",
        description: `Bạn và ${userName} không còn là bạn bè`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể hủy kết bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFollow = async () => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, bạn sẽ gọi API để theo dõi/hủy theo dõi
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Giả lập API call
      const newFollowStatus = followStatus === "FOLLOWING" ? "NOT_FOLLOWING" : "FOLLOWING"
      setFollowStatus(newFollowStatus)
      if (onStatusChange) onStatusChange(friendStatus, newFollowStatus)
      toast({
        title: newFollowStatus === "FOLLOWING" ? "Đã theo dõi" : "Đã hủy theo dõi",
        description:
          newFollowStatus === "FOLLOWING" ? `Bạn đã bắt đầu theo dõi ${userName}` : `Bạn đã ngừng theo dõi ${userName}`,
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thay đổi trạng thái theo dõi. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Render button dựa trên trạng thái bạn bè
  const renderFriendButton = () => {
    switch (friendStatus) {
      case "NOT_FRIEND":
        return (
          <Button
            onClick={handleAddFriend}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Kết bạn
              </>
            )}
          </Button>
        )
      case "PENDING_SENT":
        return (
          <Button onClick={handleCancelRequest} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            ) : (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Hủy lời mời
              </>
            )}
          </Button>
        )
      case "PENDING_RECEIVED":
        return (
          <div className="flex gap-2">
            <Button
              onClick={handleAcceptRequest}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Chấp nhận
                </>
              )}
            </Button>
            <Button onClick={handleRejectRequest} variant="outline" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  Từ chối
                </>
              )}
            </Button>
          </div>
        )
      case "FRIEND":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <UserCheck className="h-4 w-4 mr-2" />
                Bạn bè
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUnfriendDialogOpen(true)}>
                <UserMinus className="h-4 w-4 mr-2" />
                Hủy kết bạn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleFollow}>
                {followStatus === "FOLLOWING" ? (
                  <>
                    <BellOff className="h-4 w-4 mr-2" />
                    Bỏ theo dõi
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Theo dõi
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex gap-2">
        {renderFriendButton()}
        {friendStatus !== "FRIEND" && (
          <Button variant="outline" onClick={handleToggleFollow} disabled={isLoading}>
            {followStatus === "FOLLOWING" ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Bỏ theo dõi
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Theo dõi
              </>
            )}
          </Button>
        )}
      </div>

      <AlertDialog open={isUnfriendDialogOpen} onOpenChange={setIsUnfriendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy kết bạn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy kết bạn với {userName}? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnfriend} disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin mr-2"></div>
              ) : null}
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
