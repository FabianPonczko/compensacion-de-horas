// ======================================================
// src/controllers/registro.controller.js
// ======================================================

import RegistroDiario from '../models/RegistroDiario.js';

import SabadoCompensable from '../models/SabadoCompensable.js';

import {
  calcularHoras,
} from '../utils/calcularHoras.js';

import {
  compensarHoras,
} from '../services/compensacion.service.js';

// ======================================================
// CREAR REGISTRO
// ======================================================

export const crearRegistro = async (
  req,
  res
) => {
  try {
    const {
      fecha,
      horaEntrada,
      horaSalida,
      observaciones,
      sabadoAsignado,
    } = req.body;

    // ======================================
    // VALIDACIONES
    // ======================================

    if (
      !fecha ||
      !horaEntrada ||
      !horaSalida
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Campos obligatorios faltantes',
      });
    }

    // ======================================
    // CALCULAR HORAS
    // ======================================

    const horasTrabajadas =
      calcularHoras(
        horaEntrada,
        horaSalida
      );

    // ======================================
    // HORAS EXTRAS
    // ======================================

    const horasExtras =
      horasTrabajadas > 8
        ? horasTrabajadas - 8
        : 0;

    // ======================================
    // HORARIO EXTRA
    // ======================================

    let horaExtraDesde = null;

    let horaExtraHasta = null;

    if (horasExtras > 0) {
      const [h, m] =
        horaEntrada.split(':');

      const inicioMinutos =
        Number(h) * 60 +
        Number(m);

      // Jornada normal = 8h
      const finJornada =
        inicioMinutos + 8 * 60;

      horaExtraDesde =
        `${String(
          Math.floor(
            finJornada / 60
          )
        ).padStart(2, '0')}:${String(
          finJornada % 60
        ).padStart(2, '0')}`;

      horaExtraHasta =
        horaSalida;
    }

    // ======================================
    // COMPENSACIÓN
    // ======================================

    let sabado = null;

    let horaCompensadaDesde =
      null;

    let horaCompensadaHasta =
      null;

    if (horasExtras > 0) {
      const compensacion =
        await compensarHoras({
          usuarioId:
            req.user._id,

          horasExtras,

          sabadoId:
            sabadoAsignado,
        });

      sabado =
        compensacion.sabado;

      horaCompensadaDesde =
        compensacion.desde;

      horaCompensadaHasta =
        compensacion.hasta;
    }

    // ======================================
    // CREAR REGISTRO
    // ======================================

    const registro =
      await RegistroDiario.create({
        usuario: req.user._id,

        fecha,

        horaEntrada,

        horaSalida,

        horasTrabajadas,

        horasExtras,

        // HORARIO EXTRA
        horaExtraDesde,

        horaExtraHasta,

        // SÁBADO
        sabadoAsignado:
          sabado?._id,

        // HORARIO COMPENSADO
        horaCompensadaDesde,

        horaCompensadaHasta,

        observaciones,
      });

    // ======================================
    // RESPUESTA
    // ======================================

    res.status(201).json({
      success: true,
      registro,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// OBTENER REGISTROS
// ======================================================

export const obtenerRegistros =
  async (req, res) => {
    try {
      const registros =
        await RegistroDiario.find({
          usuario: req.user._id,
        })
          .populate(
            'sabadoAsignado'
          )
          .sort({ fecha: -1 });

      res.status(200).json({
        success: true,

        total:
          registros.length,

        registros,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// ======================================================
// ELIMINAR REGISTRO
// ======================================================

export const eliminarRegistro =
  async (req, res) => {
    try {
      const { id } = req.params;

      const registro =
        await RegistroDiario.findOne({
          _id: id,
          usuario: req.user._id,
        });

      if (!registro) {
        return res.status(404).json({
          success: false,
          message:
            'Registro no encontrado',
        });
      }

      // ======================================
      // DEVOLVER HORAS AL SÁBADO
      // ======================================

      if (
        registro.sabadoAsignado &&
        registro.horasExtras > 0
      ) {
        const sabado =
          await SabadoCompensable.findById(
            registro.sabadoAsignado
          );

        if (sabado) {
          sabado.horasRestantes +=
            registro.horasExtras;

          // ======================================
          // RECALCULAR PRÓXIMA HORA
          // ======================================

          sabado.proximaHoraDisponible =
            registro.horaCompensadaDesde ||
            sabado.horaInicio;

          // ======================================
          // ESTADO
          // ======================================

          if (
            sabado.horasRestantes >=
            sabado.horasTotales
          ) {
            sabado.estado =
              'Pendiente';
          } else {
            sabado.estado =
              'Parcial';
          }

          await sabado.save();
        }
      }

      // ======================================
      // ELIMINAR
      // ======================================

      await registro.deleteOne();

      res.status(200).json({
        success: true,
        message:
          'Registro eliminado correctamente',
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Error al eliminar registro',
      });
    }
    //ultimo cambio
  };