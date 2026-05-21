import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function MainLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-64">
        {/* <Navbar /> */}

        <main className="p-6 mt-14  md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}