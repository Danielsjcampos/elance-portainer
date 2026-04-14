import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from './AccessDenied';

interface RequirePermissionProps {
    permissionKey: string;
    children: React.ReactNode;
}

const RequirePermission: React.FC<RequirePermissionProps> = ({ permissionKey, children }) => {
    const { profile, isAdmin, loading } = useAuth();

    // While loading, don't show anything that might block the UI
    if (loading) return null;

    // Admins always have access
    if (isAdmin) return <>{children}</>;

    // Check granular permissions
    // If the permission is explicitly set to false, deny access
    if (profile?.permissions && profile.permissions[permissionKey] === false) {
        return <AccessDenied />;
    }

    return <>{children}</>;
};

export default RequirePermission;
