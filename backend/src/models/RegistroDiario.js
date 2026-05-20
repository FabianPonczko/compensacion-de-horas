// ======================================================
// src/models/RegistroDiario.js
// ======================================================

import mongoose from 'mongoose';

const registroDiarioSchema =
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

      horaEntrada: {
        type: String,
        required: true,
      },

      horaSalida: {
        type: String,
        required: true,
      },

      horasTrabajadas: {
        type: Number,
        required: true,
      },

      horasExtras: {
        type: Number,
        default: 0,
      },

      // ======================================
      // HORARIO EXTRA REAL
      // ======================================

      horaExtraDesde: {
        type: String,
      },

      horaExtraHasta: {
        type: String,
      },

      // ======================================
      // SÁBADO
      // ======================================

      sabadoAsignado: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: 'SabadoCompensable',
      },

      // ======================================
      // HORARIO COMPENSADO
      // ======================================

      horaCompensadaDesde: {
        type: String,
      },

      horaCompensadaHasta: {
        type: String,
      },

      observaciones: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  'RegistroDiario',
  registroDiarioSchema
);