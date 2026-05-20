import {useEffect,useState,} from 'react';

import toast from 'react-hot-toast';

import dayjs from 'dayjs';

import {crearRegistro,} from '../services/registro.service';

import {obtenerSabadosPendientes,} from '../services/sabado.service';

export default function RegistroForm({ onCreated,}) {
  const [sabados, setSabados] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({fecha: dayjs().format(
    
    'YYYY-MM-DD' ),

    horaEntrada: '',

    horaSalida: '',

    sabadoAsignado: '',

    observaciones: '',
  });

  // ======================================
  // CARGAR SÁBADOS
  // ======================================

  useEffect(() => {
    cargarSabados();
  }, []);

  const cargarSabados = async () => {
      try {
        const response =
          await obtenerSabadosPendientes();

        setSabados(response.sabados);
      } catch (error) {
        console.error(error);
      }
    };

  // ======================================
  // HANDLE CHANGE
  // ======================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // ======================================
  // CALCULAR HORAS
  // ======================================

  const calcularHoras = () => {
    
    if (
      !form.horaEntrada ||
      !form.horaSalida
    ) {
     
      return 0;
    }

    const entrada = dayjs(
      `2026-01-01 ${form.horaEntrada}`
    );

    const salida = dayjs(
      `2026-01-01 ${form.horaSalida}`
    );

    return salida.diff(
      entrada,
      'hour',
      true
    );
  };

  
  const horasTrabajadas =
    calcularHoras();

  const horasExtras =
    horasTrabajadas > 8
      ? horasTrabajadas - 8
      : 0;

  // ======================================
  // SUBMIT
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await crearRegistro(form);

      toast.success(
        'Registro creado correctamente'
      );

      setForm({
        fecha: dayjs().format(
          'YYYY-MM-DD'
        ),

        horaEntrada: '',

        horaSalida: '',

        sabadoAsignado: '',

        observaciones: '',
      });

      onCreated?.();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Error al crear registro'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <select
          name="sabadoAsignado"
          value={form.sabadoAsignado}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        >
          <option value="">
            Automático
          </option>

          {sabados.map((sabado) => (
            <option
              key={sabado._id}
              value={sabado._id}
            >
              {sabado.fecha} -{' '}
              {
                sabado.horasRestantes
              }
              h
            </option>
          ))}
        </select>

        <input
          type="time"
          name="horaEntrada"
          value={form.horaEntrada}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <input
          type="time"
          name="horaSalida"
          value={form.horaSalida}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        />

        <textarea
          rows="4"
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
          className="border p-3 rounded-xl md:col-span-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Horas trabajadas
          </p>

          <h3 className="text-3xl font-bold">
            {horasTrabajadas}
          </h3>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Horas extra
          </p>

          <h3 className="text-3xl font-bold">
            {horasExtras}
          </h3>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-xl mt-6"
      >
        {loading
          ? 'Guardando...'
          : 'Guardar Registro'}
      </button>
    </form>
  );
}