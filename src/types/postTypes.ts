import { UserRole } from "./authTypes";

export enum PostCategory {
  ALERT = "ALERT",
  NEWS = "NEWS",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  DISCUSSION = "DISCUSSION",
  UPDATE = "UPDATE",
}

export enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export type GetFeedResponse = {
  status: "success" | "error";
  message: string;
  data: {
    posts: Post[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
};

export type PostMedia = {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export type PostCollaborator = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: PostAuthor;
};

export type PostAuthor = {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  role: UserRole;
};

export type Post = {
  id: string;
  userId: string;
  postContent: string;
  postCategory: PostCategory;
  postTags: string[];
  isActive: true;
  createdAt: string;
  updatedAt: string;
  cityId: string | null;
  user: PostAuthor;
  collaborators: PostCollaborator[];
  media: PostMedia[];
  reactionCount: number;
  commentCount: number;
};

export type GetBodiesResponse = {
  status: string;
  message: string;
  data: {
    bodies: CollaboratorBody[];
    totalCount: number;
    totalPages: number;
  };
};

export type CollaboratorBody = {
  id: string;
  email: string;
  mobile: string;
  profilePicture: string;
  fullName: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  cityId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface PostData {
  author: Author | null;
  postContent: string;
  postCategory: PostCategory;
  postTags?: string[];
  postImageUrls?: string[];
  postVideoUrls?: string[];
  createdAt: string;
  collaborators?: Author[];
}

export interface Author {
  id: string;
  email: string;
  mobile: string | null;
  profilePicture: string | null;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  cityId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
