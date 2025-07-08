// src/components/ErrorPages/NotFoundPage.tsx
import React from 'react';
import { BaseErrorPage } from './BaseErrorPage';

export const NotFoundPage: React.FC = () => (
    <BaseErrorPage
        statusCode={404}
        title="Page Not Found"
        message="Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL."
        variant="info"
        icon="🔍"
    />
);