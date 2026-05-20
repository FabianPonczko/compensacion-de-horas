// ======================================================
// backend/src/services/reporte.service.js
// ======================================================

import PDFDocument from 'pdfkit';

import ExcelJS from 'exceljs';

import dayjs from 'dayjs';

// ======================================================
// GENERAR PDF
// ======================================================

export const generarReportePDF =
  async (registros, res) => {
    const doc =
      new PDFDocument({
        margin: 30,
        size: 'A4',
        layout: 'landscape',
      });

    // ======================================
    // HEADERS
    // ======================================

    res.setHeader(
      'Content-Type',
      'application/pdf'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${Date.now()}.pdf`
    );

    doc.pipe(res);

    // ======================================
    // TITULO
    // ======================================

    doc
      .fontSize(20)
      .text(
        'Banco de Horas',
        {
          align: 'center',
        }
      );

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        `Generado: ${dayjs().format(
          'DD/MM/YYYY HH:mm'
        )}`
      );

    doc.moveDown(2);

    // ======================================
    // COLUMNAS
    // ======================================

    const startX = 30;

    let y = 120;

    const columnas = [
      {
        titulo: 'Fecha',
        x: startX,
      },

      {
        titulo: 'Jornada',
        x: 100,
      },

      {
        titulo: 'Horas',
        x: 210,
      },

      {
        titulo:
          'Horario Extra',
        x: 290,
      },

      {
        titulo: 'Sábado',
        x: 410,
      },

      {
        titulo:
          'Compensado',
        x: 500,
      },

      {
        titulo: 'Estado',
        x: 620,
      },
    ];

    // ======================================
    // HEADER TABLA
    // ======================================

    doc.fontSize(10);

    columnas.forEach((col) => {
      doc.text(
        col.titulo,
        col.x,
        y
      );
    });

    y += 20;

    doc.moveTo(30, y - 5)
      .lineTo(780, y - 5)
      .stroke();

    // ======================================
    // FILAS
    // ======================================

    registros.forEach(
      (registro) => {
        // FECHA
        doc.text(
          dayjs(
            registro.fecha
          ).format(
            'DD/MM/YYYY'
          ),
          startX,
          y
        );

        // JORNADA
        doc.text(
          `${registro.horaEntrada} → ${registro.horaSalida}`,
          100,
          y
        );

        // HORAS
        doc.text(
          `${registro.horasTrabajadas}h (+${registro.horasExtras}h)`,
          210,
          y
        );

        // HORARIO EXTRA
        doc.text(
          registro.horaExtraDesde
            ? `${registro.horaExtraDesde} → ${registro.horaExtraHasta}`
            : '-',
          290,
          y
        );

        // SABADO
        doc.text(
          registro
            .sabadoAsignado
            ?.fecha
            ? dayjs(
                registro
                  .sabadoAsignado
                  .fecha
              ).format(
                'DD/MM/YYYY'
              )
            : '-',
          410,
          y
        );

        // COMPENSADO
        doc.text(
          registro.horaCompensadaDesde
            ? `${registro.horaCompensadaDesde} → ${registro.horaCompensadaHasta}`
            : '-',
          500,
          y
        );

        // ESTADO
        doc.text(
          registro.horasExtras >
            0
            ? 'Compensado'
            : 'Normal',
          620,
          y
        );

        y += 25;

        // NUEVA PAGINA
        if (y > 520) {
          doc.addPage();

          y = 50;
        }
      }
    );

    // ======================================
    // TOTAL
    // ======================================

    const totalExtras =
      registros.reduce(
        (acc, r) =>
          acc + r.horasExtras,
        0
      );

    doc.moveDown(2);

    doc.text(
      `Horas extra acumuladas: ${totalExtras}h`
    );

    // ======================================
    // FINALIZAR
    // ======================================

    doc.end();
  };

// ======================================================
// GENERAR EXCEL
// ======================================================

export const generarReporteExcel =
  async (registros, res) => {
    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        'Banco de Horas'
      );

    // ======================================
    // COLUMNAS
    // ======================================

    worksheet.columns = [
      {
        header: 'Fecha',
        key: 'fecha',
        width: 15,
      },

      {
        header: 'Jornada',
        key: 'jornada',
        width: 25,
      },

      {
        header: 'Horas',
        key: 'horas',
        width: 15,
      },

      {
        header:
          'Horario Extra',
        key: 'extra',
        width: 25,
      },

      {
        header: 'Sábado',
        key: 'sabado',
        width: 20,
      },

      {
        header:
          'Compensado',
        key: 'compensado',
        width: 25,
      },

      {
        header: 'Estado',
        key: 'estado',
        width: 15,
      },
    ];

    // ======================================
    // ESTILO HEADER
    // ======================================

    worksheet.getRow(1).font = {
      bold: true,
    };

    // ======================================
    // FILAS
    // ======================================

    registros.forEach(
      (registro) => {
        worksheet.addRow({
          fecha: dayjs(
            registro.fecha
          ).format(
            'DD/MM/YYYY'
          ),

          jornada: `${registro.horaEntrada} → ${registro.horaSalida}`,

          horas: `${registro.horasTrabajadas}h (+${registro.horasExtras}h)`,

          extra:
            registro.horaExtraDesde
              ? `${registro.horaExtraDesde} → ${registro.horaExtraHasta}`
              : '-',

          sabado:
            registro
              .sabadoAsignado
              ?.fecha
              ? dayjs(
                  registro
                    .sabadoAsignado
                    .fecha
                ).format(
                  'DD/MM/YYYY'
                )
              : '-',

          compensado:
            registro.horaCompensadaDesde
              ? `${registro.horaCompensadaDesde} → ${registro.horaCompensadaHasta}`
              : '-',

          estado:
            registro.horasExtras >
            0
              ? 'Compensado'
              : 'Normal',
        });
      }
    );

    // ======================================
    // RESPONSE
    // ======================================

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${Date.now()}.xlsx`
    );

    // ======================================
    // WRITE
    // ======================================

    await workbook.xlsx.write(
      res
    );

    res.end();
  };