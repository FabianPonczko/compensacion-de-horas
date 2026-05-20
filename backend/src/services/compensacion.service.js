// ======================================================
// src/services/compensacion.service.js
// ======================================================

import SabadoCompensable from '../models/SabadoCompensable.js';

// ======================================================
// COMPENSAR HORAS
// ======================================================

export const compensarHoras =
  async ({
    usuarioId,
    horasExtras,
    sabadoId,
  }) => {
    let sabado;

    // ======================================
    // SÁBADO MANUAL
    // ======================================

    if (sabadoId) {
      sabado =
        await SabadoCompensable.findOne({
          _id: sabadoId,
          usuario: usuarioId,
        });
    }

    // ======================================
    // AUTOMÁTICO
    // ======================================

    if (!sabado) {
      sabado =
        await SabadoCompensable.findOne({
          usuario: usuarioId,

          estado: {
            $ne: 'Completado',
          },
        }).sort({
          fecha: 1,
        });
    }

    // ======================================
    // VALIDAR
    // ======================================

    if (!sabado) {
      throw new Error(
        'No existen sábados disponibles'
      );
    }

    // ======================================
    // VALIDAR HORAS
    // ======================================

    if (
      horasExtras >
      sabado.horasRestantes
    ) {
      throw new Error(
        `El sábado solo tiene ${sabado.horasRestantes}h disponibles`
      );
    }

    // ======================================
    // CALCULAR HORARIO COMPENSADO
    // ======================================

    const horaInicio =
      sabado.proximaHoraDisponible;

    const [h, m] =
      horaInicio.split(':');

    const minutosInicio =
      Number(h) * 60 +
      Number(m);

    const minutosFin =
      minutosInicio +
      horasExtras * 60;

    const horaFin =
      `${String(
        Math.floor(minutosFin / 60)
      ).padStart(2, '0')}:${String(
        minutosFin % 60
      ).padStart(2, '0')}`;

    // ======================================
    // ACTUALIZAR HORAS
    // ======================================

    sabado.horasRestantes -=
      horasExtras;

    sabado.proximaHoraDisponible =
      horaFin;

    // ======================================
    // ESTADO
    // ======================================

    if (
      sabado.horasRestantes <= 0
    ) {
      sabado.estado =
        'Completado';

      sabado.horasRestantes = 0;
    } else {
      sabado.estado =
        'Parcial';
    }

    // ======================================
    // GUARDAR
    // ======================================

    await sabado.save();

    // ======================================
    // RETORNAR
    // ======================================

    return {
      sabado,

      desde: horaInicio,

      hasta: horaFin,
    };
  };