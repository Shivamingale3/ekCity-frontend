import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { feedInitialState } from "../states/feedStates";
import {
  fetchPosts,
  getBodiesToCollab,
  getPostComments,
  loadMorePosts,
  refreshPosts,
} from "../thunks/feedThunk";
import type {
  GetPostCommentResponse,
  PostComment,
} from "../../types/commentTypes";
import type { GetBodiesResponse, GetFeedResponse } from "../../types/postTypes";

const postsSlice = createSlice({
  name: "posts",
  initialState: feedInitialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.pagination = null;
      state.lastFetchTime = null;
    },
    appendPostComments: (state, action: PayloadAction<PostComment>) => {
      state.postComments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<GetFeedResponse>) => {
          state.loading = false;
          state.posts = action.payload.data.posts;
          state.pagination = action.payload.data.pagination;
          state.lastFetchTime = Date.now();
          state.error = null;
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })

      // Refresh Posts - FIX: Replace posts instead of prepending when refreshing
      .addCase(refreshPosts.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(
        refreshPosts.fulfilled,
        (state, action: PayloadAction<GetFeedResponse>) => {
          state.refreshing = false;

          // FIX: For refresh, replace all posts (don't prepend)
          // This ensures that even if there are no posts, the refresh completes properly
          state.posts = action.payload.data.posts;
          state.pagination = action.payload.data.pagination;
          state.lastFetchTime = Date.now();
          state.error = null;
        }
      )
      .addCase(refreshPosts.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.error.message || "Failed to refresh posts";
      })

      // Load More Posts
      .addCase(loadMorePosts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(
        loadMorePosts.fulfilled,
        (state, action: PayloadAction<GetFeedResponse>) => {
          state.loadingMore = false;
          // Append new posts and remove duplicates
          const newPosts = action.payload.data.posts;
          const existingPostIds = new Set(state.posts.map((post) => post.id));
          const uniqueNewPosts = newPosts.filter(
            (post) => !existingPostIds.has(post.id)
          );

          state.posts = [...state.posts, ...uniqueNewPosts];
          state.pagination = action.payload.data.pagination;
          state.error = null;
        }
      )
      .addCase(loadMorePosts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.error.message || "Failed to load more posts";
      })
      .addCase(getPostComments.pending, (state) => {
        state.loadingPostComments = true;
        state.errorPostComments = null;
      })
      .addCase(
        getPostComments.fulfilled,
        (state, action: PayloadAction<GetPostCommentResponse>) => {
          state.loadingPostComments = false;

          state.postComments = action.payload.data.comments.map(
            (comment: any) => ({
              ...comment,
              likes: comment.likes ?? 0,
              isLiked: comment.isLiked ?? false,
            })
          );
          state.errorPostComments = null;
        }
      )
      .addCase(getPostComments.rejected, (state, action) => {
        state.loadingPostComments = false;
        state.errorPostComments =
          action.error.message || "Failed to fetch post comments";
        state.postComments = [];
      })
      .addCase(getBodiesToCollab.pending, (state) => {
        state.loadingUsersToCollab = true;
        state.errorUsersToCollab = null;
      })
      .addCase(
        getBodiesToCollab.fulfilled,
        (state, action: PayloadAction<GetBodiesResponse>) => {
          state.loadingUsersToCollab = false;
          state.usersToCollab = action.payload.data.bodies;
          state.errorUsersToCollab = null;
        }
      )
      .addCase(getBodiesToCollab.rejected, (state, action) => {
        state.loadingUsersToCollab = false;
        state.errorUsersToCollab =
          action.error.message || "Failed to fetch bodies to collab";
        state.usersToCollab = [];
      });
  },
});

export const { clearError, resetPosts, appendPostComments } =
  postsSlice.actions;
export default postsSlice.reducer;
