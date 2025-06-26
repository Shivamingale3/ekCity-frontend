import type React from "react"
import { Button } from "@/components/ui/button"

interface PostContentProps {
  content: string
  expanded: boolean
  shouldTruncate: boolean
  onToggleExpand: () => void
}

export const PostContent: React.FC<PostContentProps> = ({ content, expanded, shouldTruncate, onToggleExpand }) => {
  return (
    <div className="space-y-2 sm:space-y-2 md:space-y-3">
      <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base md:prose-base lg:prose-lg">
        <p className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 text-sm sm:text-base md:text-base lg:text-lg leading-relaxed sm:leading-relaxed md:leading-relaxed">
          {content}
        </p>
      </div>

      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 p-1 sm:p-1.5 h-auto font-medium transition-colors text-sm sm:text-sm md:text-base rounded-md sm:rounded-lg"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  )
}
