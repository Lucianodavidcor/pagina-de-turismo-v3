import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <--- Nueva
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'; // <--- Nueva
import ActivitiesPage from './pages/ActivitiesPage';
import ForumPage from './pages/ForumPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/actividades" element={<ActivitiesPage />} />
                <Route path="/foro" element={<ForumPage />} />

                {/* Rutas de Usuario Logueado (Cualquiera) */}
                <Route element={<PrivateRoute />}> {/* PrivateRoute sin roles deja pasar a cualquier usuario logueado */}
                    <Route path="/perfil" element={<UserDashboard />} />
                </Route>

                {/* Rutas de Admin */}
                <Route element={<PrivateRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Ruta Dinámica (Catch-all) */}
                <Route path="/:location" element={<LocationPage />} />
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;