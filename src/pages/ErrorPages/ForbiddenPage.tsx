// src/components/ErrorPages/ForbiddenPage.tsx
import React from 'react';
import { BaseErrorPage } from './BaseErrorPage';

export const ForbiddenPage: React.FC = () => (
    <BaseErrorPage
        statusCode={403}
        title="Forbidden"
        message="You don't have sufficient privileges to access this resource. Contact your administrator if you believe this is an error."
        variant="danger"
        icon="⛔"
    />
);