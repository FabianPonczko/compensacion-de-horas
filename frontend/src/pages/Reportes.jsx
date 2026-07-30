import {
  useEffect,
  useState,
} from 'react';

import dayjs from 'dayjs';

import toast from 'react-hot-toast';

import MainLayout from '../layouts/MainLayout';

import {obtenerRegistros} from '../services/registro.service';

import {
  obtenerResumen,
  obtenerSabadosCompletados,
  obtenerReporteSabado,
  obtenerReporteSeleccion
} from "../services/reporte.service"

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


  const [sabados, setSabados] =
  useState([]);

  const [seleccionados,
  setSeleccionados] =
  useState([]);

  const [reporte,
    setReporte] =
    useState(null);

  
  const [sabadoSeleccionado,
    setSabadoSeleccionado] =
    useState(null);

  // ======================================
  // CARGAR REPORTES
  // ======================================

  useEffect(() => {
    cargarDatos();
    cargarResumen()
    cargarSabados();
  }, []);

  useEffect(() => {

  if (
    !seleccionados.length
  ) {

    setReporte(null);

    return;

  }

  cargarReporte();

}, [seleccionados]);


  const cargarReporte =
    async () => {
      try {
        const response =
          await obtenerReporteSeleccion(
            seleccionados
          );
        setReporte(response);
        
      } catch {
        toast.error(
          'Error generando reporte'
        );
      }
      
  };
console.log("reporte",reporte)
  const cargarSabados =
  async () => {

    try {

      const response =
        await obtenerSabadosCompletados();

      setSabados(
        response.sabados
      );

    } catch {

      toast.error(
        'Error al cargar sábados'
      );

    } finally {

      setLoading(false);

    }

  };

  const toggleSabado = (
  id
) => {

  setSeleccionados(
    (prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id]
  );

};

  const seleccionarSabado =
  async (id) => {
      try {
        const response =
          await obtenerReporteSabado(
            id
          );

        // setReporte(response);

        setSabadoSeleccionado(
          response.sabado
        );
        console.log("sabadoseleccionado",sabadoSeleccionado)
      } catch (error) {
        console.log("error",error)
        toast.error(
          'Error cargando reporte',error.data
        );
      }
    };

  const seleccionarTodos =
    () => {

      setSeleccionados(

        sabados.map(
          (s) => s._id
        )

      );

    };

  const limpiarSeleccion =
    () => {

      setSeleccionados([]);

      setReporte(null);

    };

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
      registros: reporte.registros,
      resumen: reporte.resumen,
      sabado:  sabados
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

   {/* SABADOS COMPLETADOS */}


<div className="bg-white p-6 rounded-2xl shadow-sm">
  <div className="flex gap-3 mb-4">
    <button
      onClick={seleccionarTodos}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
      Seleccionar todos
    </button>

    <button
      onClick={limpiarSeleccion}
      className="bg-gray-500 text-white px-4 py-2 rounded-xl"
      >
      Limpiar
    </button>
  </div>


  <table className="w-full">

    <thead>
      <tr className="border-b">
      <th></th>
      <th>Fecha</th>
      <th>Estado</th>
      <th>Horas</th>
      <th>Presentado</th>
      </tr>
    </thead>

    <tbody>

      {sabados.map(
        (sabado)=>(
        <tr
          key={sabado._id}
          className="border-b hover:bg-gray-50"
        >
        <td className="p-3">
          <input
            type="checkbox"
            checked={
              seleccionados.includes(
                sabado._id
              )
            }
            onChange={()=>
              toggleSabado(
                sabado._id
              )
            }
          />
        </td>

        <td className="p-3">
          {dayjs(sabado.fecha).format('DD/MM/YYYY')}
        
        {/* {new Date(
        sabado.fecha
        ).toLocaleDateString()} */}

        </td>

        <td className="p-3">
          {sabado.estado}
        </td>

        <td className="p-3">
          {sabado.horasTotales} h
        </td>

        <td className="p-3">
          {sabado.presentado}
        </td>

        </tr>

        ))

    }

    </tbody>


  </table>
</div>

 <div className="bg-white p-6 rounded-2xl shadow-sm">
  <h2 className="font-semibold">
    Sabados seleccionados
  </h2>
  <p className="text-3xl font-bold">
    {seleccionados.length}
  </p>
</div>



    {/* RESUMEN */}
  {seleccionados.length > 0  && 
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
              reporte?.resumen?.totalHoras||0
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
              reporte?.resumen?.totalExtras||0
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
              reporte?.resumen?.totalHorasCompensadas||0
            }
            h
          </h3>
        </div>

        
      </div>
    </div>
  }
    {/* TABLA */}
    
    {seleccionados.length > 0  && 
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
            {reporte?.registros.map(
              (registro,index) => (
                <tr 
                  key={index}
                  className="border-b"
                >
                  <td className="p-3">
                    {dayjs(
                      registro.fecha
                    ).format(
                      'DD/MM/YYYY'
                    )}
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
  }
  </div>
</MainLayout>
  );
}