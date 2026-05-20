// ======================================================
// src/utils/calcularHoras.js
// ======================================================

export const calcularHoras = (
  entrada,
  salida
) => {
  const [h1, m1] =
    entrada.split(':');

  const [h2, m2] =
    salida.split(':');

  const inicio =
    Number(h1) * 60 +
    Number(m1);

  const fin =
    Number(h2) * 60 +
    Number(m2);

  return (
    (fin - inicio) / 60
  );
};