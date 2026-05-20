// ======================================================
// src/pages/Registros.jsx
// ======================================================

import {
  useEffect,
  useState,
} from 'react';

import dayjs from 'dayjs';

import toast from 'react-hot-toast';

import MainLayout from '../layouts/MainLayout';

import RegistroForm from '../components/RegistroForm';

import {
  obtenerRegistros,
  eliminarRegistro,
} from '../services/registro.service';

export default function Registros() {
  const [registros, setRegistros] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // CARGAR
  // ======================================

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros =
    async () => {
      try {
        const response =
          await obtenerRegistros();

        setRegistros(
          response.registros || []
        );
      } catch (error) {
        toast.error(
          'Error al cargar registros'
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================
  // ELIMINAR
  // ======================================

  const handleDelete = async (id) => {
    const confirmar = window.confirm(
      '¿Eliminar registro?'
    );

    if (!confirmar) return;

    try {
      await eliminarRegistro(id);

      toast.success(
        'Registro eliminado'
      );

      cargarRegistros();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al eliminar'
      );
    }
  };

  // ======================================
  // UI
  // ======================================

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Registros Diarios
          </h1>

          <p className="text-gray-500">
            Gestión de horas trabajadas
          </p>
        </div>

        {/* FORM */}
        <RegistroForm
          onCreated={cargarRegistros}
        />

        {/* TABLA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Historial
            </h2>
          </div>

          {loading ? (
            <div className="py-10">
              Cargando...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3 text-left">
                      Fecha
                    </th>

                    <th className="p-3 text-left">
                      Jornada
                    </th>

                    <th className="p-3 text-left">
                      Horas
                    </th>

                    <th className="p-3 text-left">
                      Horario Extra
                    </th>

                    <th className="p-3 text-left">
                      Sábado
                    </th>

                    <th className="p-3 text-left">
                      Compensado
                    </th>

                    <th className="p-3 text-left">
                      Estado
                    </th>

                    <th className="p-3 text-left">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {registros.map(
                    (registro) => (
                      <tr
                        key={registro._id}
                        className="border-b hover:bg-gray-50"
                      >
                        {/* FECHA */}
                        <td className="p-3">
                          {dayjs(
                            registro.fecha
                          ).format(
                            'DD/MM/YYYY'
                          )}
                        </td>

                        {/* JORNADA */}
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span>
                              {
                                registro.horaEntrada
                              }
                              {' → '}
                              {
                                registro.horaSalida
                              }
                            </span>

                            <span className="text-xs text-gray-500">
                              Jornada
                            </span>
                          </div>
                        </td>

                        {/* HORAS */}
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span>
                              {
                                registro.horasTrabajadas
                              }
                              h
                            </span>

                            <span className="text-green-600 text-xs">
                              +
                              {
                                registro.horasExtras
                              }
                              h extra
                            </span>
                          </div>
                        </td>

                        {/* HORARIO EXTRA */}
                        <td className="p-3">
                          {registro.horaExtraDesde ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-orange-600">
                                {
                                  registro.horaExtraDesde
                                }
                                {' → '}
                                {
                                  registro.horaExtraHasta
                                }
                              </span>

                              <span className="text-xs text-gray-500">
                                Horas extra
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        {/* SÁBADO */}
                        <td className="p-3">
                          {registro
                            .sabadoAsignado
                            ?.fecha ? (
                            <div className="flex flex-col">
                              <span>
                                {dayjs(
                                  registro
                                    .sabadoAsignado
                                    .fecha
                                ).format(
                                  'DD/MM/YYYY'
                                )}
                              </span>

                              <span className="text-xs text-gray-500">
                                Sábado
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        {/* COMPENSADO */}
                        <td className="p-3">
                          {registro.horaCompensadaDesde ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-blue-600">
                                {
                                  registro.horaCompensadaDesde
                                }
                                {' → '}
                                {
                                  registro.horaCompensadaHasta
                                }
                              </span>

                              <span className="text-xs text-gray-500">
                                Compensación
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        {/* ESTADO */}
                        <td className="p-3">
                          {registro.horasExtras >
                          0 ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                              Compensado
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                              Normal
                            </span>
                          )}
                        </td>

                        {/* ACCIONES */}
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleDelete(
                                registro._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* EMPTY */}
              {!registros.length && (
                <div className="text-center py-10 text-gray-500">
                  No existen registros
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}