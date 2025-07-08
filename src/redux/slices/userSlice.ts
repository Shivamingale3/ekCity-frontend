// userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getUserFeed } from "../thunks/userThunk";
import { getUserMedia } from "../thunks/userThunk";
import { updateUserProfile } from "../thunks/userThunk";
import type {
  UserInitialStates,
  GetUserFeedResponse,
} from "../../types/userTypes";
import { userInitialStates } from "../states/userStates";

const initialState: UserInitialStates = userInitialStates;

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

    // User Media
    builder
      .addCase(getUserMedia.pending, (state) => {
        state.userMediaLoading = true;
        state.userMediaError = null;
      })
      .addCase(getUserMedia.fulfilled, (state, action) => {
        state.userMediaLoading = false;
        state.userMedia = action.payload.data;
        state.userMediaError = null;
      })
      .addCase(getUserMedia.rejected, (state, action) => {
        state.userMediaLoading = false;
        state.userMediaError =
          action.error.message || "Failed to fetch user media";
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.updateUserLoading = true;
        state.updateUserError = null;
        state.updateUserSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError = null;
        state.updateUserSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateUserLoading = false;
        state.updateUserError =
          action.payload || action.error.message || "Failed to update user";
        state.updateUserSuccess = false;
      });
  },
});

export const { clearUserPosts } = userSlice.actions;
export default userSlice.reducer;
