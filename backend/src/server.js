import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';

// Conectar a la base de datos (Vercel permite Top-Level Await)
await connectDB();

// IMPORTANTE: Exporta la app para que Vercel la maneje
export default app;
