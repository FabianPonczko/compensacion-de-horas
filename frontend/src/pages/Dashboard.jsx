import { useEffect, useState } from 'react';

import MainLayout from '../layouts/MainLayout';

import DashboardCards from '../components/DashboardCards';

import { obtenerResumen } from '../services/reporte.service';



export default function Dashboard() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // CARGAR DASHBOARD
  // ======================================

  useEffect(() => {
    cargarDashboard();
  }, []);
  console.log("data: ",data)
  const cargarDashboard =
    async () => {
      try {
        const response =
          await obtenerResumen();
          setData(response);
        } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
  //   if (loading) {
  //     return (
  //       <MainLayout>
  //        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
  //         <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  //       </div>
  //     </MainLayout>
  //   );
  // }
  

  return (
    <MainLayout isLoading={loading}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500">
            Resumen general del sistema
          </p>
        </div>

        <DashboardCards
          resumen={data}
        />

        {/* Próximos sábados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Próximos sábados pendientes
          </h2>

          <div className="space-y-4">
            {data?.proximosSabados?.map(
              (sabado) => (
                <div
                  key={sabado.id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {sabado.fecha}
                    </p>

                    <p className="text-sm text-gray-500">
                      Estado:{' '}
                      {sabado.estado}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold">
                      {
                        sabado.horasRestantes
                      }
                      h
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Últimos registros */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Últimos 5 registros
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    Fecha
                  </th>

                  <th className="text-left p-3">
                    Horas
                  </th>

                  <th className="text-left p-3">
                    Extras
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.ultimosRegistros?.map(
                  (registro) => (
                    <tr
                      key={registro.id}
                      className="border-b"
                    >
                      <td className="p-3">
                        {registro.fecha}
                      </td>

                      <td className="p-3">
                        {
                          registro.horasTrabajadas
                        }
                        h
                      </td>

                      <td className="p-3">
                        {
                          registro.horasExtras
                        }
                        h
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}