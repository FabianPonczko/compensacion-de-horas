// src/middlewares/error.middleware.js

// ======================================================
// MIDDLEWARE GLOBAL DE ERRORES
// ======================================================

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error('=================================');
  console.error('❌ ERROR');
  console.error(err);
  console.error('=================================');

  // ==========================================
  // ERROR MONGOOSE - OBJECT ID INVÁLIDO
  // ==========================================

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
    });
  }

  // ==========================================
  // ERROR MONGOOSE - DUPLICADOS
  // ==========================================

  if (err.code === 11000) {
    const field = Object.keys(
      err.keyValue
    )[0];

    return res.status(400).json({
      success: false,
      message: `El campo ${field} ya existe`,
    });
  }

  // ==========================================
  // ERROR VALIDACIÓN MONGOOSE
  // ==========================================

  if (err.name === 'ValidationError') {
    const errors = Object.values(
      err.errors
    ).map((e) => e.message);

    return res.status(400).json({
      success: false,
      message:
        'Error de validación',
      errors,
    });
  }

  // ==========================================
  // JWT INVÁLIDO
  // ==========================================

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  // ==========================================
  // JWT EXPIRADO
  // ==========================================

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // ==========================================
  // ERROR PERSONALIZADO
  // ==========================================

  const statusCode =
    err.statusCode || 500;

  const message =
    err.message ||
    'Error interno del servidor';

  // ==========================================
  // RESPUESTA FINAL
  // ==========================================

  return res.status(statusCode).json({
    success: false,

    message,

    stack:
      process.env.NODE_ENV ===
      'development'
        ? err.stack
        : undefined,
  });
};