import React from 'react';
import { BaseErrorPage } from './BaseErrorPage';

export const ServerErrorPage: React.FC = () => (
    <BaseErrorPage
        statusCode={500}
        title="Server Error"
        message="Something went wrong on our end. We're working to fix the issue. Please try again later."
        variant="danger"
        icon="⚠️"
    />
);