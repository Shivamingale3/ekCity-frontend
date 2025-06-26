import React from 'react';
import { BaseErrorPage } from './BaseErrorPage';

interface GenericErrorPageProps {
    error?: Error;
    statusCode?: number;
    title?: string;
    message?: string;
}

export const GenericErrorPage: React.FC<GenericErrorPageProps> = ({
    error,
    statusCode,
    title,
    message
}) => {
    const getErrorDetails = () => {
        if (title && message) {
            return { title, message };
        }

        if (error?.message.includes('404') || statusCode === 404) {
            return {
                title: "Page Not Found",
                message: "The page you're looking for doesn't exist."
            };
        }

        if (error?.message.includes('401') || statusCode === 401) {
            return {
                title: "Authentication Required",
                message: "Please log in to access this page."
            };
        }

        if (error?.message.includes('403') || statusCode === 403) {
            return {
                title: "Access Forbidden",
                message: "You don't have permission to access this resource."
            };
        }

        return {
            title: "Something went wrong",
            message: error?.message || "An unexpected error occurred. Please try again."
        };
    };

    const { title: errorTitle, message: errorMessage } = getErrorDetails();

    return (
        <BaseErrorPage
            statusCode={statusCode}
            title={errorTitle}
            message={errorMessage}
            variant="default"
            icon="❌"
        />
    );
};
