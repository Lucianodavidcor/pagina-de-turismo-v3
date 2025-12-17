import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  roles?: ('ADMIN' | 'SUPERADMIN')[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  // Si no hay usuario logueado, al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles requeridos y el usuario no los tiene, al home
  if (roles && !roles.includes(user.role as any)) {
    return <Navigate to="/" replace />;
  }

  // Si todo ok, renderiza la ruta hija
  return <Outlet />;
};

export default PrivateRoute;