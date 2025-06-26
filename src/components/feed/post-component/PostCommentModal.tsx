"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { appendPostComments } from "@/redux/slices/feedSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { createPostComment, getPostComments, replyToComment } from "@/redux/thunks/feedThunk"
import type { PostComment } from "@/types/commentTypes"
import type { Post } from "@/types/postTypes"
import { getInitials, getTimeAgo } from "@/utils/universalFunctions"
import { Reply, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import PostCommentLoader from "./PostCommentLoader"
import { useAuthStore } from "@/stores/authStore"

interface CommentModalProps {
    isOpen: boolean
    onClose: () => void
    postData: Post
}

export const CommentModal = ({
    isOpen,
    onClose,
    postData
}: CommentModalProps) => {
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const { loadingPostComments, errorPostComments, postComments } = useAppSelector((state) => state.feed);
    const dispatch = useAppDispatch();
    const [creatingComment, setCreatingComment] = useState<boolean>(false);
    const [replyingComment, setReplyingComment] = useState<boolean>(false);
    const { user } = useAuthStore();

    if (!isOpen) return null

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        try {
            setCreatingComment(true);
            const response = await dispatch(createPostComment({ postId: postData.id, content: newComment }));

            if (createPostComment.fulfilled.match(response)) {
                dispatch(appendPostComments(response.payload.data));
                setNewComment("");
                toast.success("Comment posted successfully!");
                // Refresh comments to get updated data
                dispatch(getPostComments({ postId: postData.id }));
            } else if (createPostComment.rejected.match(response)) {
                toast.error("Failed to post comment. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to post comment. Please try again.");
        } finally {
            setCreatingComment(false);
        }
    }

    const handleSubmitReply = async (commentId: string) => {
        if (!replyContent.trim()) return;

        try {
            setReplyingComment(true);
            const response = await dispatch(replyToComment({ commentId, content: replyContent }));

            if (replyToComment.fulfilled.match(response)) {
                const newReply = response.payload.data;
                dispatch(appendPostComments(newReply));
                setReplyContent("");
                setReplyingTo(null);
                toast.success("Reply posted successfully!");
                // Refresh comments to get updated data with replies
                dispatch(getPostComments({ postId: postData.id }));
            } else if (replyToComment.rejected.match(response)) {
                toast.error("Failed to reply. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to reply. Please try again.");
        } finally {
            setReplyingComment(false);
        }
    }

    // Load comments when modal opens
    useEffect(() => {
        if (isOpen) {
            dispatch(getPostComments({ postId: postData.id }));
        }
    }, [isOpen, postData.id, dispatch]);

    const renderComment = (comment: PostComment, isReply = false) => (
        <div key={comment?.id} className={`${isReply ? "ml-12" : ""} space-y-3`}>
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.profilePicture ?? ""} alt={comment.user.fullName} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(comment.user.fullName)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.user.fullName}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {!isReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                onClick={() => setReplyingTo(comment.id)}
                                disabled={replyingComment}
                            >
                                <Reply className="h-3 w-3 mr-1" />
                                Reply
                            </Button>
                        )}
                    </div>

                    {replyingTo === comment.id && (
                        <div className="flex gap-2 mt-2">
                            <Textarea
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="min-h-[60px] text-sm"
                                disabled={replyingComment}
                            />
                            <div className="flex flex-col gap-1">
                                <Button
                                    size="sm"
                                    onClick={() => handleSubmitReply(comment.id)}
                                    disabled={!replyContent.trim() || replyingComment}
                                >
                                    {replyingComment ? "Posting..." : "Reply"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent("");
                                    }}
                                    disabled={replyingComment}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {comment.replies && comment.replies.map((reply: any) => renderComment(reply, true))}
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Comments ({postComments.length})
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loadingPostComments && !creatingComment && !replyingComment && (
                        <div className="text-center py-8">
                            <PostCommentLoader />
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
                        </div>
                    )}

                    {errorPostComments && !loadingPostComments && (
                        <div className="text-center py-8">
                            <p className="text-red-500 dark:text-red-400">{errorPostComments}</p>
                        </div>
                    )}

                    {!loadingPostComments && !errorPostComments && postComments.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                        </div>
                    )}

                    {!loadingPostComments && !errorPostComments && postComments.length > 0 && (
                        <>
                            {postComments.map((comment) => renderComment(comment))}
                            {(creatingComment || replyingComment) && (
                                <div className="flex items-center justify-center py-4">
                                    <PostCommentLoader />
                                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                        {creatingComment ? "Posting comment..." : "Posting reply..."}
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Add Comment */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.profilePicture ?? ""} alt={user?.fullName ?? "User"} />

                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(user?.fullName || "User")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Textarea
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px]"
                                disabled={creatingComment}
                            />
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim() || creatingComment}
                                >
                                    {creatingComment ? "Posting..." : "Post Comment"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}