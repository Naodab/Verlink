"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy } from "lucide-react"

type Player = "X" | "O" | null
type Board = Player[][]

export function TicTacToe() {
  const [board, setBoard] = useState<Board>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const checkWinner = (board: Board): Player => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0]
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return board[0][i]
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0]
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2]
    }

    return null
  }

  const checkDraw = (board: Board): boolean => {
    return board.every((row) => row.every((cell) => cell !== null))
  }

  const handleClick = (row: number, col: number) => {
    if (board[row][col] || winner || isDraw) return

    const newBoard = [...board.map((row) => [...row])]
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
      setScores((prev) => ({
        ...prev,
        [newWinner]: prev[newWinner as keyof typeof prev] + 1,
      }))
      return
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true)
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
      return
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
  }

  const resetGame = () => {
    setBoard(
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(null)),
    )
    setCurrentPlayer(winner === "X" ? "O" : "X") // Loser goes first
    setWinner(null)
    setIsDraw(false)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-xs mb-6">
        <div className="text-center">
          <div className={`text-2xl font-bold ${currentPlayer === "X" && !winner && !isDraw ? "text-primary" : ""}`}>
            X
          </div>
          <div className="text-sm">{scores.X}</div>
        </div>

        <div className="text-center">
          <div className="text-sm font-medium">Hòa</div>
          <div className="text-sm">{scores.draws}</div>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${currentPlayer === "O" && !winner && !isDraw ? "text-primary" : ""}`}>
            O
          </div>
          <div className="text-sm">{scores.O}</div>
        </div>
      </div>

      <Card className="p-4 bg-muted/30">
        <div className="grid grid-cols-3 gap-2 w-64 h-64">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Button
                key={`${rowIndex}-${colIndex}`}
                variant="outline"
                className={`w-20 h-20 text-3xl font-bold flex items-center justify-center
                  ${cell === "X" ? "text-blue-500" : cell === "O" ? "text-red-500" : ""}
                  ${!cell && !winner && !isDraw ? "hover:bg-accent" : ""}
                `}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={!!cell || !!winner || isDraw}
              >
                {cell}
              </Button>
            )),
          )}
        </div>
      </Card>

      {(winner || isDraw) && (
        <div className="mt-6 text-center animate-fade-in">
          {winner ? (
            <div className="flex flex-col items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="text-xl font-bold">Người chơi {winner} thắng!</h3>
            </div>
          ) : (
            <h3 className="text-xl font-bold">Hòa!</h3>
          )}
          <Button onClick={resetGame} className="mt-4">
            Chơi lại
          </Button>
        </div>
      )}

      {!winner && !isDraw && (
        <div className="mt-6 text-center">
          <p className="text-lg">
            Lượt của người chơi: <span className="font-bold">{currentPlayer}</span>
          </p>
        </div>
      )}

      <Button variant="outline" onClick={resetScores} className="mt-6">
        Đặt lại điểm số
      </Button>
    </div>
  )
}
