import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ActivitiesPage from './pages/ActivitiesPage'; // <--- Importamos Actividades
import ForumPage from './pages/ForumPage';           // <--- Importamos Foro

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
            <Routes>
                {/* 1. Rutas Estáticas Públicas (Prioridad Alta) */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<LoginPage />} />
                
                {/* Estas rutas deben ir ANTES de /:location para que no se confundan con una localidad */}
                <Route path="/actividades" element={<ActivitiesPage />} />
                <Route path="/foro" element={<ForumPage />} />

                {/* 2. Rutas Privadas (Protegidas) */}
                <Route element={<PrivateRoute roles={['ADMIN', 'SUPERADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* 3. Ruta Dinámica (Prioridad Baja - "Catch-all" para localidades) */}
                {/* Cualquier ruta no definida arriba caerá aquí (ej: /chos-malal, /buta-ranquil) */}
                <Route path="/:location" element={<LocationPage />} />
            </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;