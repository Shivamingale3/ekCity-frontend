import { UserRole } from "@/types/authTypes";
import { PostCategory } from "@/types/postTypes";

export const POST_STYLES = {
  category: {
    [PostCategory.ALERT]: {
      gradient: "from-red-500 to-orange-500",
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-700 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      icon: "⚠️",
      glow: "shadow-red-500/20",
    },
    [PostCategory.NEWS]: {
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      icon: "📰",
      glow: "shadow-blue-500/20",
    },
    [PostCategory.ANNOUNCEMENT]: {
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-800",
      icon: "📢",
      glow: "shadow-purple-500/20",
    },
    [PostCategory.DISCUSSION]: {
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-700 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      icon: "💬",
      glow: "shadow-green-500/20",
    },
    [PostCategory.UPDATE]: {
      gradient: "from-amber-500 to-yellow-500",
      bg: "bg-amber-50 dark:bg-amber-950/20",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
      icon: "🔄",
      glow: "shadow-amber-500/20",
    },
  },
  role: {
    [UserRole.GOVERNMENT]: {
      gradient: "from-blue-600 to-indigo-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-700",
      icon: "🏛️",
      label: "Government",
    },
    [UserRole.PRIVATE]: {
      gradient: "from-emerald-600 to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-700",
      icon: "🏢",
      label: "Verified",
    },
    [UserRole.ADMIN]: {
      gradient: "from-purple-600 to-violet-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-700",
      icon: "👮",
      label: "Admin",
    },
    [UserRole.CITIZEN]: {
      gradient: "from-gray-600 to-slate-600",
      bg: "bg-gray-50 dark:bg-gray-800/30",
      text: "text-gray-700 dark:text-gray-300",
      border: "border-gray-200 dark:border-gray-600",
      icon: "👤",
      label: "Citizen",
    },
  },
};
