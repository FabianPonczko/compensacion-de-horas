// src/routes/sabado.routes.js

import express from 'express';

import {
  crearSabado,
  obtenerSabados,
  obtenerSabadoPorId,
  actualizarSabado,
  eliminarSabado,
  obtenerSabadosPendientes,
} from '../controllers/sabado.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ======================================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ======================================================

// ------------------------------------------------------
// CREAR SÁBADO
// POST /api/sabados
// ------------------------------------------------------

router.post(
  '/',
  protect,
  crearSabado
);

// ------------------------------------------------------
// OBTENER TODOS LOS SÁBADOS
// GET /api/sabados
// ------------------------------------------------------

router.get(
  '/',
  protect,
  obtenerSabados
);

// ------------------------------------------------------
// OBTENER SÁBADOS PENDIENTES
// GET /api/sabados/pendientes
// ------------------------------------------------------

router.get(
  '/pendientes',
  protect,
  obtenerSabadosPendientes
);

// ------------------------------------------------------
// OBTENER SÁBADO POR ID
// GET /api/sabados/:id
// ------------------------------------------------------

router.get(
  '/:id',
  protect,
  obtenerSabadoPorId
);

// ------------------------------------------------------
// ACTUALIZAR SÁBADO
// PUT /api/sabados/:id
// ------------------------------------------------------

router.put(
  '/:id',
  protect,
  actualizarSabado
);

// ------------------------------------------------------
// ELIMINAR SÁBADO
// DELETE /api/sabados/:id
// ------------------------------------------------------

router.delete(
  '/:id',
  protect,
  eliminarSabado
);

export default router;