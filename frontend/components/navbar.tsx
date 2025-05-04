"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Menu, MessageSquare, Search, User, X, Video, Users, GamepadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Skip rendering on auth pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo and Search - Left Side */}
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/feed" className="hidden md:flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary glow-text">V</span>
          </Link>

          {/* Search Bar - Now on Left */}
          <div className="relative w-full max-w-xs">
            {isSearchOpen ? (
              <div className="absolute inset-0 flex items-center">
                <Input
                  type="search"
                  placeholder="Tìm kiếm trên Verlink..."
                  className="h-9 w-full rounded-md"
                  autoFocus
                />
                <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="icon" className="h-9 w-9 md:hidden" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <div className="hidden md:flex items-center">
              <Search className="h-4 w-4 absolute left-2.5 text-muted-foreground" />
              <Input type="search" placeholder="Tìm kiếm trên Verlink..." className="h-9 w-full rounded-md pl-8" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/feed" className="flex items-center space-x-2 mb-8">
              <span className="text-2xl font-bold text-primary glow-text">Verlink</span>
            </Link>
            <nav className="grid gap-2 text-lg font-medium">
              <Link href="/feed" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <Home className="h-5 w-5" />
                Trang chủ
              </Link>
              <Link href="/videos" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <Video className="h-5 w-5" />
                Video
              </Link>
              <Link href="/groups" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <Users className="h-5 w-5" />
                Nhóm
              </Link>
              <Link href="/games" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <GamepadIcon className="h-5 w-5" />
                Trò chơi
              </Link>
              <Link href="/messages" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <MessageSquare className="h-5 w-5" />
                Tin nhắn
              </Link>
              <Link href="/notifications" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <Bell className="h-5 w-5" />
                Thông báo
              </Link>
              <Link href="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <User className="h-5 w-5" />
                Trang cá nhân
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-1 flex-1">
          <Button asChild variant="ghost" size="icon" className={pathname === "/feed" ? "bg-accent" : ""}>
            <Link href="/feed">
              <Home className="h-5 w-5" />
              <span className="sr-only">Trang chủ</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className={pathname === "/videos" ? "bg-accent" : ""}>
            <Link href="/videos">
              <Video className="h-5 w-5" />
              <span className="sr-only">Video</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className={pathname === "/groups" ? "bg-accent" : ""}>
            <Link href="/groups">
              <Users className="h-5 w-5" />
              <span className="sr-only">Nhóm</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className={pathname === "/games" ? "bg-accent" : ""}>
            <Link href="/games">
              <GamepadIcon className="h-5 w-5" />
              <span className="sr-only">Trò chơi</span>
            </Link>
          </Button>
        </div>

        {/* Right Side - User Controls */}
        <div className="flex items-center gap-2 justify-end flex-1">
          <Button asChild variant="ghost" size="icon" className={pathname === "/messages" ? "bg-accent" : ""}>
            <Link href="/messages">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Tin nhắn</span>
            </Link>
          </Button>

          {/* Thay thế nút thông báo bằng NotificationDropdown */}
          <NotificationDropdown />

          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage?.url || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Trang cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Cài đặt</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
