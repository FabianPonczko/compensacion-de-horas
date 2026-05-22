import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout({
  children, isLoading = false
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-64">
        {/* <Navbar /> */}

        {/* <main className="p-6 mt-14  md:mt-0">
          {children}
        </main> */}
        <main className="p-6 mt-14 md:mt-0 flex-1 flex flex-col">
          {isLoading ? (
            /* Pantalla de carga integrada solo en el área del contenido */
            <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium animate-pulse">Cargando contenido...</p>
            </div>
          ) : (
            /* Contenido real una vez finalizada la carga */
            children
          )}
        </main>
      </div>
    </div>
  );
}