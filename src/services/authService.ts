// src/services/authService.ts
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  SSOLoginPayload,
  User,
} from "../types/authTypes";
import { apiService } from "./apiService";
import { auth } from "@/config/firebase";

export class AuthService {
  private auth = auth;
  private googleProvider = new GoogleAuthProvider();

  constructor() {
    // Configure Google provider
    this.googleProvider.addScope("email");
    this.googleProvider.addScope("profile");

    // Set persistence - change to browserSessionPersistence for session-only
    // this.setPersistence(browserSessionPersistence); // Session only
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      // Reset flags on successful login
      apiService.resetFlags();
      this.setTokens(response.data.data.tokens);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const formData = new FormData();

      Object.entries(credentials).forEach(([key, value]: [string, any]) => {
        if (key === "profilePicture") {
          if (value instanceof File) {
            formData.append("profilePicture", value);
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiService.post<AuthResponse>(
        "/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset flags on successful registration
      apiService.resetFlags();
      this.setTokens(response.data.data.tokens);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }

  async ssoLogin(): Promise<AuthResponse> {
    try {
      let result;

      try {
        // Try popup first
        result = await signInWithPopup(this.auth, this.googleProvider);
      } catch (popupError: any) {
        if (
          popupError.code === "auth/popup-blocked" ||
          popupError.code === "auth/popup-closed-by-user"
        ) {
          // Fallback to redirect
          await signInWithRedirect(this.auth, this.googleProvider);
          return {} as AuthResponse; // This will be handled by the redirect flow
        }
        throw popupError;
      }

      // Get Firebase token
      const firebaseIdToken = await result.user.getIdToken();

      // Send to backend
      const payload: SSOLoginPayload = {
        firebaseIdToken: firebaseIdToken,
      };

      const response = await apiService.post<AuthResponse>(
        "/auth/sso-login",
        payload
      );
      this.setTokens(response.data.data.tokens);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || "SSO login failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
      // Reset flags on logout
      apiService.resetFlags();
    } catch (error: any) {
      // Still reset flags even if logout fails
      apiService.resetFlags();
      console.error("Logout error:", error);
    }
  }

  async verifyUser(): Promise<User> {
    try {
      const response = await apiService.get<{
        data: User;
        message: string;
        status: string;
      }>("/users/verify");
      return response.data.data;
    } catch (error: any) {
      // Don't throw error here - let the caller handle it
      // This prevents loops in verification
      throw new Error(error.message || "Unable to verify user");
    }
  }

  // Remove this method as refresh is handled by interceptor
  // async refreshToken(): Promise<AuthResponse> {
  //   This is now handled internally by apiService interceptor
  // }

  public setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  public getTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  }
}

export const authService = new AuthService();
