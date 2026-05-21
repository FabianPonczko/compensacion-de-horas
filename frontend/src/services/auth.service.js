import api from './api';

export const loginRequest = async (
  payload
) => {
  const { data } = await api.post(
    '/auth/login',
    payload
  );
   // SI TU API DEVIELVE EL TOKEN COMO: data.token o data.accessToken
  if (data?.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const registerRequest = async (
  payload
) => {
  const { data } = await api.post(
    '/auth/register',
    payload
  );

  return data;
};
// ======================================
// VERIFICAR TOKEN ACTIVO (Al recargar)
// ======================================
export const verifyTokenRequest = async () => {
  // El interceptor de api.js adjuntará el token automáticamente en las cabeceras
  const { data } = await api.get('/auth/verify');
  return data;
};