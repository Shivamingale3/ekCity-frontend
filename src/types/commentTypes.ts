import type { PostReaction } from "./reactionTypes";

export type GetPostCommentResponse = {
  status: string;
  message: string;
  data: {
    comments: PostComment[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
};

export type PostComment = {
  id: string;
  userId: string;
  postId: string;
  parentCommentId: string | null;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  replies: [
    {
      id: string;
      userId: string;
      postId: string;
      parentCommentId: string | null;
      content: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        fullName: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
      };
    }
  ];
  reactions: PostReaction;
};

export type CreatePostCommentResponse = {
  status: string;
  message: string;
  data: PostComment;
};
