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
          className="inline-flex items-center px-1.5 py-0.5 rounded-lg
           text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors cursor-pointer break-words max-w-full border border-blue-200 dark:border-blue-800"
        >
          <span className="truncate">#{tag}</span>
        </span>
      ))}
    </div>
  )
}
