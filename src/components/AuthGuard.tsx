// src/components/AuthGuard.tsx
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { AuthStatus } from '../types/authTypes';
import LoadingScreen from './root/LoadingScreen';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    requireAuth = true
}) => {
    const { status, isAuthLoading, verifyUser } = useAuthStore();

    useEffect(() => {
        // Only verify if we're in idle state
        if (status === AuthStatus.IDLE) {
            verifyUser();
        }
    }, [status, verifyUser]);

    // Show loading while checking auth status
    if (isAuthLoading || status === AuthStatus.LOADING) {
        return <LoadingScreen />;
    }

    // For protected routes
    if (requireAuth && status !== AuthStatus.AUTHENTICATED) {
        return null; // Router will handle redirect
    }

    // For public routes (like /auth)
    if (!requireAuth && status === AuthStatus.AUTHENTICATED) {
        return null; // Router will handle redirect
    }

    return <>{children}</>;
};