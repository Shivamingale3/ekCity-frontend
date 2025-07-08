import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { POST_STYLES } from "@/content/postContent"
import { UserRole } from "@/types/authTypes"
import type { Post } from "@/types/postTypes"
import { getInitials, getTimeAgo } from "@/utils/universalFunctions"
import type React from "react"
import { PostActions } from "./PostActions"
import { useAuthStore } from "@/stores/authStore"



export const PostHeader: React.FC<{ postData: Post }> = ({ postData }) => {

  const { user } = useAuthStore();
  const getRoleBadgeText = (role: UserRole) => {
    switch (role) {
      case UserRole.GOVERNMENT:
        return "Government"
      case UserRole.PRIVATE:
        return "Verified"
      case UserRole.ADMIN:
        return "Admin"
      default:
        return "Citizen"
    }
  }

  const roleStyle = postData.user.role ? POST_STYLES.role[postData.user.role] : POST_STYLES.role[UserRole.CITIZEN]
  const categoryStyle = POST_STYLES.category[postData.postCategory]
  const isOwnPost = !!(user && user.id === postData.user?.id)


  return (
    <div className="flex justify-between items-center gap-2 sm:gap-3 md:gap-3 lg:gap-4 h-full">
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 ring-1 sm:ring-2 ring-gray-100 dark:ring-gray-800">
          <AvatarImage src={postData.user?.profilePicture ?? ""} alt={postData.user?.fullName ?? ""} className="object-cover" />
          <AvatarFallback className="text-xs sm:text-sm md:text-sm lg:text-base font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {getInitials(postData.user?.fullName ?? "")}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0 space-y-1 sm:space-y-1 md:space-y-1.5 mr-2">
        <div className="flex items-center flex-wrap gap-1 sm:gap-2 md:gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base md:text-lg lg:text-lg truncate">
            {postData.user?.fullName}
          </h3>
          {postData.user?.role && postData.user.role !== UserRole.CITIZEN && (
            <Badge
              variant="outline"
              className={`text-xs sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.5 ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} rounded-full flex-shrink-0`}
            >
              {getRoleBadgeText(postData.user.role)}
            </Badge>
          )}
        </div>

        {postData.collaborators && postData.collaborators.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-sm text-gray-600 dark:text-gray-400">
            <span className="flex-shrink-0 font-medium">In collaboration with:</span>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {postData.collaborators.map((collaborator, index) => (
                <span key={collaborator?.id} className="font-medium text-gray-700 dark:text-gray-300 break-words">
                  {collaborator?.user.fullName}
                  {index < postData.collaborators.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 max-w-[40%] lg:max-w-none">
        <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end gap-1 sm:gap-2 lg:gap-1 min-w-0">
          <Badge
            variant="outline"
            className={`text-xs sm:text-xs md:text-sm font-medium px-2 sm:px-2.5 py-1 sm:py-1 ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} rounded-full whitespace-nowrap`}
          >
            {postData.postCategory}
          </Badge>
          <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {getTimeAgo(postData.createdAt)} ago
          </div>
        </div>

        <div className="flex-shrink-0">
          <PostActions isOwnPost={isOwnPost} onDelete={() => null} onReport={() => null} />
        </div>
      </div>
    </div>
  )
}
