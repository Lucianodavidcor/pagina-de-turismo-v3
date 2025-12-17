import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <--- Importante
import PrivateRoute from './components/PrivateRoute'; // <--- Importante

import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
// import RegisterPage from './pages/RegisterPage'; // Crea una similar a LoginPage

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<div>Página de Registro (Pendiente)</div>} />
                <Route path="/:location" element={<LocationPage />} />

                {/* Rutas Privadas (Solo Admins y SuperAdmins) */}
                <Route element={<PrivateRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;