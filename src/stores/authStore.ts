// src/stores/authStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authService } from "../services/authService";
import { router } from "../router";
import {
  AuthStatus,
  type AuthState,
  type LoginCredentials,
  type RegisterCredentials,
  type User,
} from "../types/authTypes";

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  ssoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  verifyUser: () => Promise<void>;
  setUser: (user: User) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  status: AuthStatus.IDLE,
  error: null,
  isLoading: false,
  isAuthLoading: false,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.data.user,
            status: AuthStatus.AUTHENTICATED,
            isLoading: false,
            error: null,
          });

          // Navigate to feed using router
          router.navigate({ to: "/feed" });
        } catch (error: any) {
          set({
            error: error.message || "Login failed",
            status: AuthStatus.ERROR,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(credentials);
          set({
            user: response.data.user,
            status: AuthStatus.AUTHENTICATED,
            isLoading: false,
            error: null,
          });

          // Navigate to feed using router
          router.navigate({ to: "/feed" });
        } catch (error: any) {
          set({
            error: error.message || "Registration failed",
            status: AuthStatus.ERROR,
            isLoading: false,
          });
          throw error;
        }
      },

      ssoLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.ssoLogin();
          set({
            user: response.data.user,
            status: AuthStatus.AUTHENTICATED,
            isLoading: false,
            error: null,
          });

          // Navigate to feed using router
          router.navigate({ to: "/feed" });
        } catch (error: any) {
          set({
            error: error.message || "SSO login failed",
            status: AuthStatus.ERROR,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (error) {
          // Continue with logout even if server call fails
          console.error("Logout error:", error);
        } finally {
          // Always clear local state
          set({
            ...initialState,
            status: AuthStatus.UNAUTHENTICATED,
          });

          // Navigate to auth page using router
          router.navigate({ to: "/auth" });
        }
      },

      verifyUser: async () => {
        // Prevent multiple concurrent verifications
        const currentState = get();
        if (currentState.isAuthLoading) {
          return;
        }

        set({ isAuthLoading: true, error: null });
        try {
          const user = await authService.verifyUser();
          set({
            user,
            status: AuthStatus.AUTHENTICATED,
            isAuthLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            status: AuthStatus.UNAUTHENTICATED,
            isAuthLoading: false,
            // Don't set error for verification failures to avoid UI noise
          });
          throw error; // Let the caller handle the error
        }
      },

      setUser: (user: User) => set({ user }),
      setStatus: (status: AuthStatus) => set({ status }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: "auth-store",
    }
  )
);
