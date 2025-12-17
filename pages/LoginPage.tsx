import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/auth';
import Header from '../components/Header'; // Reutilizamos tu Header si quieres

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await loginUser(email, password);
      login(token, user);
      
      // Redirección inteligente según rol
      if (user.role === 'SUPERADMIN' || user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar Sesión</h2>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded hover:bg-cyan-700 transition"
            >
              Entrar
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta? <Link to="/register" className="text-cyan-600 hover:underline">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;