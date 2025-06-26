import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, Bookmark, Globe, MoreHorizontal, Trash2 } from "lucide-react"

export const PostActions = ({
  isOwnPost,
  onDelete,
  onReport,
}: {
  isOwnPost: boolean
  onDelete?: () => void
  onReport?: () => void
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-9 md:w-9 lg:h-10 lg:w-10 text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <MoreHorizontal className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 sm:w-50 md:w-52 lg:w-54 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg sm:rounded-xl"
      >
        <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-900 text-sm sm:text-sm md:text-base p-2 sm:p-2.5">
          <Globe className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2.5" />
          Show Original
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-900 text-sm sm:text-sm md:text-base p-2 sm:p-2.5">
          <Bookmark className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2.5" />
          Save Post
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
        {isOwnPost ? (
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm sm:text-sm md:text-base p-2 sm:p-2.5"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2.5" />
            Delete post
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm sm:text-sm md:text-base p-2 sm:p-2.5"
            onClick={onReport}
          >
            <AlertTriangle className="h-4 w-4 sm:h-4 sm:w-4 mr-2 sm:mr-2.5" />
            Report post
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
