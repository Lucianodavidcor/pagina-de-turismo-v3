import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth';
import Header from '../components/Header'; // Usamos tu Header genérico
import { HOME_NAV_LINKS } from '../constants';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { token, user } = await loginUser(email, password);
      login(token, user);
      
      // Redirección inteligente
      if (user.role === 'SUPERADMIN' || user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header navLinks={HOME_NAV_LINKS} />
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h1>
            <p className="text-gray-500">Ingresa a tu cuenta para gestionar el turismo</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm border border-red-100 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded hover:bg-cyan-700 transition transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-cyan-600 font-bold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;