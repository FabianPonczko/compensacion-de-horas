import api from './api';

export const crearRegistro =
  async (payload) => {
    const { data } = await api.post(
      '/registros',
      payload
    );

    return data;
  };

export const obtenerRegistros =
  async () => {
    const { data } = await api.get(
      '/registros'
    );

    return data;
  };

export const eliminarRegistro =
  async (id) => {
    const { data } = await api.delete(
      `/registros/${id}`
    );

    return data;
  };