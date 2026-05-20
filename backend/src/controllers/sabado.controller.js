// src/controllers/sabado.controller.js

import dayjs from 'dayjs';

import SabadoCompensable from '../models/SabadoCompensable.js';

// ======================================================
// CREAR SÁBADO COMPENSABLE
// POST /api/sabados
// ======================================================

export const crearSabado = async (req, res) => {
  try {
    const usuarioId = req.user._id;

    const { fecha } = req.body;

    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es obligatoria',
      });
    }

    // Validar que sea sábado
    const diaSemana = dayjs(fecha).day();

    if (diaSemana !== 6) {
      return res.status(400).json({
        success: false,
        message:
          'La fecha seleccionada no corresponde a un sábado',
      });
    }

    // ==========================================
    // VALIDAR DUPLICADOS
    // ==========================================

    const existe = await SabadoCompensable.findOne({
      usuario: usuarioId,
      fecha,
    });

    if (existe) {
      return res.status(400).json({
        success: false,
        message:
          'Ya existe un sábado registrado para esa fecha',
      });
    }

    // ==========================================
    // CREAR SÁBADO
    // ==========================================

    const sabado = await SabadoCompensable.create({
      usuario: usuarioId,

      fecha,

      horasTotales: 4,

      horasRestantes: 4,

      estado: 'Pendiente',
    });

    // ==========================================
    // RESPUESTA
    // ==========================================

    res.status(201).json({
      success: true,
      message:
        'Sábado compensable creado correctamente',
      sabado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al crear sábado compensable',
    });
  }
};

// ======================================================
// OBTENER TODOS LOS SÁBADOS
// GET /api/sabados
// ======================================================

export const obtenerSabados = async (
  req,
  res
) => {
  try {
    const usuarioId = req.user._id;

    const sabados =
      await SabadoCompensable.find({
        usuario: usuarioId,
      }).sort({
        fecha: 1,
      });

    // ==========================================
    // FORMATEAR RESPUESTA
    // ==========================================

    const resultado = sabados.map(
      (sabado) => ({
        _id: sabado._id,

        fecha: dayjs(sabado.fecha).format(
          'DD/MM/YYYY'
        ),

        horasTotales:
          sabado.horasTotales,

        horasRestantes:
          sabado.horasRestantes,

        horasCompensadas:
          sabado.horasTotales -
          sabado.horasRestantes,

        estado: sabado.estado,

        progreso:
          ((sabado.horasTotales -
            sabado.horasRestantes) /
            sabado.horasTotales) *
          100,
      })
    );

    res.status(200).json({
      success: true,
      total: resultado.length,
      sabados: resultado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al obtener sábados',
    });
  }
};

// ======================================================
// OBTENER SÁBADO POR ID
// GET /api/sabados/:id
// ======================================================

export const obtenerSabadoPorId = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const sabado =
      await SabadoCompensable.findOne({
        _id: id,
        usuario: req.user._id,
      });

    if (!sabado) {
      return res.status(404).json({
        success: false,
        message: 'Sábado no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      sabado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al obtener sábado',
    });
  }
};

// ======================================================
// ACTUALIZAR SÁBADO
// PUT /api/sabados/:id
// ======================================================

export const actualizarSabado = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { fecha } = req.body;

    // ==========================================
    // BUSCAR SÁBADO
    // ==========================================

    const sabado =
      await SabadoCompensable.findOne({
        _id: id,
        usuario: req.user._id,
      });

    if (!sabado) {
      return res.status(404).json({
        success: false,
        message: 'Sábado no encontrado',
      });
    }

    // ==========================================
    // VALIDAR NUEVA FECHA
    // ==========================================

    if (fecha) {
      const diaSemana = dayjs(fecha).day();

      if (diaSemana !== 6) {
        return res.status(400).json({
          success: false,
          message:
            'La fecha debe ser sábado',
        });
      }

      sabado.fecha = fecha;
    }

    // ==========================================
    // GUARDAR CAMBIOS
    // ==========================================

    await sabado.save();

    res.status(200).json({
      success: true,
      message:
        'Sábado actualizado correctamente',
      sabado,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al actualizar sábado',
    });
  }
};

// ======================================================
// ELIMINAR SÁBADO
// DELETE /api/sabados/:id
// ======================================================

export const eliminarSabado = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const sabado =
      await SabadoCompensable.findOne({
        _id: id,
        usuario: req.user._id,
      });

    if (!sabado) {
      return res.status(404).json({
        success: false,
        message: 'Sábado no encontrado',
      });
    }

    // ==========================================
    // VALIDAR SI YA TIENE COMPENSACIONES
    // ==========================================

    const parcialmenteCompensado =
      sabado.horasRestantes > 0 &&
      sabado.horasRestantes <
      sabado.horasTotales;

  if (parcialmenteCompensado) {
    return res.status(400).json({
      success: false,
      message:
        'No se puede eliminar un sábado parcialmente compensado',
    });
  }

    await sabado.deleteOne();

    res.status(200).json({
      success: true,
      message:
        'Sábado eliminado correctamente',
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al eliminar sábado',
    });
  }
};

// ======================================================
// OBTENER SÁBADOS PENDIENTES
// GET /api/sabados/pendientes
// ======================================================

export const obtenerSabadosPendientes =
  async (req, res) => {
    try {
      const sabados =
        await SabadoCompensable.find({
          usuario: req.user._id,

          estado: {
            $ne: 'Completado',
          },
        }).sort({
          fecha: 1,
        });

      res.status(200).json({
        success: true,
        total: sabados.length,
        sabados,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Error al obtener sábados pendientes',
      });
    }
  };