"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CommentItem, type CommentData } from "./comment-item"
import { CommentInput } from "./comment-input"
import { useAuth } from "@/components/auth-provider"

interface CommentsSectionProps {
  postId: string | number
  initialComments?: CommentData[]
}

export function CommentsSection({ postId, initialComments = [] }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<CommentData[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<{ commentId: string | number; authorName: string } | null>(null)
  const [showAllComments, setShowAllComments] = useState(false)

  const handleAddComment = (content: string) => {
    if (!user) return

    if (replyingTo) {
      // Add reply to existing comment
      const newComments = comments.map((comment) => {
        if (comment.id === replyingTo.commentId) {
          return {
            ...comment,
            replies: [
              ...(comment.replies || []),
              {
                id: `reply-${Date.now()}`,
                content,
                createdAt: new Date(),
                author: {
                  id: user.id,
                  username: user.username,
                  image: user.profileImage?.url,
                },
                likes: 0,
              },
            ],
          }
        }
        return comment
      })
      setComments(newComments)
      setReplyingTo(null)
    } else {
      // Add new comment
      const newComment: CommentData = {
        id: `comment-${Date.now()}`,
        content,
        createdAt: new Date(),
        author: {
          id: user.id,
          username: user.username,
          image: user.profileImage?.url,
        },
        likes: 0,
      }
      setComments([...comments, newComment])
    }
  }

  const handleReply = (commentId: string | number) => {
    const comment = comments.find((c) => c.id === commentId)
    if (comment) {
      setReplyingTo({ commentId, authorName: comment.author.username })
    }
  }

  const handleLike = (commentId: string | number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          }
        }
        // Check in replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              }
              return reply
            }),
          }
        }
        return comment
      }),
    )
  }

  const handleDelete = (commentId: string | number) => {
    // Filter out the deleted comment
    const newComments = comments.filter((comment) => comment.id !== commentId)

    // Also check for replies
    const commentsWithFilteredReplies = newComments.map((comment) => {
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.filter((reply) => reply.id !== commentId),
        }
      }
      return comment
    })

    setComments(commentsWithFilteredReplies)
  }

  // Display only 3 comments initially
  const displayedComments = showAllComments ? comments : comments.slice(-3)

  return (
    <div className="mt-4">
      {comments.length > 3 && !showAllComments && (
        <Button
          variant="link"
          className="text-sm text-muted-foreground p-0 h-auto mb-2"
          onClick={() => setShowAllComments(true)}
        >
          Xem tất cả {comments.length} bình luận
        </Button>
      )}

      {displayedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={handleReply}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}

      {user && (
        <CommentInput
          userImage={user.profileImage?.url}
          userName={user.username}
          onSubmit={handleAddComment}
          replyingTo={replyingTo?.authorName}
          onCancelReply={() => setReplyingTo(null)}
          autoFocus={!!replyingTo}
        />
      )}
    </div>
  )
}
