import CreatePostDialog from "@/components/feed/create-post-component/CreatePostDialog";
import { CommentModal } from "@/components/feed/post-component/PostCommentModal";
import PostComponent from "@/components/feed/PostComponent";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/authTypes";
import { Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { clearError } from "../redux/slices/feedSlice";
import { useAppDispatch, useAppSelector, type RootState } from "../redux/store";
import { fetchPosts, loadMorePosts, refreshPosts } from "../redux/thunks/feedThunk";
import { useAuthStore } from "../stores/authStore";
import type { Post } from "../types/postTypes";


function Feed() {
  const { user } = useAuthStore();
  const dispatch = useAppDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Track if initial load has been attempted
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Pull-to-refresh state
  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  // Comment modal state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openComments, setOpenComments] = useState(false);

  const { posts, loading, refreshing, loadingMore, error, pagination } =
    useAppSelector((state: RootState) => state.feed);

  const PULL_THRESHOLD = 80;

  // Handle comment click
  const handleCommentClick = useCallback((post: Post) => {
    setSelectedPost(post);
    setOpenComments(true);
  }, []);

  const handleCloseComments = useCallback(() => {
    setOpenComments(false);
    setSelectedPost(null);
  }, []);

  // Initial load - FIX: Add hasInitialLoad to prevent infinite loop
  useEffect(() => {
    if (!hasInitialLoad && !loading) {
      setHasInitialLoad(true);
      dispatch(fetchPosts({ page: 1, limit: 10 }));
    }
  }, [dispatch, hasInitialLoad, loading]);

  // Add CSS to disable browser pull-to-refresh
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        overscroll-behavior-y: contain;
      }
      .pull-refresh-container {
        touch-action: pan-y;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle scroll for infinite loading and track position
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

      // Track if we're at the top
      setIsAtTop(scrollTop === 0);

      // Infinite scroll - load more when near bottom
      const threshold = 100;
      if (
        scrollHeight - scrollTop <= clientHeight + threshold &&
        pagination?.hasNextPage &&
        !loadingMore &&
        !loading &&
        !loadingRef.current
      ) {
        loadingRef.current = true;
        dispatch(
          loadMorePosts({
            page: pagination.currentPage + 1,
            limit: 10,
          })
        ).finally(() => {
          loadingRef.current = false;
        });
      }
    },
    [dispatch, pagination, loadingMore, loading]
  );

  // Initialize loading and refresh - FIX: Always allow refresh
  const initLoading = useCallback(() => {
    if (!refreshing && !loading) {
      dispatch(refreshPosts({ limit: 10 }));
    }
  }, [dispatch, refreshing, loading]);

  // Handle touch start
  const pullStart = useCallback((e: React.TouchEvent) => {
    if (!isAtTop || refreshing || loading) return;

    const { screenY } = e.touches[0];
    setStartPoint(screenY);
    setIsPulling(false);
  }, [isAtTop, refreshing, loading]);

  // Handle touch move
  const pull = useCallback((e: React.TouchEvent) => {
    if (!isAtTop || refreshing || loading || startPoint === 0) return;

    const touch = e.touches[0];
    const { screenY } = touch;

    // Calculate pull length
    let pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0;

    if (pullLength > 0) {
      // Prevent default scroll when pulling
      e.preventDefault();
      setIsPulling(true);
      setPullChange(pullLength);
    }
  }, [isAtTop, refreshing, loading, startPoint]);

  // Handle touch end
  const endPull = useCallback(() => {
    setStartPoint(0);

    if (pullChange > PULL_THRESHOLD) {
      initLoading();
    }

    // Reset pull state
    setTimeout(() => {
      setPullChange(0);
      setIsPulling(false);
    }, 300);
  }, [pullChange, PULL_THRESHOLD, initLoading]);

  // Add event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", pullStart as any);
    container.addEventListener("touchmove", pull as any);
    container.addEventListener("touchend", endPull);

    return () => {
      container.removeEventListener("touchstart", pullStart as any);
      container.removeEventListener("touchmove", pull as any);
      container.removeEventListener("touchend", endPull);
    };
  }, [pullStart, pull, endPull]);

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // FIX: Only show loader for initial load, not when posts are empty
  if (loading && !hasInitialLoad) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-center relative pull-refresh-container">

      {/* Error handling */}
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 text-red-700 text-center">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(clearError())}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Manual refresh button - FIX: Show always, not just when hasNextPage */}
      <div className="w-full p-2 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={initLoading}
          disabled={refreshing || loading}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto custom-scrollbar transition-transform duration-300 ease-out"
        onScroll={handleScroll}
        style={{
          transform: isPulling ? `translateY(${pullChange * 0.3}px)` : 'translateY(0px)'
        }}
      >
        <div className="flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 w-full py-4 sm:py-6 md:py-8 lg:py-10 px-2 sm:px-4 md:px-6">
          {posts.map((post) => (
            <PostComponent
              postData={post}
              key={post.id}
              onComment={() => handleCommentClick(post)}
            />
          ))}

          {/* Loading indicator for infinite scroll */}
          {loadingMore && (
            <div className="w-full flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}

          {/* End of posts indicator */}
          {posts.length > 0 && pagination && !pagination.hasNextPage && (
            <div className="w-full text-center py-4 text-gray-500">
              No more posts to load
            </div>
          )}

          {/* Empty state - FIX: Show after initial load completes */}
          {posts.length === 0 && hasInitialLoad && !loading && !refreshing && (
            <div className="w-full text-center py-8 text-gray-500">
              No posts available
            </div>
          )}
        </div>
      </div>

      {user?.role === UserRole.CITIZEN || <CreatePostDialog />}

      {/* Comment Modal - Rendered at Feed level */}
      {selectedPost && (
        <CommentModal
          isOpen={openComments}
          onClose={handleCloseComments}
          postData={selectedPost}
        />
      )}
    </div>
  );
}

export default Feed;