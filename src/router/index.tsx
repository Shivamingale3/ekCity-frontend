import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';
import React from 'react';

import AuthLayout from '@/layouts/AuthLayout';
import ProfileLayout from '@/layouts/ProfileLayout';
import RootLayout from '@/layouts/RootLayout';
import Feed from '@/pages/Feed';

import { AuthGuard } from '@/components/AuthGuard';
import ErrorPage from '@/pages/ErrorPages/ErrorPage';
import { ForbiddenPage } from '@/pages/ErrorPages/ForbiddenPage';
import { NotFoundPage } from '@/pages/ErrorPages/NotFoundPage';
import { ServerErrorPage } from '@/pages/ErrorPages/ServerErrorPage';
import { UnauthorizedPage } from '@/pages/ErrorPages/UnauthorizedPage';
import { useAuthStore } from '@/stores/authStore';
import { AuthStatus } from '@/types/authTypes';

// Root route
const rootRoute = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorPage,
    notFoundComponent: NotFoundPage,
});

// Auth (public) route
const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/auth',
    beforeLoad: async () => {
        const { status } = useAuthStore.getState();
        if (status === AuthStatus.AUTHENTICATED) {
            throw redirect({ to: '/feed' });
        }
    },
    component: () => (
        <AuthGuard requireAuth={false}>
            <AuthLayout />
        </AuthGuard>
    ),
    errorComponent: ErrorPage,
});

// Index route with conditional redirect
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: async () => {
        const { status, verifyUser } = useAuthStore.getState();
        if (status === AuthStatus.IDLE) {
            try {
                await verifyUser();
            } catch (error) {
                throw redirect({ to: '/auth', replace: true });
            }
        }

        const currentStatus = useAuthStore.getState().status;
        const destination = currentStatus === AuthStatus.AUTHENTICATED ? '/feed' : '/auth';
        throw redirect({ to: destination });
    },
});

// Enhanced protected route generator with specific error handling
export const createProtectedRoute = (
    path: string,
    component: React.ComponentType,
    options?: {
        errorComponent?: React.ComponentType<any>;
        requireSpecificRole?: string;
    }
) => {
    return createRoute({
        getParentRoute: () => rootRoute,
        path,
        beforeLoad: async () => {
            const { status, verifyUser } = useAuthStore.getState();

            if (status === AuthStatus.IDLE || status === AuthStatus.UNAUTHENTICATED) {
                try {
                    await verifyUser();
                } catch {
                    throw redirect({ to: '/auth' });
                }
            }

            const currentStatus = useAuthStore.getState().status;
            if (currentStatus !== AuthStatus.AUTHENTICATED) {
                throw redirect({ to: '/auth' });
            }

            // Additional role-based checks if needed
            if (options?.requireSpecificRole) {
                // Implement role checking logic here
                throw new Error('Insufficient privileges')
            }
        },
        component: () => (
            <AuthGuard requireAuth={true}>
                {React.createElement(component)}
            </AuthGuard>
        ),
        errorComponent: (options?.errorComponent as React.FC<any>) || ErrorPage,
    });
};

// Specific error routes (optional - for direct access)
const notFoundRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/404',
    component: NotFoundPage,
});

const unauthorizedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/401',
    component: UnauthorizedPage,
});

const forbiddenRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/403',
    component: ForbiddenPage,
});

const serverErrorRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/500',
    component: ServerErrorPage,
});

// Protected routes with specific error handling
const feedRoute = createProtectedRoute('/feed', Feed);
const profileRoute = createProtectedRoute('/profile', ProfileLayout, {
    errorComponent: ForbiddenPage // Custom error page for profile
});

// Route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    authRoute,
    feedRoute,
    profileRoute,
    // Error routes
    notFoundRoute,
    unauthorizedRoute,
    forbiddenRoute,
    serverErrorRoute,
]);

// Router
export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: ErrorPage,
    defaultNotFoundComponent: NotFoundPage,
});

// Export error pages for manual navigation
export {
    ForbiddenPage, NotFoundPage, ServerErrorPage, UnauthorizedPage
};
