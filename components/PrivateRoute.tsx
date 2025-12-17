import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  roles?: ('ADMIN' | 'SUPERADMIN')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role as any)) {
    // Si está logueado pero no tiene el rol, al home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;