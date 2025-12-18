import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// Servicios
import { getAllLocations, createLocation, updateLocation, deleteLocation } from '../services/locations';
import { getAllUsers, registerAdmin, updateUser, deleteUser } from '../services/auth';
// Componentes de Gestión de Contenido
import AttractionsManager from '../components/admin/AttractionsManager';
import ActivitiesManager from '../components/admin/ActivitiesManager';
import DetailPagesManager from '../components/admin/DetailPagesManager';
import GalleryManager from '../components/admin/GalleryManager';
import ForumModeration from '../components/admin/ForumModeration';
import EditInfoLocalidad from '../components/admin/EditInfoLocalidad'; // <--- NUEVO IMPORT

import type { LocationData, User } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Estado para saber qué localidad estamos editando (Contenido)
  const [workingLocationId, setWorkingLocationId] = useState<number | null>(null);

  // Datos Globales
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // --- ESTADOS PARA LOCALIDADES (Solo SuperAdmin) ---
  const [editingLoc, setEditingLoc] = useState<Partial<LocationData> | null>(null);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  // --- ESTADOS PARA USUARIOS ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'ADMIN', locationId: 0 });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [tempUserRole, setTempUserRole] = useState<string>('');
  const [tempUserLoc, setTempUserLoc] = useState<number | string>('');

  useEffect(() => {
    // Si NO es SuperAdmin, no necesitamos cargar todas las localidades aquí, 
    // porque 'EditInfoLocalidad' se encarga de cargar la suya.
    // Solo cargamos si necesitamos listarlas para SuperAdmin o selectores.
    if (isSuperAdmin || activeTab === 'resumen') {
        loadData();
    }
  }, [activeTab, isSuperAdmin]);

  useEffect(() => {
    // Si es admin normal, fijamos su localidad al iniciar para las otras pestañas de contenido
    if (user && !isSuperAdmin && user.locationId) {
      setWorkingLocationId(user.locationId);
    }
  }, [user, isSuperAdmin]);

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

  // --- HANDLERS USUARIOS (SUPERADMIN) ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await registerAdmin(newUser);
        setMsg({ type: 'success', text: '¡Usuario creado exitosamente!' });
        setIsUserModalOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'ADMIN', locationId: 0 }); 
        loadData();
    } catch (error: any) {
        setMsg({ type: 'error', text: error.response?.data?.message || 'Error al crear usuario' });
    }
  };

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

  // --- HANDLERS LOCALIDADES (SUPERADMIN) ---
  const openLocModal = (loc?: LocationData) => {
    if (loc) {
        setEditingLoc(JSON.parse(JSON.stringify(loc))); 
    } else {
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
          
          {/* MENU PARA SUPERADMIN */}
          {isSuperAdmin && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Administración Global</div>
              <MenuButton icon="map-marked-alt" label="Localidades" active={activeTab === 'localidades'} onClick={() => setActiveTab('localidades')} />
              <MenuButton icon="users-cog" label="Usuarios y Roles" active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')} />
            </>
          )}

          {/* MENU PARA ADMIN LOCAL */}
          {!isSuperAdmin && (
              <>
                 <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Configuración</div>
                 <MenuButton icon="info-circle" label="Mi Localidad" active={activeTab === 'mi-localidad'} onClick={() => setActiveTab('mi-localidad')} />
              </>
          )}

          <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Contenido</div>
          <MenuButton icon="umbrella-beach" label="Atracciones" active={activeTab === 'atracciones'} onClick={() => setActiveTab('atracciones')} />
          <MenuButton icon="hiking" label="Actividades" active={activeTab === 'actividades'} onClick={() => setActiveTab('actividades')} />
          <MenuButton icon="images" label="Galería" active={activeTab === 'galeria'} onClick={() => setActiveTab('galeria')} />
          <MenuButton icon="file-alt" label="Páginas Info" active={activeTab === 'detail-pages'} onClick={() => setActiveTab('detail-pages')} />
          <MenuButton icon="comments" label="Moderación Foro" active={activeTab === 'forum'} onClick={() => setActiveTab('forum')} />
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
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
                
                {/* SELECTOR DE LOCALIDAD (SOLO SUPERADMIN) */}
                {isSuperAdmin && ['atracciones', 'actividades', 'detail-pages', 'galeria'].includes(activeTab) && (
                    <div className="flex items-center gap-2 ml-4 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                        <span className="text-xs font-bold text-gray-500 uppercase">Editando:</span>
                        <select 
                            className="bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
                            value={workingLocationId || ''}
                            onChange={(e) => setWorkingLocationId(Number(e.target.value))}
                        >
                            <option value="">-- Seleccionar Localidad --</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {msg.text && (
                    <span className={`text-sm px-3 py-1 rounded animate-fade-in ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
            
            {/* --- SECCIÓN DE GESTIÓN DE CONTENIDO --- */}
            
            {activeTab === 'atracciones' && (
                workingLocationId ? 
                <AttractionsManager locationId={workingLocationId} /> : 
                <SelectLocationMsg />
            )}

            {activeTab === 'actividades' && (
                workingLocationId ? 
                <ActivitiesManager locationId={workingLocationId} /> : 
                <SelectLocationMsg />
            )}

            {activeTab === 'detail-pages' && (
                workingLocationId ? 
                <DetailPagesManager locationId={workingLocationId} /> : 
                <SelectLocationMsg />
            )}

            {activeTab === 'galeria' && (
                workingLocationId ? 
                <GalleryManager locationId={workingLocationId} /> : 
                <SelectLocationMsg />
            )}

            {activeTab === 'forum' && (
                <ForumModeration locationId={isSuperAdmin ? workingLocationId : user.locationId} />
            )}

            {/* --- ADMINISTRACIÓN: MI LOCALIDAD (Admin Local) --- */}
            {/* Aquí usamos el nuevo componente autónomo */}
            {activeTab === 'mi-localidad' && !isSuperAdmin && user.locationId && (
                <EditInfoLocalidad locationId={user.locationId} />
            )}

            {/* --- SECCIÓN DE ADMINISTRACIÓN GLOBAL (Super Admin) --- */}

            {activeTab === 'usuarios' && isSuperAdmin && (
                <div>
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-700">Gestión de Usuarios</h3>
                        <button onClick={() => setIsUserModalOpen(true)} className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 shadow">
                            + Nuevo Usuario
                        </button>
                    </div>
                    {/* Tabla de usuarios (sin cambios) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">Usuario</th>
                                        <th className="px-6 py-3">Rol</th>
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
                                            {editingUserId === u.id ? (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <select className="border rounded p-1 w-full" value={tempUserRole} onChange={(e) => setTempUserRole(e.target.value)}>
                                                            <option value="USER">Usuario</option>
                                                            <option value="ADMIN">Admin Localidad</option>
                                                            <option value="SUPERADMIN">Super Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {tempUserRole === 'ADMIN' ? (
                                                            <select className="border rounded p-1 w-full" value={tempUserLoc} onChange={(e) => setTempUserLoc(e.target.value)}>
                                                                <option value="">Seleccionar...</option>
                                                                {locations.map(l => (
                                                                    <option key={l.id} value={l.id}>{l.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : <span className="text-gray-400 text-xs italic">No aplica</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button onClick={() => handleUpdateUser(u.id)} className="text-green-600 hover:text-green-800 font-bold text-xs uppercase">Guardar</button>
                                                        <button onClick={cancelEditUser} className="text-gray-500 hover:text-gray-700 text-xs uppercase">Cancelar</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            u.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                                                            u.role === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>{u.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {u.role === 'ADMIN' ? (
                                                             u.locationId ? <span className="text-cyan-700 font-medium">{locations.find(l => l.id === u.locationId)?.name || `ID: ${u.locationId}`}</span>
                                                                : <span className="text-red-500 text-xs">⚠ Sin Asignar</span>
                                                        ) : <span className="text-gray-400">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button onClick={() => startEditUser(u)} className="text-blue-600 hover:text-blue-800"><i className="fas fa-edit"></i></button>
                                                        {u.id !== user.id && <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-800"><i className="fas fa-trash"></i></button>}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

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
                            <div key={loc.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition">
                                <div className="h-32 bg-gray-200 relative">
                                    <img src={loc.hero.image} alt={loc.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button onClick={() => openLocModal(loc)} className="bg-white p-2 rounded-full text-blue-600 shadow hover:bg-blue-50">
                                            <i className="fas fa-pen"></i>
                                        </button>
                                        <button onClick={() => handleDeleteLocation(loc.id)} className="bg-white p-2 rounded-full text-red-600 shadow hover:bg-red-50">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-lg text-gray-800">{loc.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Slug: /{loc.slug}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'resumen' && (
                <div className="bg-white p-10 rounded shadow-sm border border-gray-100 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Panel de Control</h2>
                    <p className="text-gray-600 mb-6">Bienvenido al sistema de gestión de turismo.</p>
                    {isSuperAdmin && (
                         <div className="flex justify-center gap-4">
                             <div className="text-center p-4 bg-gray-50 rounded border w-32">
                                 <div className="text-2xl font-bold text-cyan-600">{locations.length}</div>
                                 <div className="text-xs text-gray-500 uppercase">Localidades</div>
                             </div>
                        </div>
                    )}
                </div>
            )}
            
        </div>

        {/* --- MODAL CREAR/EDITAR LOCALIDAD (PARA SUPERADMIN) --- */}
        {/* Solo mostramos este modal si es SuperAdmin y estamos en 'localidades', 
            ya que el Admin Local tiene su propio modal encapsulado */}
        {isLocModalOpen && editingLoc && isSuperAdmin && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">{editingLoc.id ? 'Editar Información' : 'Nueva Localidad'}</h3>
                        <button onClick={() => setIsLocModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                    </div>
                    <form onSubmit={handleSaveLocation} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nombre</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.name} onChange={e => setEditingLoc({...editingLoc, name: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Slug (URL)</label>
                                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.slug} onChange={e => setEditingLoc({...editingLoc, slug: e.target.value})} required />
                            </div>
                        </div>
                        {/* ... resto del form de superadmin ... */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Color Acento</label>
                                <select className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.accentColor} onChange={e => setEditingLoc({...editingLoc, accentColor: e.target.value as any})}>
                                    <option value="orange">Naranja</option>
                                    <option value="cyan">Cyan</option>
                                    <option value="green">Verde</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Mostrar Botón Reserva</label>
                                <select className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.bookingButton ? 'yes' : 'no'} onChange={e => setEditingLoc({...editingLoc, bookingButton: e.target.value === 'yes'})}>
                                    <option value="no">No</option>
                                    <option value="yes">Sí</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-bold mb-2 text-gray-600 text-sm uppercase">Sección Hero (Portada)</h4>
                            <div className="space-y-3">
                                <input placeholder="Título Principal" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.hero?.title} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, title: e.target.value}})} required />
                                <input placeholder="Subtítulo" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.hero?.subtitle} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, subtitle: e.target.value}})} />
                                <input placeholder="URL Imagen Fondo" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.hero?.image} onChange={e => setEditingLoc({...editingLoc, hero: {...editingLoc.hero!, image: e.target.value}})} required />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-bold mb-2 text-gray-600 text-sm uppercase">Mapa</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" step="any" placeholder="Latitud (ej: -37.1)" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.mapCenter?.lat} onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lat: parseFloat(e.target.value)}})} required />
                                <input type="number" step="any" placeholder="Longitud (ej: -70.5)" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" value={editingLoc.mapCenter?.lng} onChange={e => setEditingLoc({...editingLoc, mapCenter: {...editingLoc.mapCenter!, lng: parseFloat(e.target.value)}})} required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button type="button" onClick={() => setIsLocModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-bold">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Modal Crear Usuario... */}
        {isUserModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Crear Nuevo Usuario</h3>
                        <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
                    </div>
                    <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Nombre Completo</label>
                            <input className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Email</label>
                            <input type="email" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Contraseña</label>
                            <input type="password" className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Rol Inicial</label>
                            <select className="w-full border p-2 rounded focus:ring-2 focus:ring-cyan-500 outline-none" 
                                value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                <option value="USER">Usuario (Sin Admin)</option>
                                <option value="ADMIN">Admin Localidad</option>
                                <option value="SUPERADMIN">Super Admin</option>
                            </select>
                        </div>
                        {newUser.role === 'ADMIN' && (
                            <div className="animate-fade-in bg-blue-50 p-3 rounded border border-blue-100">
                                <label className="block text-sm font-bold mb-1 text-blue-800">Asignar a Localidad</label>
                                <select className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required
                                    value={newUser.locationId} onChange={e => setNewUser({...newUser, locationId: Number(e.target.value)})}>
                                    <option value={0}>Selecciona una localidad...</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                            <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                            <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-bold">Crear Usuario</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

const SelectLocationMsg = () => (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 border-2 border-dashed border-gray-200 rounded-lg">
        <i className="fas fa-arrow-up text-4xl mb-4 animate-bounce text-cyan-200"></i>
        <p className="text-xl font-medium text-gray-500">Selecciona una localidad</p>
        <p className="text-sm">Usa el selector superior para elegir qué contenido editar.</p>
    </div>
);

const MenuButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        active ? 'bg-cyan-900/50 text-cyan-400 font-medium' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
    }`}>
        <i className={`fas fa-${icon} w-5 text-center`}></i> {label}
    </button>
);

export default AdminDashboard;