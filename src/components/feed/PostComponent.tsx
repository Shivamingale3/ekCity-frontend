import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { usePostContent } from "@/hooks/usePostContent"
import type { Post } from "@/types/postTypes"
import type React from "react"
import { PostHeader } from "./post-component/PostCardHeader"
import { PostContent } from "./post-component/PostContent"
import { PostFooter } from "./post-component/PostFooter"
import { PostMedia } from "./post-component/PostMedia"
import { PostTags } from "./post-component/PostTags"

interface PostComponentProps {
  postData: Post
  onDelete?: () => void
  onReport?: () => void
  onLike?: () => void
  onLove?: () => void
  onImportant?: () => void
  onComment?: () => void
  onShare?: () => void
}

export const PostComponent: React.FC<PostComponentProps> = ({
  postData,
  onComment,
}) => {
  const { displayContent, expanded, setExpanded, shouldTruncate } = usePostContent(postData.postContent)

  const handleCommentClick = () => {
    if (onComment) {
      onComment();
    }
  }

  return (
    <Card className="w-[90%] lg:w-[50%] max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="p-3 sm:p-4 md:p-4 lg:p-5">
        <PostHeader postData={postData} />
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-4 lg:p-5 pt-0 space-y-3 sm:space-y-3 md:space-y-4">
        {postData.postTags && postData.postTags.length > 0 && <PostTags tags={postData.postTags} />}
        <PostContent
          content={displayContent}
          expanded={expanded}
          shouldTruncate={shouldTruncate}
          onToggleExpand={() => setExpanded(!expanded)}
        />
        <PostMedia media={postData.media} />
        <PostFooter post={postData} onClickComment={handleCommentClick} />
      </CardContent>
    </Card>
  )
}

export default PostComponent