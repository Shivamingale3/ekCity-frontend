import type { Post } from "./postTypes";

export type UserInitialStates = {
  error: string | null;
  userPostsLoading: boolean;
  userPosts: Post[];
  userPostPagination: Pagination;
};

export type GetUserFeedResponse = {
  status: string;
  message: string;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
};
export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} | null;
