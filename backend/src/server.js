// src/server.js

import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import mongoose from 'mongoose';

import app from './app.js';
import { connectDB } from './config/db.js';

// ======================================
// CONFIGURACIÓN GENERAL
// ======================================

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ======================================
// CONEXIÓN A MONGODB
// ======================================

await connectDB();

// ======================================
// CREAR SERVIDOR HTTP
// ======================================

const server = http.createServer(app);

// ======================================
// INICIAR SERVIDOR
// ======================================

server.listen(PORT, () => {
  console.log('===================================');
  console.log(`🚀 Servidor iniciado`);
  console.log(`🌍 Entorno: ${NODE_ENV}`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log('===================================');
});

// ======================================
// MANEJO DE ERRORES NO CAPTURADOS
// ======================================

// Captura errores async no manejados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection');
  console.error(error);

  server.close(() => {
    process.exit(1);
  });
});

// Captura excepciones no controladas
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception');
  console.error(error);

  process.exit(1);
});

// ======================================
// CIERRE LIMPIO DE MONGODB
// ======================================

process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');

  await mongoose.connection.close();

  console.log('✅ MongoDB desconectado');

  process.exit(0);
});