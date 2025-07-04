import type { Post } from "./postTypes";

export type UserInitialStates = {
  error: string | null;
  userPostsLoading: boolean;
  userPosts: Post[];
  userPostPagination: Pagination;
  userMedia: UserMediaData | null;
  userMediaLoading: boolean;
  userMediaError: string | null;
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

// User Media API Types
export type UserMediaPostMedia = {
  images: string[];
  videos: string[];
};

export type UserMediaData = {
  profilePictures: string[];
  postMedia: UserMediaPostMedia;
};

export type UserMediaResponse = {
  status: string;
  message: string;
  data: UserMediaData;
};
