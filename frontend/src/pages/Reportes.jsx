import {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import MainLayout from '../layouts/MainLayout';

import {obtenerRegistros} from '../services/registro.service';

import {obtenerResumen} from "../services/reporte.service"

import {
  generarPDFReporte,
  generarExcelReporte,
  generarLinkWhatsApp,
} from '../utils/reportes';

export default function Reportes() {
  const [resumen, setResumen] = useState(null);
  const [registro, setRegistro] = useState(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // CARGAR REPORTES
  // ======================================

  useEffect(() => {
    cargarDatos();
    cargarResumen()
  }, []);

  const cargarDatos =
    async () => {
      try {
        const response =await obtenerResumen();
        
        setResumen(response);
      } catch (error) {
        toast.error(
          'Error al cargar reportes'
        );
      } finally {
        setLoading(false);
      }
  };
  
  const cargarResumen =
  async () => {
    try {
      const response =
      await obtenerRegistros();
      

      setRegistro(response);
    } catch (error) {
      toast.error(
        'Error al cargar reportes'
      );
    } finally {
      setLoading(false);
    }
  };
  
  
    // ======================================
    // EXPORTAR PDF
  // ======================================

  const exportarPDF = () => {
    generarPDFReporte({
       registros:registro,
       resumen: resumen,
    });

    toast.success(
      'PDF generado correctamente'
    );
  };

  // ======================================
  // EXPORTAR EXCEL
  // ======================================

  const exportarExcel = () => {
    generarExcelReporte({
      registros: registro,
      resumen: resumen,
    });

    toast.success(
      'Excel generado correctamente'
    );
  };

  // ======================================
  // WHATSAPP
  // ======================================

  const enviarWhatsApp = () => {
    const url =
      generarLinkWhatsApp(
        resumen
      );

    window.open(
      url,
      '_blank'
    );
  };

  // if (loading) {
  //   return (
  //     <MainLayout>
  //       <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
  //         <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  //       </div>
  //     </MainLayout>
  //   );
  // }

  return (
    <MainLayout isLoading={loading}>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Reportes
          </h1>

          <p className="text-gray-500">
            Exportación y análisis
          </p>
        </div>

        {/* BOTONES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={exportarPDF}
            className="bg-red-500 text-white p-5 rounded-2xl font-semibold"
          >
            Exportar PDF
          </button>

          <button
            onClick={exportarExcel}
            className="bg-green-600 text-white p-5 rounded-2xl font-semibold"
          >
            Exportar Excel
          </button>

          <button
            onClick={enviarWhatsApp}
            className="bg-green-500 text-white p-5 rounded-2xl font-semibold"
          >
            Enviar WhatsApp
          </button>
        </div>

        {/* RESUMEN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            Resumen General
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <p className="text-gray-500">
                Horas trabajadas
              </p>

              <h3 className="text-3xl font-bold">
                {
                  resumen?.totalHoras
                }
                h
              </h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">
                Horas extra
              </p>

              <h3 className="text-3xl font-bold">
                {
                  resumen?.totalExtras
                }
                h
              </h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">
                Horas compensadas
              </p>

              <h3 className="text-3xl font-bold">
                {
                  resumen?.totalHorasCompensadas
                }
                h
              </h3>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">
                Sábados pendientes
              </p>

              <h3 className="text-3xl font-bold">
                {
                  resumen?.sabadosPendientes
                }
              </h3>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Registros
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">
                    Fecha
                  </th>

                  <th className="p-3 text-left">
                    Trabajadas
                  </th>

                  <th className="p-3 text-left">
                    Extras
                  </th>

                  <th className="p-3 text-left">
                    Observaciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {registro?.registros.map(
                  (registro,index) => (
                    <tr 
                      key={index}
                      className="border-b"
                    >
                      <td className="p-3">
                        {new Date(
                          registro.fecha
                        ).toLocaleDateString()}
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

                      <td className="p-3">
                        {registro.observaciones ||
                          '-'}
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