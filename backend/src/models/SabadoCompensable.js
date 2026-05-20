// ======================================================
// src/models/SabadoCompensable.js
// ======================================================

import mongoose from 'mongoose';

const sabadoCompensableSchema =
  new mongoose.Schema(
    {
      usuario: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'Usuario',

        required: true,
      },

      fecha: {
        type: String,
        required: true,
      },

      // ======================================
      // HORARIO
      // ======================================

      horaInicio: {
        type: String,
        default: '06:00',
      },

      horaFin: {
        type: String,
        default: '10:00',
      },

      // ======================================
      // SIGUIENTE HORA DISPONIBLE
      // ======================================

      proximaHoraDisponible: {
        type: String,
        default: '06:00',
      },

      // ======================================
      // HORAS
      // ======================================

      horasTotales: {
        type: Number,
        default: 4,
      },

      horasRestantes: {
        type: Number,
        default: 4,
      },

      // ======================================
      // ESTADO
      // ======================================

      estado: {
        type: String,

        enum: [
          'Pendiente',
          'Parcial',
          'Completado',
        ],

        default: 'Pendiente',
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  'SabadoCompensable',
  sabadoCompensableSchema
);