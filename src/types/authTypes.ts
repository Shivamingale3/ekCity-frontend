// src/types/authTypes.ts
import { z } from "zod";
import type { registerSchema } from "../validation/authValidation";

export enum UserRole {
  ADMIN = "ADMIN",
  CITIZEN = "CITIZEN",
  GOVERNMENT = "GOVERNMENT",
  PRIVATE = "PRIVATE",
}

export enum AuthStatus {
  IDLE = "idle",
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  ERROR = "error",
}

export type User = {
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
} | null;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  status: string;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
};

export type AuthState = {
  user: User;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  isAuthLoading: boolean; // Add this new property
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  role?: UserRole;
};

export type SSOLoginPayload = {
  firebaseIdToken: string;
};

export type ApiError = {
  status: number;
  message: string;
  errors?: any;
};

export enum ApiErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  SERVER_ERROR = 500,
  NETWORK_ERROR = 0,
}

export type RefreshTokenPayload = {
  refreshToken: string;
};

export type RegisterFormValues = z.infer<typeof registerSchema>;
