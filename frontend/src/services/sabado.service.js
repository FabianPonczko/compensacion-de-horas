import api from './api';

export const crearSabado =
  async (payload) => {
    const { data } = await api.post(
      '/sabados',
      payload
    );

    return data;
  };

export const obtenerSabados =
  async () => {
    const { data } = await api.get(
      '/sabados'
    );

    return data;
  };

export const obtenerSabadosPendientes =
  async () => {
    const { data } = await api.get(
      '/sabados/pendientes'
    );

    return data;
  };

export const eliminarSabado =
  async (id) => {
    const { data } = await api.delete(
      `/sabados/${id}`
    );

    return data;
  };

export const presentarSabado = 
  async (id) => {
    const { data } = await api.put(
      `/sabados/${id}`, 
      { presentado: "x" } // Enviamos solo el campo que cambió
    );

    return data;
};