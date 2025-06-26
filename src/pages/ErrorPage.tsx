// src/pages/ErrorPage.tsx
import { useRouter, type ErrorComponentProps } from '@tanstack/react-router';

export default function ErrorPage({ error }: ErrorComponentProps) {
    const router = useRouter();

    const handleRetry = () => {
        router.invalidate();
    };

    const handleGoHome = () => {
        router.navigate({ to: '/' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
                <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>

                <p className="text-gray-600 mb-6">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleRetry}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}