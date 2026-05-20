import {
  Link,
  useLocation,
} from 'react-router-dom';

const links = [
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Registros',
    path: '/registros',
  },
  {
    name: 'Sábados',
    path: '/sabados',
  },
  {
    name: 'Reportes',
    path: '/reportes',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-black text-white hidden md:flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          Banco Horas
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-xl transition ${
              location.pathname ===
              link.path
                ? 'bg-white text-black'
                : 'hover:bg-gray-800'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}