// src/router/index.tsx
import React from 'react';
import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router';

import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProfileLayout from '@/layouts/ProfileLayout';
import Feed from '@/pages/Feed';
import ErrorPage from '@/pages/ErrorPage';

import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore } from '@/stores/authStore';
import { AuthStatus } from '@/types/authTypes';

// Root route
const rootRoute = createRootRoute({
    component: RootLayout,
    errorComponent: ErrorPage,
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
                throw redirect({ to: '/auth' });
            }
        }

        const currentStatus = useAuthStore.getState().status;
        const destination = currentStatus === AuthStatus.AUTHENTICATED ? '/feed' : '/auth';
        throw redirect({ to: destination });
    },
});

// Reusable protected route generator
export const createProtectedRoute = (path: string, component: React.ComponentType) => {
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
        },
        component: () => (
            <AuthGuard requireAuth={true}>
                {React.createElement(component)}
            </AuthGuard>
        ),
        errorComponent: ErrorPage,
    });
};
// Protected routes
const feedRoute = createProtectedRoute('/feed', Feed);
const profileRoute = createProtectedRoute('/profile', ProfileLayout);
// Route tree
const routeTree = rootRoute.addChildren([
    indexRoute,
    authRoute,
    feedRoute,
    profileRoute,
]);

// Router
export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
});
