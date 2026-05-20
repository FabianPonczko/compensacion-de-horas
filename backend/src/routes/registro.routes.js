// ======================================================
// src/routes/registro.routes.js
// ======================================================

import express from 'express';

import {
  crearRegistro,
  obtenerRegistros,
  eliminarRegistro,
} from '../controllers/registro.controller.js';

import {
  protect,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// ======================================
// CREAR
// ======================================

router.post(
  '/',
  protect,
  crearRegistro
);

// ======================================
// OBTENER
// ======================================

router.get(
  '/',
  protect,
  obtenerRegistros
);

// ======================================
// ELIMINAR
// ======================================

router.delete(
  '/:id',
  protect,
  eliminarRegistro
);

export default router;