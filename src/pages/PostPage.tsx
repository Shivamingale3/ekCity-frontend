import PostComponent from "@/components/feed/PostComponent";
import { CommentModal } from "@/components/feed/post-component/PostCommentModal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPostById } from "@/redux/thunks/feedThunk";
import { ArrowLeft } from "lucide-react";
import type { Post } from "@/types/postTypes";

function PostPage() {
  const { postId } = useParams({ strict: false }) as unknown as {
    postId: string;
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedPost, loading, error } = useAppSelector(
    (state) => state.feed,
  );
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(getPostById(postId));
    }
  }, [postId, dispatch]);

  const handleCommentClick = useCallback(() => {
    setCommentsOpen(true);
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/feed" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Feed
        </Button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col items-center gap-4 py-4 px-2 sm:px-4">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => postId && dispatch(getPostById(postId))}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}

          {!loading && !error && !selectedPost && (
            <div className="text-center py-12 text-gray-500">
              Post not found
            </div>
          )}

          {selectedPost && (
            <PostComponent
              postData={selectedPost as unknown as Post}
              onComment={handleCommentClick}
            />
          )}
        </div>
      </div>

      {commentsOpen && selectedPost && (
        <CommentModal
          isOpen={commentsOpen}
          onClose={() => setCommentsOpen(false)}
          postData={selectedPost as unknown as Post}
        />
      )}
    </div>
  );
}

export default PostPage;
