import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Importamos el AuthProvider
import PrivateRoute from './components/PrivateRoute'; // Importamos la Ruta Privada

import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
// import RegisterPage from './pages/RegisterPage'; // Pendiente

const App: React.FC = () => {
  return (
    // 1. Envolvemos la app en el AuthProvider
    <AuthProvider>
        <HashRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage />} /> {/* Placeholder, usa Login por ahora */}
                <Route path="/:location" element={<LocationPage />} />

                {/* Rutas Privadas (Protegidas) */}
                <Route element={<PrivateRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;