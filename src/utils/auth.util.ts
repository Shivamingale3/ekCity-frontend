// src/utils/auth.utils.ts

import { UserRole, type User } from "@/types/authTypes";

// Cookie utility functions
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Token utility functions
export const getAccessToken = (): string | null => {
  return getCookie("token");
};

export const getRefreshToken = (): string | null => {
  return getCookie("refreshToken");
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

// User utility functions
export const getUserDisplayName = (user: User): string => {
  if (user?.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user?.firstName) {
    return user?.firstName;
  }
  if (user?.lastName) {
    return user?.lastName;
  }
  return user?.email ?? "";
};

export const getUserInitials = (user: User): string => {
  const displayName = getUserDisplayName(user);
  const names = displayName.split(" ");
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return displayName[0]?.toUpperCase() || "U";
};

// Role utility functions
export const hasRole = (user: User, role: UserRole): boolean => {
  return user?.role === role;
};

export const hasAnyRole = (user: User, roles: UserRole[]): boolean => {
  return !!user && roles.includes(user.role);
};

export const isAdmin = (user: User): boolean => {
  return hasRole(user, UserRole.ADMIN);
};

export const isCitizen = (user: User): boolean => {
  return hasRole(user, UserRole.CITIZEN);
};

export const isGovernment = (user: User): boolean => {
  return hasRole(user, UserRole.GOVERNMENT);
};

export const isPrivate = (user: User): boolean => {
  return hasRole(user, UserRole.PRIVATE);
};

// Permission utility functions (for future role-based access control)
export const canAccessAdminPanel = (user: User): boolean => {
  return isAdmin(user);
};

export const canCreatePost = (_user: User): boolean => {
  // All authenticated users can create posts
  return true;
};

export const canModerateContent = (user: User): boolean => {
  return isAdmin(user) || isGovernment(user);
};

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex =
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
  return mobileRegex.test(mobile);
};

// Storage utilities
export const clearAuthStorage = (): void => {
  deleteCookie("token");
  deleteCookie("refreshToken");
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
};

// Route utilities
export const isAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith("/auth");
};

export const isProtectedRoute = (pathname: string): boolean => {
  return !isAuthRoute(pathname);
};

// Error handling utilities
export const getAuthErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  // Firebase auth error codes
  switch (error?.code) {
    case "auth/user-not-found":
      return "No account found with this email address";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "An account with this email already exists";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/popup-blocked":
      return "Popup was blocked by browser. Please allow popups and try again";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    default:
      return "An unexpected error occurred. Please try again";
  }
};
