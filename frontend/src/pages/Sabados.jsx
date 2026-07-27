import {
  useEffect,
  useState,
} from 'react';

import toast from 'react-hot-toast';

import MainLayout from '../layouts/MainLayout';

import SabadosTable from '../components/SabadosTable';

import {
  crearSabado,
  obtenerSabados,
  eliminarSabado,
} from '../services/sabado.service';

export default function Sabados() {
  const [fecha, setFecha] =
    useState('');

  const [sabados, setSabados] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // CARGAR
  // ======================================

  useEffect(() => {
    cargarSabados();
  }, []);

  const cargarSabados =
    async () => {
      try {
        const response =
          await obtenerSabados();

        setSabados(
          response.sabados || []
        );
      } catch (error) {
        toast.error(
          'Error al cargar sábados'
        );
      } finally {
        setLoading(false);
      }
    };

  // ======================================
  // CREAR 02
  // ======================================

  const handleCreate = async (
    e
  ) => {
    e.preventDefault();

    if (!fecha) {
      return toast.error(
        'Seleccione una fecha'
      );
    }

    try {
      await crearSabado({
        fecha,
      });

      toast.success(
        'Sábado creado'
      );

      setFecha('');

      cargarSabados();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al crear sábado'
      );
    }
  };

  // ======================================
  // ELIMINAR
  // ======================================

  const handleDelete = async (id) => {
    const confirmar = window.confirm(
      '¿Eliminar sábado?'
    );

    if (!confirmar) return;

    try {
      await eliminarSabado(id);

      toast.success(
        'Sábado eliminado'
      );

      cargarSabados();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al eliminar'
      );
    }
  };

  return (
    <MainLayout isLoading={loading}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Gestión de Sábados
          </h1>

          <p className="text-gray-500">
            Administración de horas compensables
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-2xl shadow-sm flex gap-4"
        >
          <input
            type="date"
            value={fecha}
            onChange={(e) =>
              setFecha(
                e.target.value
              )
            }
            className="border p-3 rounded-xl flex-1"
          />

          <button className="bg-black text-white px-6 rounded-xl">
            Crear
          </button>
        </form>

        {/* TABLA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {loading ? (
            <div>Cargando...</div>
          ) : (
            <SabadosTable
              sabados={sabados}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}