import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllLocations } from '../services/locations';
import { getAllUsers, registerAdmin } from '../services/auth';
import type { LocationData, User } from '../types';
import api from '../lib/axios';

const AdminDashboard: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Estados para datos
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Estados para formulario de Nuevo Admin
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', location_id: 0 });
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'localidades' || activeTab === 'usuarios') {
        loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoadingData(true);
    try {
        const locs = await getAllLocations();
        setLocations(locs);
        if (isSuperAdmin) {
            const usrs = await getAllUsers();
            setUsers(usrs);
        }
    } catch (error) {
        console.error("Error cargando datos", error);
    } finally {
        setLoadingData(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
        await registerAdmin(newAdmin);
        setMsg({ type: 'success', text: '¡Administrador creado con éxito!' });
        setNewAdmin({ name: '', email: '', password: '', location_id: 0 }); // Reset
        loadData(); // Recargar lista
    } catch (error: any) {
        setMsg({ type: 'error', text: error.response?.data?.message || 'Error al crear admin' });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-cyan-400">Panel Admin</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            {isSuperAdmin ? 'Super Administrador' : 'Administrador Local'}
          </p>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <MenuButton icon="home" label="Resumen" active={activeTab === 'resumen'} onClick={() => setActiveTab('resumen')} />
          
          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Administración Global</div>
              <MenuButton icon="map-marked-alt" label="Localidades" active={activeTab === 'localidades'} onClick={() => setActiveTab('localidades')} />
              <MenuButton icon="users-cog" label="Usuarios y Admins" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} />
            </>
          )}

          <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Contenido</div>
          <MenuButton icon="umbrella-beach" label="Atracciones" active={activeTab === 'atracciones'} onClick={() => setActiveTab('atracciones')} />
          <MenuButton icon="hiking" label="Actividades" active={activeTab === 'actividades'} onClick={() => setActiveTab('actividades')} />
          <MenuButton icon="images" label="Galería" active={activeTab === 'galeria'} onClick={() => setActiveTab('galeria')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition w-full px-2 py-2 rounded hover:bg-slate-800">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Mobile/Desktop */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">Hola, <strong>{user.name}</strong></span>
                <button onClick={() => navigate('/')} className="text-sm bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded border border-cyan-100 hover:bg-cyan-100 transition">
                    Ver Sitio Web <i className="fas fa-external-link-alt ml-1"></i>
                </button>
            </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* VISTA RESUMEN */}
            {activeTab === 'resumen' && (
                <div className="max-w-4xl">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">¡Bienvenido al Panel de Control!</h3>
                        <p className="text-gray-600">Desde aquí puedes gestionar todo el contenido de la plataforma.</p>
                        
                        {!isSuperAdmin && (
                             <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded text-blue-800 flex items-start gap-3">
                                <i className="fas fa-info-circle mt-1"></i>
                                <div>
                                    <p className="font-bold">Tu Rol: Administrador de Localidad</p>
                                    <p className="text-sm">Solo puedes editar el contenido perteneciente a la localidad ID: <strong>{user.locationId}</strong>.</p>
                                </div>
                             </div>
                        )}
                    </div>
                </div>
            )}

            {/* VISTA USUARIOS (SOLO SUPERADMIN) */}
            {activeTab === 'usuarios' && isSuperAdmin && (
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Lista de Usuarios */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Usuarios Registrados</div>
                        <div className="overflow-y-auto max-h-[500px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Nombre</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Rol</th>
                                        <th className="px-6 py-3">Loc. ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    u.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                                                    u.role === 'ADMIN' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">{u.locationId || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Formulario Crear Admin */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-fit">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Crear Nuevo Administrador</h3>
                        <p className="text-sm text-gray-500 mb-4">Crea una cuenta con rol ADMIN y asígnala a una localidad específica.</p>
                        
                        {msg.text && (
                            <div className={`p-3 rounded mb-4 text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {msg.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required 
                                    value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required 
                                    value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" required 
                                    value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Asignar a Localidad</label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" required
                                    value={newAdmin.location_id} onChange={e => setNewAdmin({...newAdmin, location_id: Number(e.target.value)})}>
                                    <option value={0}>Selecciona una localidad...</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name} (ID: {loc.id})</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition">
                                Crear Administrador
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* VISTA LOCALIDADES (SOLO SUPERADMIN - Placeholder funcional) */}
            {activeTab === 'localidades' && isSuperAdmin && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Localidades Activas</h3>
                        <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">+ Nueva Localidad</button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {locations.map(loc => (
                            <div key={loc.id} className="border rounded p-4 flex gap-4">
                                <img src={loc.hero.image} className="w-20 h-20 object-cover rounded bg-gray-200" alt={loc.name} />
                                <div>
                                    <h4 className="font-bold">{loc.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">/{loc.slug}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded text-white ${
                                        loc.accentColor === 'cyan' ? 'bg-cyan-500' : 
                                        loc.accentColor === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                                    }`}>Color: {loc.accentColor}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA DE CONTENIDO (ADMIN Y SUPERADMIN) */}
            {(activeTab === 'atracciones' || activeTab === 'actividades' || activeTab === 'galeria') && (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
                    <div className="text-gray-300 text-6xl mb-4">
                        <i className={`fas ${activeTab === 'atracciones' ? 'fa-umbrella-beach' : activeTab === 'actividades' ? 'fa-hiking' : 'fa-images'}`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Gestión de {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Aquí irá la tabla para editar, eliminar y crear nuevos items. 
                        {isSuperAdmin ? " Como SuperAdmin, podrás elegir cualquier localidad." : " Se cargarán automáticamente los datos de tu localidad."}
                    </p>
                    <button className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700">
                        Implementar Gestión de {activeTab}
                    </button>
                </div>
            )}
            
        </div>
      </main>
    </div>
  );
};

const MenuButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active ? 'bg-cyan-900/50 text-cyan-400 font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
    }`}>
        <i className={`fas fa-${icon} w-5 text-center`}></i> {label}
    </button>
);

export default AdminDashboard;