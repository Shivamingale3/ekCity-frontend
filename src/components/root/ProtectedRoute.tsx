// src/components/auth/ProtectedRoute.tsx
import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "@tanstack/react-router";
import React from "react";
import { AuthStatus, type UserRole } from "../../types/authTypes";
import LoadingScreen from "./LoadingScreen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole; // Optional role-based protection
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  //   requiredRole,
  fallbackPath = "/auth",
}) => {
  const { user, isLoading, status } = useAuthStore();
  // const location = useLocation();

  // Show loading screen while checking authentication
  if (status === AuthStatus.LOADING || isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (status === AuthStatus.UNAUTHENTICATED || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Role-based protection (commented out for future use)
  /*
  if (requiredRole && state.user.role !== requiredRole) {
    // You can customize this behavior based on your needs
    return <Navigate to="/unauthorized" replace />;
  }
  */

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;

// HOC for role-based protection (commented out for future use)
/*
export const withRoleProtection = (
  WrappedComponent: React.ComponentType<any>,
  requiredRole: UserRole
) => {
  return (props: any) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );
};

// Usage examples:
// const AdminOnlyComponent = withRoleProtection(SomeComponent, UserRole.ADMIN);
// const GovernmentOnlyComponent = withRoleProtection(SomeComponent, UserRole.GOVERNMENT);
*/
