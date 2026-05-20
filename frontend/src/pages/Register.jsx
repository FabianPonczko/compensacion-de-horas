import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import { registerRequest } from '../services/auth.service';

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });

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

      await registerRequest(form);

      toast.success(
        'Usuario creado correctamente'
      );

      navigate('/');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al registrar usuario'
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
          Crear Cuenta
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Registro de usuario
        </p>

        <div className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl mt-6"
        >
          {loading
            ? 'Creando...'
            : 'Crear Cuenta'}
        </button>

        <button
          type="button"
          onClick={() =>
            navigate('/')
          }
          className="w-full border py-3 rounded-xl mt-3"
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
}