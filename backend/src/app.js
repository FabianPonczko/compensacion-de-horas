// src/app.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes.js';
import registroRoutes from './routes/registro.routes.js';
import sabadoRoutes from './routes/sabado.routes.js';
import reporteRoutes from './routes/reporte.routes.js';

import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// ======================================
// MIDDLEWARES GLOBALES
// ======================================

// Seguridad HTTP
app.use(helmet());

// Permitir peticiones externas
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Logs HTTP
app.use(morgan('dev'));

// Parsear JSON
app.use(express.json());

// Parsear formularios
app.use(express.urlencoded({ extended: true }));

// ======================================
// HEALTH CHECK
// ======================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Banco de Horas funcionando',
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

// ======================================
// RUTAS API
// ======================================

app.use('/api/auth', authRoutes);

app.use('/api/registros', registroRoutes);

app.use('/api/sabados', sabadoRoutes);

app.use('/api/reportes', reporteRoutes);

// ======================================
// RUTA NO ENCONTRADA
// ======================================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// ======================================
// MANEJO GLOBAL DE ERRORES
// ======================================

app.use(errorHandler);

export default app;