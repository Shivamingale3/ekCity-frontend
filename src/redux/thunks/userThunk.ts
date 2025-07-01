import { apiService } from "@/services/apiService";
import type { GetUserFeedResponse } from "@/types/userTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserFeed = createAsyncThunk<
  GetUserFeedResponse,
  { page: number; limit: number; userId: string }
>(
  "user/get-user-feed",
  async ({ page, limit, userId }, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetUserFeedResponse>(
        `/users/posts/${userId}`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
