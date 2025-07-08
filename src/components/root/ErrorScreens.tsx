// src/components/auth/ErrorScreens.tsx
import { useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

interface ErrorScreenProps {
  title: string;
  message: string;
  redirectPath: string;
  redirectDelay?: number;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title,
  message,
  redirectPath,
  redirectDelay = 5000,
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000));

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect timer
    const redirectTimer = setTimeout(() => {
      navigate({ to: redirectPath, replace: true });
    }, redirectDelay);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [navigate, redirectPath, redirectDelay]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Error icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">{message}</p>

          {/* Countdown */}
          <div className="text-sm text-gray-500">
            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
          </div>

          {/* Manual redirect button */}
          <button
            onClick={() => navigate({ to: redirectPath, replace: true })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Go Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Specific error components
export const UnauthorizedScreen: React.FC = () => (
  <ErrorScreen
    title="Access Denied"
    message="You don't have permission to access this page. Please log in with appropriate credentials."
    redirectPath="/auth"
    redirectDelay={5000}
  />
);

export const ForbiddenScreen: React.FC = () => (
  <ErrorScreen
    title="Forbidden"
    message="You don't have sufficient permissions to access this resource."
    redirectPath="/"
    redirectDelay={5000}
  />
);

export const ServerErrorScreen: React.FC = () => (
  <ErrorScreen
    title="Server Error"
    message="Something went wrong on our end. Please try again later."
    redirectPath="/"
    redirectDelay={5000}
  />
);

export const NetworkErrorScreen: React.FC = () => (
  <ErrorScreen
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection."
    redirectPath="/"
    redirectDelay={5000}
  />
);

export const NotFoundErrorScreen: React.FC = () => (
  <ErrorScreen
    title="Not Found"
    message="The page you are trying to reach was not found"
    redirectPath="/"
    redirectDelay={5000}
  />
)

export default ErrorScreen;
