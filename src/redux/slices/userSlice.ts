// userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserFeed } from "../thunks/userThunk";
import type {
  UserInitialStates,
  GetUserFeedResponse,
} from "../../types/userTypes";

const initialState: UserInitialStates = {
  error: null,
  userPostsLoading: false,
  userPosts: [],
  userPostPagination: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add any synchronous reducers here
    clearUserPosts: (state) => {
      state.userPosts = [];
      state.userPostPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserFeed.pending, (state, _action) => {
        state.userPostsLoading = true;
        state.error = null;
      })
      .addCase(
        getUserFeed.fulfilled,
        (state, action: PayloadAction<GetUserFeedResponse>) => {
          state.userPostsLoading = false;
          state.error = null;

          const { posts, pagination } = action.payload.data;

          // If it's the first page or we're refreshing, replace the posts
          if (pagination?.currentPage === 1) {
            state.userPosts = posts;
          } else {
            // For subsequent pages, append the new posts
            state.userPosts = [...state.userPosts, ...posts];
          }

          state.userPostPagination = pagination;
        }
      )
      .addCase(getUserFeed.rejected, (state, action) => {
        state.userPostsLoading = false;
        state.error = action.error.message || "Failed to fetch user posts";
      });
  },
});

export const { clearUserPosts } = userSlice.actions;
export default userSlice.reducer;
