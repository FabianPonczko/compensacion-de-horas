import express from 'express';

import {
  obtenerResumen,
  obtenerReporteMensual,
  obtenerReporteSabados,
  descargarPDF,
  descargarExcel,
} from '../controllers/reporte.controller.js';

import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ======================================================
// RESUMEN GENERAL
// ======================================================

router.get(
  '/resumen',
  protect,
  obtenerResumen
);

// ======================================================
// REPORTE MENSUAL
// ======================================================

router.get(
  '/mensual',
  protect,
  obtenerReporteMensual
);

// ======================================================
// SÁBADOS
// ======================================================

router.get(
  '/sabados',
  protect,
  obtenerReporteSabados
);

// ======================================================
// EXPORTACIONES
// ======================================================

router.get(
  '/pdf',
  protect,
  descargarPDF
);

router.get(
  '/excel',
  protect,
  descargarExcel
);

export default router;