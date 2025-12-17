import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth';
import Header from '../components/Header';
import { HOME_NAV_LINKS } from '../constants';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { token, user } = await registerUser(formData.name, formData.email, formData.password);
      login(token, user); // Loguear automáticamente
      navigate('/'); // Ir al home
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header navLinks={HOME_NAV_LINKS} />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
            <p className="text-gray-500">Únete a nuestra comunidad de viajeros</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-cyan-600 font-bold hover:underline">
              Inicia Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;