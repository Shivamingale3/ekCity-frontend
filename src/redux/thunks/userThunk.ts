import { apiService } from "@/services/apiService";
import type { GetUserFeedResponse } from "@/types/userTypes";
import type { UserMediaResponse } from "@/types/userTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadMediaToCloudinary } from "@/services/mediaService";
import type { User } from "@/types/authTypes";

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

export const getUserMedia = createAsyncThunk<UserMediaResponse, void>(
  "user/get-user-media",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<UserMediaResponse>("/users/media");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  User,
  {
    id: string;
    updateData: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      isActive?: boolean;
      profilePicture?: File | string | null;
      mobile?: string;
    };
  },
  { rejectValue: string }
>("user/updateUserProfile", async ({ id, updateData }, { rejectWithValue }) => {
  try {
    let profilePictureUrl = undefined;
    if (
      updateData.profilePicture &&
      updateData.profilePicture instanceof File
    ) {
      profilePictureUrl = await uploadMediaToCloudinary({
        file: updateData.profilePicture,
        uploadType: "PROFILE",
        resourceType: "image",
      });
    } else if (typeof updateData.profilePicture === "string") {
      profilePictureUrl = updateData.profilePicture;
    }
    const payload: any = { ...updateData };
    if (profilePictureUrl) {
      payload.profilePicture = profilePictureUrl;
    } else {
      delete payload.profilePicture;
    }
    const response = await apiService.patch<{ data: User }>(
      `/users/${id}`,
      payload
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update user");
  }
});
