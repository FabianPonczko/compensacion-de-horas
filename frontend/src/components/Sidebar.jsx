import { useState ,useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Importamos tu hook

const links = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Registros', path: '/registros' },
  { name: 'Sábados', path: '/sabados' },
  { name: 'Reportes', path: '/reportes' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Obtenemos user y logout
  const [isVisible, setIsVisible] = useState(true); // Controla la visibilidad del header
  const [lastScrollY, setLastScrollY] = useState(0); // Guarda la última posición del scroll
  const location = useLocation();
  const navigate = useNavigate();

   // Efecto para escuchar el scroll del usuario
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setIsVisible(false); // Oculta si baja y pasó los 50px
      } else {
        setIsVisible(true);  // Muestra si sube
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Banco de Horas</h1>
          <p className="text-xs text-gray-400 mt-1">{user?.nombre}</p>
        </div>
        <button className="md:hidden text-white" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname === link.path
                ? 'bg-white text-black'
                : 'text-white hover:bg-gray-800'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Botón Salir al final */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-950/30 rounded-xl transition"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header móvil con animación de transición */}
      <div className={`md:hidden fixed top-0 left-0 right-0 bg-black p-4 flex justify-between items-center z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <h1 className="text-xl font-bold text-white">Banco de Horas</h1>
        <button onClick={() => setIsOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-black hidden md:flex flex-col border-r border-gray-800">
        <NavContent />
      </aside>

      {/* Menú Móvil */}
      <div className={`fixed inset-0 bg-black z-[60] transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </div>
    </>
  );
}
