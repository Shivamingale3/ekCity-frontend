import React from 'react';
import { type ErrorComponentProps } from '@tanstack/react-router';
import { GenericErrorPage } from './GenericErrorPage';

const ErrorPage: React.FC<ErrorComponentProps> = ({ error }) => {
    console.error('Route Error:', error);

    return <GenericErrorPage error={error} />;
};

export default ErrorPage;