import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import { loginRequest } from '../services/auth.service';

import { useAuth } from '../hooks/useAuth';

import { Link } from 'react-router-dom';

import { getUserFromToken } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] =
    useState(false);

    // ======================================
  // COMPROBAR SI YA ESTÁ LOGEADO AL CARGAR
  // ======================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const user = getUserFromToken(token);
      
      if (user) {
        // Opcional: Si tu useAuth necesita el usuario al recargar, puedes pasárselo aquí
        // login(user); 
        
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);
  
  // ======================================
  // HANDLE CHANGE
  // ======================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        await loginRequest(form);

      login(data);

      toast.success(
        'Bienvenido nuevamente'
      );

      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-2">
          Banco de Horas
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Iniciar sesión
        </p>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full border p-3 rounded-xl"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl mt-6 hover:opacity-90 transition"
        >
          {loading
            ? 'Ingresando...'
            : 'Ingresar'}
        </button>
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            ¿No tienes cuenta?
          </p>

          <Link
            to="/register"
            className="text-black font-semibold"
          >
            Crear cuenta
          </Link>
        </div>
      </form>
      </div>
  );
}