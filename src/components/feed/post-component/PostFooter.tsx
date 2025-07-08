"use client"

import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/redux/store"
import { getReactions, reactToPost } from "@/redux/thunks/feedThunk"
import type { Post } from "@/types/postTypes"
import { MessageCircle, Send, ThumbsUp } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const PostFooter = ({ post, onClickComment }: { post: Post, onClickComment: () => void }) => {
  const [like, setLike] = useState(false)
  const dispatch = useAppDispatch();



  const onReact = async () => {
    try {
      const result = await dispatch(reactToPost({ postId: post.id, reaction: !like }));
      if (reactToPost.fulfilled.match(result)) {
        getIsLiked(); // Refresh the like status
      } else {
        toast.error("Failed to react to post");
      }
    } catch (error) {
      toast.error("Failed to react to post");
    }
  }


  const getIsLiked = async () => {
    const result = await dispatch(getReactions({ postId: post.id }))
    if (getReactions.fulfilled.match(result)) {
      const like = result.payload.data ? result.payload.data.reaction : false;
      setLike(like)
    }
  }

  useEffect(() => {
    getIsLiked();
  }, [post]);


  const reactionButtons = [
    {
      icon: ThumbsUp,
      label: like ? "Unlike" : "Like",
      active: like,
      onClick: () => {
        setLike(!like)
        onReact?.()
      },
      activeColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
      hoverColor: "hover:bg-blue-50 dark:hover:bg-blue-950/20",
    },
  ]

  const actionButtons = [
    {
      icon: MessageCircle,
      label: "Comment",
      onClick: onClickComment,
      hoverColor: "hover:bg-gray-100 dark:hover:bg-gray-800",
    },
    {
      icon: Send,
      label: "Share",
      onClick: () => null,
      hoverColor: "hover:bg-gray-100 dark:hover:bg-gray-800",
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-3 md:space-y-4">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-3">
        <div className="flex items-center justify-center sm:justify-start gap-1 sm:gap-2 md:gap-2 flex-wrap">
          {reactionButtons.map(({ icon: Icon, label, active, onClick, activeColor, hoverColor }) => (
            <Button
              key={label}
              variant="ghost"
              size="sm"
              onClick={onClick}
              className={`h-8 sm:h-9 md:h-9 lg:h-10 px-2 sm:px-3 md:px-3 lg:px-4 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-sm rounded-md sm:rounded-lg ${active ? activeColor : `text-gray-600 dark:text-gray-400 ${hoverColor}`
                }`}
            >
              <Icon
                className={`h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2 ${active ? "fill-current" : ""}`}
              />
              <span className="text-xs hidden xs:inline sm:inline">{label}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 md:gap-2">
          {actionButtons.map(({ icon: Icon, label, onClick, hoverColor }) => (
            <Button
              key={label}
              variant="ghost"
              size="sm"
              onClick={onClick}
              className={`h-8 sm:h-9 md:h-9 lg:h-10 px-2 sm:px-3 md:px-3 lg:px-4 font-semibold text-gray-600 dark:text-gray-400 transition-all duration-200 hover:scale-105 text-xs sm:text-sm md:text-sm rounded-md sm:rounded-lg ${hoverColor}`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline sm:inline">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
