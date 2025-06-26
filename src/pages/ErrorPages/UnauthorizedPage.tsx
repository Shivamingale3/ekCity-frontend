// src/components/ErrorPages/UnauthorizedPage.tsx
import React from 'react';
import { BaseErrorPage } from './BaseErrorPage';

export const UnauthorizedPage: React.FC = () => (
    <BaseErrorPage
        statusCode={401}
        title="Access Denied"
        message="You don't have permission to access this page. Please log in with appropriate credentials."
        variant="warning"
        customRedirectPath="/auth"
        icon="🔒"
    />
);