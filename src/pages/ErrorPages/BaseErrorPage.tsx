import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { AuthStatus } from '@/types/authTypes';

interface BaseErrorPageProps {
    title: string;
    message: string;
    statusCode?: number;
    showRedirect?: boolean;
    customRedirectPath?: string;
    customRedirectDelay?: number;
    icon?: React.ReactNode;
    variant?: 'default' | 'warning' | 'danger' | 'info';
}

export const BaseErrorPage: React.FC<BaseErrorPageProps> = ({
    title,
    message,
    statusCode,
    showRedirect = true,
    customRedirectPath,
    customRedirectDelay = 5,
    icon,
    variant = 'default'
}) => {
    const [countdown, setCountdown] = useState(customRedirectDelay);
    const { status } = useAuthStore();

    // Determine redirect path based on auth status
    const getRedirectPath = () => {
        if (customRedirectPath) return customRedirectPath;
        return status === AuthStatus.AUTHENTICATED ? '/feed' : '/auth';
    };

    const redirectPath = getRedirectPath();

    useEffect(() => {
        if (!showRedirect) return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    window.location.href = redirectPath;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showRedirect, redirectPath]);

    const getVariantStyles = () => {
        switch (variant) {
            case 'warning':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
                    border: 'border-amber-200',
                    icon: 'text-amber-500',
                    button: 'bg-amber-500 hover:bg-amber-600'
                };
            case 'danger':
                return {
                    bg: 'bg-gradient-to-br from-red-50 to-pink-100',
                    border: 'border-red-200',
                    icon: 'text-red-500',
                    button: 'bg-red-500 hover:bg-red-600'
                };
            case 'info':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
                    border: 'border-blue-200',
                    icon: 'text-blue-500',
                    button: 'bg-blue-500 hover:bg-blue-600'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
                    border: 'border-gray-200',
                    icon: 'text-gray-500',
                    button: 'bg-gray-500 hover:bg-gray-600'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 ${styles.bg}`}>
            <div className={`max-w-md w-full bg-white rounded-2xl shadow-xl border ${styles.border} p-8 text-center`}>
                {/* Status Code */}
                {statusCode && (
                    <div className="mb-4">
                        <span className={`text-6xl font-bold ${styles.icon} opacity-20`}>
                            {statusCode}
                        </span>
                    </div>
                )}

                {/* Icon */}
                {icon && (
                    <div className={`text-5xl mb-6 ${styles.icon}`}>
                        {icon}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {title}
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/"
                        className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white ${styles.button} transition-colors duration-200 transform hover:scale-105`}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>

                {/* Countdown */}
                {showRedirect && countdown > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Redirecting to {status === AuthStatus.AUTHENTICATED ? 'feed' : 'login'} in{' '}
                            <span className={`font-bold ${styles.icon}`}>{countdown}</span> seconds
                        </p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                            <div
                                className={`h-1 rounded-full transition-all duration-1000 ease-linear ${styles.button.replace('hover:bg-', 'bg-').split(' ')[0]}`}
                                style={{ width: `${((customRedirectDelay - countdown) / customRedirectDelay) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
