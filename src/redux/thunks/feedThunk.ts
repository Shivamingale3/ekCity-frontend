import { createAsyncThunk } from "@reduxjs/toolkit";
import { type AxiosResponse } from "axios";
import { apiService } from "../../services/apiService";
import type {
  CreatePostCommentResponse,
  GetPostCommentResponse,
} from "../../types/commentTypes";
import type { GetBodiesResponse, GetFeedResponse } from "../../types/postTypes";
import type { GetReactionResponse } from "../../types/reactionTypes";

export const createPost = createAsyncThunk(
  "feed/createPost",
  async (postData: FormData, { rejectWithValue }) => {
    try {
      // DON'T wrap FormData in an object - send it directly
      const response = await apiService.post<AxiosResponse>(
        "/feed/create-post",
        postData, // Send FormData directly, not { postData }
        {
          headers: {
            "Content-Type": "multipart/form-data", // This might be optional as axios sets it automatically for FormData
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 10 } = params;

    const response = await apiService.get<GetFeedResponse>("/feed/", {
      params: { page, limit },
    });

    return response.data;
  }
);

// Refresh posts (pull to refresh)
export const refreshPosts = createAsyncThunk(
  "posts/refreshPosts",
  async (params: { limit?: number } = {}) => {
    const { limit = 10 } = params;

    const response = await apiService.get<GetFeedResponse>("/feed/", {
      params: { page: 1, limit },
    });

    return response.data;
  }
);

// Load more posts for infinite scroll
export const loadMorePosts = createAsyncThunk(
  "posts/loadMorePosts",
  async (params: { page: number; limit?: number }) => {
    const { page, limit = 10 } = params;

    const response = await apiService.get<GetFeedResponse>("/feed/", {
      params: { page, limit },
    });

    return response.data;
  }
);

export const reactToPost = createAsyncThunk(
  "posts/reactToPost",
  async (
    params: { postId: string; reaction: boolean },
    { rejectWithValue }
  ) => {
    const { postId, reaction } = params;

    try {
      const response = await apiService.post(`/reaction/${postId}`, {
        reaction,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getReactions = createAsyncThunk<
  GetReactionResponse,
  { postId: string }
>("posts/getReactions", async ({ postId }, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetReactionResponse>(
      `/reaction/${postId}/user`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getPostComments = createAsyncThunk<
  GetPostCommentResponse,
  { postId: string; params?: { page?: number; limit?: number } }
>("posts/getPostComments", async ({ postId, params }, { rejectWithValue }) => {
  try {
    const response = await apiService.get<GetPostCommentResponse>(
      `/comments/${postId}`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createPostComment = createAsyncThunk<
  CreatePostCommentResponse,
  { postId: string; content: string }
>("posts/createComment", async ({ postId, content }, { rejectWithValue }) => {
  try {
    const response = await apiService.post<CreatePostCommentResponse>(
      `/comments/${postId}`,
      {
        content,
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const replyToComment = createAsyncThunk<
  CreatePostCommentResponse,
  { commentId: string; content: string }
>(
  "posts/replyToComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<CreatePostCommentResponse>(
        `/comments/comment/${commentId}/reply`,
        {
          content,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBodiesToCollab = createAsyncThunk<GetBodiesResponse, null>(
  "posts/getBodiesToCollab",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<GetBodiesResponse>(
        "/users/users-to-collab"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
