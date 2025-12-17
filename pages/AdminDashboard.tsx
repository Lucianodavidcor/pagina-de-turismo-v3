import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Servicios
import { getAllLocations, createLocation, updateLocation, deleteLocation } from '../services/locations';
import { getAllUsers, registerAdmin, updateUser, deleteUser } from '../services/auth';
// Tipos
import type { LocationData, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Datos Globales
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Estado para Edición de Localidad
  const [editingLoc, setEditingLoc] = useState<Partial<LocationData> | null>(null);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // Estado para Edición de Usuario (inline en la tabla)
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [tempUserRole, setTempUserRole] = useState<string>('');
  const [tempUserLoc, setTempUserLoc] = useState<number | string>('');

  useEffect(() => {
    if (activeTab === 'localidades' || activeTab === 'usuarios' || activeTab === 'resumen') {
        loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
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
        setLoading(false);
    }
  };

  // --- HANDLERS USUARIOS ---

  const startEditUser = (u: User) => {
    setEditingUserId(u.id);
    setTempUserRole(u.role);
    setTempUserLoc(u.locationId || '');
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
  };

  const handleUpdateUser = async (id: number) => {
    try {
        const locId = tempUserRole === 'ADMIN' && tempUserLoc ? Number(tempUserLoc) : null;
        await updateUser(id, tempUserRole, locId);
        setMsg({ type: 'success', text: 'Usuario actualizado correctamente' });
        setEditingUserId(null);
        loadData();
    } catch (error: any) {
        setMsg({ type: 'error', text: error.response?.data?.message || 'Error al actualizar' });
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
        await deleteUser(id);
        setMsg({ type: 'success', text: 'Usuario eliminado' });
        loadData();
    } catch (error: any) {
        setMsg({ type: 'error', text: 'Error al eliminar usuario' });
    }
  };

  // --- HANDLERS LOCALIDADES ---

  const openLocModal = (loc?: LocationData) => {
    if (loc) {
        setEditingLoc(JSON.parse(JSON.stringify(loc))); // Deep copy simple
    } else {
        // Inicializar vacío para crear
        setEditingLoc({
            name: '', slug: '', accentColor: 'orange', bookingButton: false,
            hero: { title: '', subtitle: '', image: '' },
            mapCenter: { lat: -37.0, lng: -70.0 }
        });
    }
    setIsLocModalOpen(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoc) return;

    try {
        if (editingLoc.id) {
            await updateLocation(editingLoc.id, editingLoc);
            setMsg({ type: 'success', text: 'Localidad actualizada' });
        } else {
            await createLocation(editingLoc);
            setMsg({ type: 'success', text: 'Localidad creada' });
        }
        setIsLocModalOpen(false);
        setEditingLoc(null);
        loadData();
    } catch (error: any) {
        setMsg({ type: 'error', text: error.response?.data?.message || 'Error al guardar localidad' });
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm('¿Eliminar esta localidad? Se borrará todo su contenido asociado.')) return;
    try {
        await deleteLocation(id);
        setMsg({ type: 'success', text: 'Localidad eliminada' });
        loadData();
    } catch (error) {
        setMsg({ type: 'error', text: 'Error al eliminar' });
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
              <MenuButton icon="users-cog" label="Usuarios y Roles" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} />
            </>
          )}

          <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Contenido</div>
          {/* Aquí irían las tabs de contenido real */}
          <MenuButton icon="umbrella-beach" label="Atracciones" active={activeTab === 'atracciones'} onClick={() => setActiveTab('atracciones')} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition w-full px-2 py-2 rounded hover:bg-slate-800">
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h2>
            <div className="flex items-center gap-4">
                {msg.text && (
                    <span className={`text-sm px-3 py-1 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {msg.text}
                    </span>
                )}
                <span className="text-sm text-gray-600 hidden sm:block">Hola, <strong>{user.name}</strong></span>
                <button onClick={() => navigate('/')} className="text-sm bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded border border-cyan-100 hover:bg-cyan-100 transition">
                    Ver Web
                </button>
            </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            
            {/* --- TAB: USUARIOS --- */}
            {activeTab === 'usuarios' && isSuperAdmin && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 font-bold text-gray-700 flex justify-between">
                        <span>Gestión de Usuarios</span>
                        <span className="text-xs font-normal text-gray-500">Edita roles directamente en la tabla</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Usuario</th>
                                    <th className="px-6 py-3">Rol Actual</th>
                                    <th className="px-6 py-3">Localidad Asignada</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{u.name}</div>
                                            <div className="text-gray-500 text-xs">{u.email}</div>
                                        </td>
                                        
                                        {/* MODO EDICIÓN */}
                                        {editingUserId === u.id ? (
                                            <>
                                                <td className="px-6 py-4">
                                                    <select 
                                                        className="border rounded p-1 w-full"
                                                        value={tempUserRole}
                                                        onChange={(e) => setTempUserRole(e.target.value)}
                                                    >
                                                        <option value="USER">Usuario (Sin permisos)</option>
                                                        <option value="ADMIN">Admin Localidad</option>
                                                        <option value="SUPERADMIN">Super Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {tempUserRole === 'ADMIN' ? (
                                                        <select 
                                                            className="border rounded p-1 w-full"
                                                            value={tempUserLoc}
                                                            onChange={(e) => setTempUserLoc(e.target.value)}
                                                        >
                                                            <option value="">Seleccionar...</option>
                                                            {locations.map(l => (
                                                                <option key={l.id} value={l.id}>{l.name}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => handleUpdateUser(u.id)} className="text-green-600 hover:text-green-800 font-bold">Guardar</button>
                                                    <button onClick={cancelEditUser} className="text-gray-500 hover:text-gray-700">Cancelar</button>
                                                </td>
                                            </>
                                        ) : (
                                            /* MODO LECTURA */
                                            <>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        u.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                                                        u.role === 'ADMIN' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.locationId ? locations.find(l => l.id === u.locationId)?.name || u.locationId : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button onClick={() => startEditUser(u)} className="text-blue-600 hover:text-blue-800">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    {u.id !== user.id && (
                                                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-800">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: LOCALIDADES --- */}
            {activeTab === 'localidades' && isSuperAdmin && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-700">Gestión de Localidades</h3>
                        <button onClick={() => openLocModal()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow">
                            + Nueva Localidad
                        </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {locations.map(loc => (
                            <div key={loc.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group">
                                <div className="h-32 bg-gray-200 relative">
                                    <img src={loc.hero.image} alt={loc.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openLocModal(loc)} className="bg-white p-2 rounded-full text-blue-600 shadow hover:bg-blue-50">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button onClick={() => handleDeleteLocation(loc.id)} className="bg-white p-2 rounded-full text-red-600 shadow hover:bg-red-50">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-lg">{loc.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Slug: /{loc.slug}</p>
                                    <div className="flex gap-2 text-xs">
                                        <span className={`px-2 py-1 rounded bg-${loc.accentColor === 'orange' ? 'orange' : loc.accentColor === 'cyan' ? 'cyan' : 'green'}-100 text-gray-700 border`}>
                                            Color: {loc.accentColor}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- TAB: RESUMEN (DEFAULT) --- */}
            {activeTab === 'resumen' && (
                <div className="bg-white p-8 rounded shadow text-center">
                    <h2 className="text-2xl font-bold mb-2">Panel de Control</h2>
                    <p className="text-gray-600">Selecciona una opción del menú lateral.</p>
                </div>
            )}
            
        </div>

        {/* --- MODAL CREAR/EDITAR LOCALIDAD --- */}
        {isLocModalOpen && editingLoc && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">{editingLoc.id ? 'Editar Localidad' : 'Nueva Localidad'}</h3>
                    </div>
                    <form onSubmit={handleSaveLocation} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nombre</label>
                                <input className="w-full border p-2 rounded" value={editingLoc.name} onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Slug (URL)</label>
                                <input className="w-full border p-2 rounded" value={editingLoc.slug} onChange={e => setEditingLoc({...editingLoc, slug: e.target.value})} required />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Color Acento</label>
                                <select className="w-full border p-2 rounded" value={editingLoc.accentColor} onChange={e => setEditingLoc({...editingLoc, accentColor: e.target.value as any})}>
                                    <option value="orange">Naranja</option>
                                    <option value="cyan">Cyan</option>
                                    <option value="green">Verde</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Mostrar Botón Reserva</label>
                                <select className="w-full border p-2 rounded" value={editingLoc.bookingButton ? 'yes' : 'no'} onChange={e => setEditingLoc({...editingLoc, bookingButton: e.target.value === 'yes'})}>
                                    <option value="no">No</option>
                                    <option value="yes">Sí</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-bold mb-2 text-gray-600">Sección Hero (Portada)</h4>
                            <div className="space-y-3">
                                <input placeholder="Título Hero" className="w-full border p-2 rounded" value={editingLoc.hero?.title} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, title: e.target.value}})} required />
                                <input placeholder="Subtítulo" className="w-full border p-2 rounded" value={editingLoc.hero?.subtitle} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, subtitle: e.target.value}})} />
                                <input placeholder="URL Imagen Fondo" className="w-full border p-2 rounded" value={editingLoc.hero?.image} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, image: e.target.value}})} required />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-bold mb-2 text-gray-600">Ubicación (Mapa)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="any" placeholder="Latitud" className="w-full border p-2 rounded" value={editingLoc.mapCenter?.lat} onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lat: parseFloat(e.target.value)}})} required />
                                <input type="number" step="any" placeholder="Longitud" className="w-full border p-2 rounded" value={editingLoc.mapCenter?.lng} onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lng: parseFloat(e.target.value)}})} required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button type="button" onClick={() => setIsLocModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Guardar Localidad</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

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