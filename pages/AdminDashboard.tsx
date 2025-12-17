import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');

  // Si no hay usuario, redirigir (aunque el PrivateRoute ya protege esto)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold">Panel Admin</h1>
          <p className="text-xs text-gray-400 mt-1">
            {isSuperAdmin ? 'SUPER ADMINISTRADOR' : `Admin de Localidad #${user.locationId}`}
          </p>
        </div>
        <nav className="mt-6">
          <button onClick={() => setActiveTab('resumen')} className={`w-full text-left py-3 px-6 hover:bg-gray-700 ${activeTab === 'resumen' ? 'bg-gray-700' : ''}`}>
            <i className="fas fa-home mr-2"></i> Resumen
          </button>
          
          {/* Opciones Exclusivas SUPERADMIN */}
          {isSuperAdmin && (
            <>
              <button onClick={() => setActiveTab('localidades')} className={`w-full text-left py-3 px-6 hover:bg-gray-700 ${activeTab === 'localidades' ? 'bg-gray-700' : ''}`}>
                <i className="fas fa-map-marked-alt mr-2"></i> Localidades
              </button>
              <button onClick={() => setActiveTab('usuarios')} className={`w-full text-left py-3 px-6 hover:bg-gray-700 ${activeTab === 'usuarios' ? 'bg-gray-700' : ''}`}>
                <i className="fas fa-users-cog mr-2"></i> Usuarios y Admins
              </button>
            </>
          )}

          {/* Opciones Comunes (Gestionar Contenido) */}
          <button onClick={() => setActiveTab('atracciones')} className={`w-full text-left py-3 px-6 hover:bg-gray-700 ${activeTab === 'atracciones' ? 'bg-gray-700' : ''}`}>
            <i className="fas fa-umbrella-beach mr-2"></i> Atracciones
          </button>
          <button onClick={() => setActiveTab('actividades')} className={`w-full text-left py-3 px-6 hover:bg-gray-700 ${activeTab === 'actividades' ? 'bg-gray-700' : ''}`}>
             <i className="fas fa-hiking mr-2"></i> Actividades
          </button>

          <button onClick={logout} className="w-full text-left py-3 px-6 hover:bg-red-600 mt-10 text-red-300 hover:text-white">
            <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Móvil y Bienvenida */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-600">Hola, {user.name}</span>
                <button onClick={() => navigate('/')} className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-50">
                    Ver Sitio Web
                </button>
            </div>
        </div>

        {/* CONTENIDO DINÁMICO SEGÚN TAB */}
        <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
            
            {activeTab === 'resumen' && (
                <div>
                    <p>Bienvenido al panel de control. Selecciona una opción del menú para comenzar.</p>
                    {!isSuperAdmin && (
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded">
                            Estás gestionando contenido para la localidad ID: <strong>{user.locationId}</strong>.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'localidades' && isSuperAdmin && (
                <div>
                    <h3 className="text-lg font-bold mb-4">Gestión de Localidades</h3>
                    <p className="text-gray-500 mb-4">Aquí podrás crear nuevas localidades (slugs) y asignar su configuración base.</p>
                    {/* AQUÍ IRÁ TU TABLA DE LOCALIDADES Y FORMULARIO DE CREACIÓN */}
                    <button className="bg-green-600 text-white px-4 py-2 rounded">
                        + Nueva Localidad
                    </button>
                </div>
            )}

             {activeTab === 'usuarios' && isSuperAdmin && (
                <div>
                    <h3 className="text-lg font-bold mb-4">Gestión de Usuarios</h3>
                    <p className="text-gray-500 mb-4">Designa administradores para las localidades existentes.</p>
                     {/* AQUÍ IRÁ LA LISTA DE USUARIOS Y ASIGNACIÓN DE ROLES */}
                </div>
            )}

            {(activeTab === 'atracciones' || activeTab === 'actividades') && (
                <div>
                    <h3 className="text-lg font-bold mb-4">Gestión de {activeTab}</h3>
                    <p className="text-gray-500">
                        {isSuperAdmin 
                            ? "Como SuperAdmin, selecciona primero la localidad que quieres editar."
                            : "Añade, edita o elimina contenido de tu localidad."}
                    </p>
                    <button className="bg-cyan-600 text-white px-4 py-2 rounded mt-4">
                        + Agregar Nuevo
                    </button>
                </div>
            )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;