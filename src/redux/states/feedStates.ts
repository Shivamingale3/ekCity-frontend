import type { PostComment } from "../../types/commentTypes";
import type { CollaboratorBody, Post } from "../../types/postTypes";

export interface PostsState {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  lastFetchTime: number | null;
  postComments: PostComment[];
  loadingPostComments: boolean;
  errorPostComments: string | null;
  usersToCollab: CollaboratorBody[];
  loadingUsersToCollab: boolean;
  errorUsersToCollab: string | null;
}

export const feedInitialState: PostsState = {
  posts: [],
  loading: false,
  refreshing: false,
  loadingMore: false,
  error: null,
  pagination: null,
  lastFetchTime: null,
  postComments: [],
  loadingPostComments: false,
  errorPostComments: null,
  usersToCollab: [],
  loadingUsersToCollab: false,
  errorUsersToCollab: null,
};
