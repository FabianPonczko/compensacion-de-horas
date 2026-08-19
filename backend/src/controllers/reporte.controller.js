// src/controllers/reporte.controller.js

import dayjs from 'dayjs';

import RegistroDiario from '../models/RegistroDiario.js';
import SabadoCompensable from '../models/SabadoCompensable.js';

// ======================================================
// REPORTE RESUMEN GENERAL
// GET /api/reportes/resumen
// ======================================================

// export const obtenerResumen = async (req, res) => {
//   try {
//     const usuarioId = req.user._id;

//     // ==========================================
//     // OBTENER REGISTROS
//     // ==========================================

//     const registros = await RegistroDiario.find({
//       usuario: usuarioId,
//     })
//       .populate('sabadoAsignado')
//       .sort({ fecha: -1 });

//     // ==========================================
//     // OBTENER SÁBADOS
//     // ==========================================

//     const sabados = await SabadoCompensable.find({
//       usuario: usuarioId,
//     }).sort({ fecha: 1 });

//     // ==========================================
//     // CALCULAR TOTALES
//     // ==========================================

//     const totalHorasTrabajadas = registros.reduce(
//       (acc, registro) =>
//         acc + registro.horasTrabajadas,
//       0
//     );

//     const totalHorasExtras = registros.reduce(
//       (acc, registro) =>
//         acc + registro.horasExtras,
//       0
//     );

//     const totalHorasCompensadas = sabados.reduce(
//       (acc, sabado) =>
//         acc +
//         (sabado.horasTotales -
//           sabado.horasRestantes),
//       0
//     );

//     // ==========================================
//     // ESTADOS DE SÁBADOS
//     // ==========================================

//     const sabadosPendientes = sabados.filter(
//       (s) => s.estado === 'Pendiente'
//     ).length;

//     const sabadosParciales = sabados.filter(
//       (s) => s.estado === 'Parcial'
//     ).length;

//     const sabadosCompletados = sabados.filter(
//       (s) => s.estado === 'Completado'
//     ).length;

//     // ==========================================
//     // ÚLTIMOS REGISTROS
//     // ==========================================

//     const ultimosRegistros = registros
//       .slice(0, 5)
//       .map((registro) => ({
//         id: registro._id,
//         fecha: dayjs(registro.fecha).format(
//           'DD/MM/YYYY'
//         ),
//         horasTrabajadas:
//           registro.horasTrabajadas,
//         horasExtras: registro.horasExtras,
//       }));

//     // ==========================================
//     // PRÓXIMOS SÁBADOS PENDIENTES
//     // ==========================================

//     const proximosSabados = sabados
//       .filter((s) => s.estado !== 'Completado')
//       .slice(0, 5)
//       .map((sabado) => ({
//         id: sabado._id,
//         fecha: dayjs(sabado.fecha).format(
//           'DD/MM/YYYY'
//         ),
//         horasRestantes:
//           sabado.horasRestantes,
//         estado: sabado.estado,
//       }));

//     // ==========================================
//     // RESPUESTA FINAL
//     // ==========================================

//     res.status(200).json({
//       success: true,

//       resumen: {
//         totalHorasTrabajadas,
//         totalHorasExtras,
//         totalHorasCompensadas,

//         sabadosPendientes,
//         sabadosParciales,
//         sabadosCompletados,
//       },

//       ultimosRegistros,

//       proximosSabados,

//       registros,

//       sabados,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message:
//         'Error al generar reporte resumen',
//     });
//   }
// };

// ======================================================
// REPORTE MENSUAL
// GET /api/reportes/mensual?mes=5&anio=2026
// ======================================================

export const obtenerReporteMensual = async (
  req,
  res
) => {
  try {
    const usuarioId = req.user._id;

    const mes = Number(req.query.mes);
    const anio = Number(req.query.anio);

    if (!mes || !anio) {
      return res.status(400).json({
        success: false,
        message:
          'Mes y año son obligatorios',
      });
    }

    // ==========================================
    // RANGO DE FECHAS
    // ==========================================

    const inicio = dayjs(
      `${anio}-${mes}-01`
    )
      .startOf('month')
      .toDate();

    const fin = dayjs(
      `${anio}-${mes}-01`
    )
      .endOf('month')
      .toDate();

    // ==========================================
    // OBTENER REGISTROS
    // ==========================================

    const registros = await RegistroDiario.find({
      usuario: usuarioId,
      fecha: {
        $gte: inicio,
        $lte: fin,
      },
    }).sort({ fecha: 1 });

    // ==========================================
    // TOTALES
    // ==========================================

    const totalHoras = registros.reduce(
      (acc, item) =>
        acc + item.horasTrabajadas,
      0
    );

    const totalExtras = registros.reduce(
      (acc, item) =>
        acc + item.horasExtras,
      0
    );

    // ==========================================
    // RESPUESTA
    // ==========================================

    res.status(200).json({
      success: true,

      periodo: {
        mes,
        anio,
      },

      resumen: {
        totalHoras,
        totalExtras,
        cantidadRegistros:
          registros.length,
      },

      registros,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al generar reporte mensual',
    });
  }
};

// ======================================================
// REPORTE DETALLADO DE SÁBADOS
// GET /api/reportes/sabados
// ======================================================

export const obtenerReporteSabados =
  async (req, res) => {
    try {
      const usuarioId = req.user._id;

      const sabados =
        await SabadoCompensable.find({
          usuario: usuarioId,
        }).sort({
          fecha: 1,
        });

      const resultado = sabados.map(
        (sabado) => ({
          id: sabado._id,

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
          'Error al generar reporte de sábados',
      });
    }
    
  };
  

import {
  generarReportePDF,
  generarReporteExcel,
} from '../services/reporte.service.js';


// ======================================================
// RESUMEN DASHBOARD
// ======================================================

export const obtenerResumen =
  async (req, res) => {
    try {
      // ==========================================
      // REGISTROS
      // ==========================================

      const registros =
        await RegistroDiario.find({
          usuario: req.user._id,
        })
          .populate(
            'sabadoAsignado'
          )
          .sort({
            fecha: -1,
          });

      // ==========================================
      // TOTALES
      // ==========================================

      const totalHoras =
        registros.reduce(
          (acc, r) =>
            acc +
            r.horasTrabajadas,
          0
        );

      const totalExtras =
        registros.reduce(
          (acc, r) =>
            acc +
            r.horasExtras,
          0
        );

      // ==========================================
      // SÁBADOS PENDIENTES
      // ==========================================

      const sabadosPendientes =
        await SabadoCompensable.find({
          usuario: req.user._id,

          estado: {
            $ne: 'Completado',
          },
        }).sort({
          fecha: 1,
        });

      // ==========================================
      // ÚLTIMOS REGISTROS
      // ==========================================

      const ultimosRegistros =
        registros
          .slice(0, 5)
          .map((registro) => ({
            id: registro._id,

            fecha: dayjs(
              registro.fecha
            ).format(
              'DD/MM/YYYY'
            ),

            horasTrabajadas:
              registro.horasTrabajadas,

            horasExtras:
              registro.horasExtras,
          }));

      // ==========================================
      // PRÓXIMOS SÁBADOS
      // ==========================================

      const proximosSabados =
        sabadosPendientes.map(
          (sabado) => ({
            id: sabado._id,

            fecha: dayjs(
              sabado.fecha
            ).format(
              'DD/MM/YYYY'
            ),

            estado:
              sabado.estado,

            horasRestantes:
              sabado.horasRestantes,
          })
        );

      // ==========================================
      // RESPONSE
      // ==========================================

      res.json({
        totalRegistros:
          registros.length,

        totalHoras,

        totalExtras,

        totalHorasCompensadas:
          totalExtras,

        sabadosPendientes:
          sabadosPendientes.length,

        proximosSabados,

        ultimosRegistros,

        presentado:sabadoAsignado.presentado
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ======================================================
// PDF
// ======================================================

export const descargarPDF =
  async (req, res) => {
    try {
      const registros =
        await RegistroDiario.find({
          usuario: req.user._id,
        }).populate(
          'sabadoAsignado'
        );

      await generarReportePDF(
        registros,
        res
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ======================================================
// EXCEL
// ======================================================

export const descargarExcel =
  async (req, res) => {
    try {
      const registros =
        await RegistroDiario.find({
          usuario: req.user._id,
        }).populate(
          'sabadoAsignado'
        );

      await generarReporteExcel(
        registros,
        res
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ====================
// Sabado compemsables
//=====================

export const obtenerSabadosCompletados = async (
  req,
  res
) => {
  try {
    const sabados =
      await SabadoCompensable.find({
        usuario: req.user._id,
        estado: 'Completado',
      }).sort({
        fecha: -1,
      });

    res.json({
      success: true,
      total: sabados.length,
      sabados,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        'Error al obtener los sábados completados',
    });
  }
};

export const obtenerReporteSabado =
  async (req, res) => {
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
          message:
            'Sábado no encontrado',
        });
      }

      const registros =
        await RegistroDiario.find({
          usuario: req.user._id,
          sabadoAsignado: id,
        }).sort({
          fecha: 1,
        });

      const totalHoras =
        registros.reduce(
          (total, registro) =>
            total +
            registro.horasTrabajadas,
          0
        );

      const totalExtras =
        registros.reduce(
          (total, registro) =>
            total +
            registro.horasExtras,
          0
        );

      const totalCompensadas =
        registros.reduce(
          (total, registro) =>
            total +
            (registro.horasCompensadas ||
              registro.horasExtras),
          0
        );

      res.json({
        success: true,

        sabado,

        resumen: {
          totalRegistros:
            registros.length,

          totalHoras,

          totalExtras,

          totalHorasCompensadas:
            totalCompensadas,
        },

        registros,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          'Error al obtener el reporte',
      });
    }
  };

// ======================================================
// REPORTE DE VARIOS SÁBADOS
// POST /api/reportes/seleccion
// ======================================================

export const obtenerReporteSeleccion = async (
  req,
  res
) => {
  try {

    const { sabados } = req.body;

    if (
      !sabados ||
      !sabados.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Seleccione al menos un sábado',
      });
    }

    const registros =
      await RegistroDiario.find({
        usuario: req.user._id,

        sabadoAsignado: {
          $in: sabados,
        },
      })
        .populate(
          'sabadoAsignado'
        )
        .sort({
          fecha: 1,
        });

    const totalHoras =
      registros.reduce(
        (t, r) =>
          t + r.horasTrabajadas,
        0
      );

    const totalExtras =
      registros.reduce(
        (t, r) =>
          t + r.horasExtras,
        0
      );

    const totalCompensadas =
      registros.reduce(
        (t, r) =>
          t +
          (r.horasCompensadas ??
            r.horasExtras),
        0
      );

    const sabadosDetalle =
      await SabadoCompensable.find({
        _id: {
          $in: sabados,
        },
      }).sort({
        fecha: 1,
      });

    res.json({

      success: true,

      resumen: {

        totalRegistros:
          registros.length,

        totalHoras,

        totalExtras,

        totalHorasCompensadas:
          totalCompensadas,

        cantidadSabados:
          sabadosDetalle.length,
      },

      sabados:
        sabadosDetalle,

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