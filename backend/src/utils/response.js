// src/utils/response.js

// ======================================================
// RESPUESTA EXITOSA
// ======================================================

export const successResponse = (
  res,
  {
    statusCode = 200,
    message = 'Operación exitosa',
    data = null,
    meta = null,
  } = {}
) => {
  return res.status(statusCode).json({
    success: true,

    message,

    data,

    meta,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA DE ERROR
// ======================================================

export const errorResponse = (
  res,
  {
    statusCode = 500,
    message = 'Error interno del servidor',
    error = null,
  } = {}
) => {
  return res.status(statusCode).json({
    success: false,

    message,

    error:
      process.env.NODE_ENV === 'development'
        ? error
        : undefined,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA PAGINADA
// ======================================================

export const paginatedResponse = (
  res,
  {
    statusCode = 200,
    message = 'Datos obtenidos correctamente',

    data = [],

    page = 1,

    limit = 10,

    total = 0,
  } = {}
) => {
  const totalPages = Math.ceil(
    total / limit
  );

  return res.status(statusCode).json({
    success: true,

    message,

    data,

    pagination: {
      page,

      limit,

      total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPrevPage: page > 1,
    },

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA CREATED
// ======================================================

export const createdResponse = (
  res,
  {
    message = 'Registro creado correctamente',
    data = null,
  } = {}
) => {
  return res.status(201).json({
    success: true,

    message,

    data,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA DE VALIDACIÓN
// ======================================================

export const validationResponse = (
  res,
  {
    message = 'Error de validación',
    errors = [],
  } = {}
) => {
  return res.status(400).json({
    success: false,

    message,

    errors,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA NO AUTORIZADO
// ======================================================

export const unauthorizedResponse = (
  res,
  message = 'No autorizado'
) => {
  return res.status(401).json({
    success: false,

    message,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA PROHIBIDO
// ======================================================

export const forbiddenResponse = (
  res,
  message = 'Acceso prohibido'
) => {
  return res.status(403).json({
    success: false,

    message,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA NO ENCONTRADO
// ======================================================

export const notFoundResponse = (
  res,
  message = 'Recurso no encontrado'
) => {
  return res.status(404).json({
    success: false,

    message,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA CONFLICTO
// ======================================================

export const conflictResponse = (
  res,
  message = 'Conflicto de datos'
) => {
  return res.status(409).json({
    success: false,

    message,

    timestamp: new Date(),
  });
};

// ======================================================
// RESPUESTA ELIMINADO
// ======================================================

export const deletedResponse = (
  res,
  message = 'Registro eliminado correctamente'
) => {
  return res.status(200).json({
    success: true,

    message,

    timestamp: new Date(),
  });
};