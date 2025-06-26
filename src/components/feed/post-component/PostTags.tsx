import type React from "react"

interface PostTagsProps {
  tags: string[]
}

export const PostTags: React.FC<PostTagsProps> = ({ tags }) => {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 lg:gap-4">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center px-2 sm:px-2.5 md:px-3 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors cursor-pointer break-words max-w-full"
        >
          <span className="truncate">#{tag}</span>
        </span>
      ))}
    </div>
  )
}
