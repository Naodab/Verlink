"use client"

import type React from "react"

import { ChatContainer } from "./chat-container"

export function ChatProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatContainer maxVisibleChats={3} />
    </>
  )
}
