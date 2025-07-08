// src/services/apiService.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// import { AuthService, authService } from "./authService";

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private hasTriedRefresh = false;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        // Authorization header will be set dynamically
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to set Authorization header from localStorage
    this.api.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          config.headers = config.headers || {};
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        } else {
          if (config.headers && config.headers["Authorization"]) {
            delete config.headers["Authorization"];
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // Handle 401 errors - try refresh once only
        if (status === 401 && !originalRequest._retry && !this.isRefreshing) {
          originalRequest._retry = true;

          // If we already tried refresh in this session, go to login
          if (this.hasTriedRefresh) {
            this.redirectToLogin();
            return Promise.reject(error);
          }

          this.isRefreshing = true;
          this.hasTriedRefresh = true;

          try {
            // Only try refresh if the failed request wasn't already a refresh request
            if (!originalRequest.url?.includes("/auth/refresh-token")) {
              await this.refreshTokenRequest();
              this.isRefreshing = false;
              // Retry the original request
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.isRefreshing = false;
            this.redirectToLogin();
            return Promise.reject(refreshError);
          }
        }

        // For refresh token endpoint specifically - if it fails, go to login
        if (
          originalRequest.url?.includes("/auth/refresh-token") &&
          (status === 400 || status === 401)
        ) {
          this.redirectToLogin();
          return Promise.reject(error);
        }

        // Handle other errors
        const message =
          error.response?.data?.message || error.message || "An error occurred";
        throw new Error(message);
      }
    );
  }

  private async refreshTokenRequest(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await this.api.post("/auth/refresh-token", { refreshToken });
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }

  private redirectToLogin() {
    // Only redirect if not already on auth page
    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth";
    }
  }

  // Reset flags on successful login
  resetFlags() {
    this.hasTriedRefresh = false;
    this.isRefreshing = false;
  }

  // Generic request methods
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }
}

export const apiService = new ApiService();
