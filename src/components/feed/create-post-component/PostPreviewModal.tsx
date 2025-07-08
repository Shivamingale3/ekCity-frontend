import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@/types/authTypes";
import type { PostData } from "@/types/postTypes";
import {
  formatTimestamp,
  getFormattedText,
  getInitials,
} from "@/utils/universalFunctions";
import { useEffect, useState } from "react";

export const PostPreview = ({ postData }: { postData: PostData }) => {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState(
    postData.postContent.split(" ").length > 100
      ? getFormattedText({ text: postData.postContent, limit: 250 })
      : postData.postContent
  );

  useEffect(() => {
    if (expanded) {
      setContent(postData.postContent);
    } else {
      setContent(
        postData.postContent.split(" ").length > 100
          ? getFormattedText({ text: postData.postContent, limit: 250 })
          : postData.postContent
      );
    }
  }, [expanded, postData.postContent]);

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="p-3 sm:p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-gray-100 dark:ring-gray-800">
              <AvatarImage
                src={postData.author?.profilePicture ?? ""}
                alt={postData.author?.firstName ?? ""}
                className="object-cover"
              />
              <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(postData.author?.firstName ?? "")}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                <span className="font-semibold text-sm sm:text-base truncate">
                  {postData.author?.firstName || "Current User"}
                </span>
                {postData.author?.role === UserRole.GOVERNMENT && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 flex-shrink-0"
                  >
                    Government
                  </Badge>
                )}
                {postData.author?.role === UserRole.PRIVATE && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-amber-50 text-amber-700 flex-shrink-0"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2">
          {postData.postCategory && (
            <Badge variant="secondary" className="text-xs">
              {postData.postCategory.replace("_", " ")}
            </Badge>
          )}

          {postData.collaborators && postData.collaborators.length > 0 && (
            <div className="flex items-start mt-2 text-xs text-muted-foreground">
              <span className="flex-shrink-0">In collaboration with:</span>
              <div className="flex flex-wrap ml-1">
                {postData.collaborators.map((collaborator, index) => (
                  <span key={collaborator?.id} className="font-medium">
                    {collaborator?.firstName}
                    {index < (postData.collaborators?.length ?? 0) - 1
                      ? ", "
                      : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        {postData.postContent && (
          <div className="whitespace-pre-line mb-3 text-sm sm:text-base leading-relaxed">
            {content}
            {postData.postContent.split(" ").length > 100 && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent text-blue-700 hover:text-blue-700 hover:underline p-0 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? " View Less" : " View More"}
              </Button>
            )}
          </div>
        )}

        {postData.postImageUrls && postData.postImageUrls.length > 0 && (
          <div className="mt-3 rounded-md overflow-hidden">
            <div className="grid grid-cols-2 gap-2">
              {postData.postImageUrls.slice(0, 4).map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  {index === 3 && (postData.postImageUrls?.length ?? 0) > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold rounded-md">
                      +{(postData.postImageUrls?.length ?? 0) - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {postData.postVideoUrls && postData.postVideoUrls.length > 0 && (
          <div className="mt-3 rounded-md overflow-hidden">
            <video
              src={postData.postVideoUrls[0]}
              controls
              className="w-full h-auto rounded-md max-h-[250px]"
            />
          </div>
        )}

        {postData.postTags && postData.postTags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-4">
            {postData.postTags.map((tag, index) => (
              <span key={index} className="text-xs sm:text-sm text-primary">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
