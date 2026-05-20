import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } =
    useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">
          Bienvenido
        </h2>

        <p className="text-gray-500">
          {user?.nombre}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        Salir
      </button>
    </header>
  );
}