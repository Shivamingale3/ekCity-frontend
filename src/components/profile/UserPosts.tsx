import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getUserFeed } from "@/redux/thunks/userThunk";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState, useCallback, useRef } from "react";
import PostComponent from "../feed/PostComponent";

function UserPosts() {
    const { userPosts, userPostPagination, userPostsLoading } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const { user } = useAuthStore();

    // State management
    const [limit] = useState<number>(10);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMoreData, setHasMoreData] = useState<boolean>(true);

    // Refs
    const containerRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement | null>(null);

    // Initialize data
    useEffect(() => {
        if (user?.id && (!userPosts.length || !userPostPagination)) {
            dispatch(getUserFeed({ page: 1, limit, userId: user.id }));
        }
    }, [dispatch, limit, user?.id, userPosts.length, userPostPagination]);

    // Update hasMoreData when pagination changes
    useEffect(() => {
        if (userPostPagination) {
            setHasMoreData(userPostPagination.hasNextPage);
        }
    }, [userPostPagination]);

    // Load more posts function
    const loadMorePosts = useCallback(async () => {
        if (
            isLoadingMore ||
            !hasMoreData ||
            !user?.id ||
            !userPostPagination ||
            userPostsLoading
        ) {
            return;
        }

        setIsLoadingMore(true);

        try {
            await dispatch(getUserFeed({
                page: userPostPagination.currentPage + 1,
                limit,
                userId: user.id
            })).unwrap();
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [dispatch, limit, user?.id, isLoadingMore, hasMoreData, userPostPagination, userPostsLoading]);

    // Setup intersection observer for infinite scroll
    useEffect(() => {
        if (!loadingRef.current || !hasMoreData) return;

        // Cleanup existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMoreData && !isLoadingMore && !userPostsLoading) {
                    loadMorePosts();
                }
            },
            {
                root: containerRef.current,
                rootMargin: '100px 0px',
                threshold: 0.1
            }
        );

        observerRef.current.observe(loadingRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMoreData, isLoadingMore, userPostsLoading, loadMorePosts]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Loading state for initial load
    if (userPostsLoading && !userPosts.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px] w-full">
                <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-500">Loading posts...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!userPostsLoading && !userPosts.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px] w-full">
                <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                    <p className="text-sm text-gray-500">Your posts will appear here when you create them.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Scrollable container */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto overscroll-behavior-y-contain"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E1 transparent'
                }}
            >
                {/* Posts grid/list */}
                <div className="space-y-4 p-1">
                    {userPosts.map((post, index) => (
                        <div
                            key={`post-${post.id}-${index}`}
                            className="w-full"
                        >
                            <PostComponent postData={post} />
                        </div>
                    ))}

                    {/* Infinite scroll trigger */}
                    {hasMoreData && (
                        <div
                            ref={loadingRef}
                            className="flex items-center justify-center py-8 w-full"
                        >
                            {isLoadingMore ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                    <span className="text-sm text-gray-500">Loading more posts...</span>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400">Scroll for more posts</div>
                            )}
                        </div>
                    )}

                    {/* End of posts indicator */}
                    {!hasMoreData && userPosts.length > 0 && (
                        <div className="flex items-center justify-center py-6 w-full">
                            <div className="text-center">
                                <div className="text-gray-300 text-sm">✨</div>
                                <p className="text-xs text-gray-400 mt-1">You've reached the end</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserPosts;