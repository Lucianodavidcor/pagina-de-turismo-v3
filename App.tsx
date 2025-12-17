// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // YA NO importamos HashRouter
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ActivitiesPage from './pages/ActivitiesPage';
import ForumPage from './pages/ForumPage';

const App: React.FC = () => {
  return (
    // AuthProvider ahora es hijo del Router (que está en index.tsx), 
    // por lo tanto puede usar la navegación.
    <AuthProvider>
        <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/actividades" element={<ActivitiesPage />} />
            <Route path="/foro" element={<ForumPage />} />

            {/* Rutas de Usuario Logueado */}
            <Route element={<PrivateRoute />}>
                <Route path="/perfil" element={<UserDashboard />} />
            </Route>

            {/* Rutas de Admin */}
            <Route element={<PrivateRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Ruta Dinámica */}
            <Route path="/:location" element={<LocationPage />} />
        </Routes>
    </AuthProvider>
  );
};

export default App;