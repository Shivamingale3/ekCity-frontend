import { format, formatDistanceToNow } from "date-fns";

export function getFormattedText({
  text,
  limit = 15,
}: {
  text: string;
  limit?: number;
}) {
  if (text.trim().length < limit) {
    return text;
  } else {
    return `${text.substring(0, limit)}...`;
  }
}

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  if (now.getTime() - date.getTime() < 86400000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return format(date, "MMM d, yyyy");
};
