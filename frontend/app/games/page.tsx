"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GamepadIcon, Star, Users, Clock } from "lucide-react"
import { TicTacToe } from "@/components/games/tictactoe"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock game data
const GAMES = [
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "Trò chơi cờ ca-rô đơn giản 3x3",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Tic+Tac+Toe",
    players: "2 người chơi",
    rating: 4.5,
    playTime: "2 phút",
    category: "Cờ",
  },
  {
    id: "snake",
    name: "Snake",
    description: "Trò chơi rắn săn mồi cổ điển",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Snake",
    players: "1 người chơi",
    rating: 4.2,
    playTime: "5 phút",
    category: "Arcade",
  },
  {
    id: "puzzle",
    name: "Puzzle Challenge",
    description: "Giải các câu đố thử thách trí tuệ",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Puzzle",
    players: "1 người chơi",
    rating: 4.7,
    playTime: "10 phút",
    category: "Giải đố",
  },
  {
    id: "chess",
    name: "Chess",
    description: "Cờ vua trực tuyến với nhiều cấp độ",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Chess",
    players: "2 người chơi",
    rating: 4.8,
    playTime: "15 phút",
    category: "Cờ",
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Trò chơi lật thẻ tìm cặp giống nhau",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Memory",
    players: "1-2 người chơi",
    rating: 4.0,
    playTime: "5 phút",
    category: "Trí nhớ",
  },
  {
    id: "wordle",
    name: "Word Puzzle",
    description: "Đoán từ 5 chữ cái trong 6 lượt",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Word+Puzzle",
    players: "1 người chơi",
    rating: 4.6,
    playTime: "5 phút",
    category: "Từ vựng",
  },
]

export default function GamesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

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

  const renderGameContent = (gameId: string) => {
    switch (gameId) {
      case "tictactoe":
        return <TicTacToe />
      default:
        return (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <GamepadIcon className="h-16 w-16 mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">Game đang phát triển</h3>
            <p className="text-muted-foreground">Trò chơi này đang trong quá trình phát triển và sẽ sớm được ra mắt.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Navbar />
      <main className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Trò chơi</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <Card key={game.id} className="overflow-hidden card-hover">
              <div className="relative">
                <img
                  src={game.thumbnail || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 text-xs rounded-full">
                  {game.category}
                </div>
              </div>

              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{game.players}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{game.playTime}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full" onClick={() => setSelectedGame(game.id)}>
                  <GamepadIcon className="h-4 w-4 mr-2" />
                  Chơi ngay
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={selectedGame !== null} onOpenChange={(open) => !open && setSelectedGame(null)}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedGame && GAMES.find((g) => g.id === selectedGame)?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{selectedGame && renderGameContent(selectedGame)}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
