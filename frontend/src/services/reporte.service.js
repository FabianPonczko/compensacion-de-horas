// ======================================================
// src/services/reporte.service.js
// REPORTES IGUAL AL HISTORIAL
// ======================================================

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';

import dayjs from 'dayjs';

import api from './api';

// ======================================================
// OBTENER RESUMEN
// ======================================================

export const obtenerResumen =
  async () => {
    const { data } =
      await api.get(
        '/reportes/resumen'
      );

    return data;
    
  };

// ============================================
// SÁBADOS COMPLETADOS
// ============================================

export const obtenerSabadosCompletados =
  async () => {
    const { data } =
      await api.get(
        '/reportes/sabados-completados'
      );

    return data;
  };

// ============================================
// REPORTE POR SÁBADO
// ============================================

export const obtenerReporteSabado =
  async (id) => {
    const { data } =
      await api.get(
        `/reportes/sabado/${id}`
      );

    return data;
  };

// ======================================================
// PDF
// ======================================================

export const descargarPDF =
  async () => {
    const response =
      await api.get(
        '/reportes/pdf',
        {
          responseType: 'blob',
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'reporte.pdf'
    );

    document.body.appendChild(
      link
    );

    link.click();
  };

// ======================================================
// EXCEL
// ======================================================

export const descargarExcel =
  async () => {
    const response =
      await api.get(
        '/reportes/excel',
        {
          responseType: 'blob',
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([response.data])
      );

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'reporte.xlsx'
    );

    document.body.appendChild(
      link
    );

    link.click();
  };
// ======================================================
// PDF
// ======================================================

export const generarPDF = (
  registros
) => {
  const doc = new jsPDF(
    'landscape'
  );

  // ======================================
  // HEADER
  // ======================================

  doc.setFontSize(20);

  doc.text(
    'Banco de Horas',
    14,
    18
  );

  doc.setFontSize(11);

  doc.text(
    `Generado: ${dayjs().format(
      'DD/MM/YYYY HH:mm'
    )}`,
    14,
    28
  );

  // ======================================
  // TOTAL HORAS
  // ======================================

  const totalExtras =
    registros.reduce(
      (acc, r) =>
        acc + r.horasExtras,
      0
    );

  doc.text(
    `Horas extra acumuladas: ${totalExtras}h`,
    14,
    38
  );

  // ======================================
  // TABLA
  // ======================================

  autoTable(doc, {
    startY: 45,

    theme: 'grid',

    styles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
    },

    headStyles: {
      fillColor: [25, 25, 25],
      textColor: 255,
      fontStyle: 'bold',
    },

    bodyStyles: {
      textColor: 40,
    },

    head: [
      [
        'Fecha',
        'Jornada',
        'Horas',
        'Horario Extra',
        'Sábado',
        'Compensado',
        'Estado',
      ],
    ],

    body: registros.map(
      (registro) => [
        // FECHA
        dayjs(
          registro.fecha
        ).format(
          'DD/MM/YYYY'
        ),

        // JORNADA
        `${registro.horaEntrada} → ${registro.horaSalida}`,

        // HORAS
        `${registro.horasTrabajadas}h\n+${registro.horasExtras}h extra`,

        // EXTRA
        registro.horaExtraDesde
          ? `${registro.horaExtraDesde} → ${registro.horaExtraHasta}`
          : '-',

        // SÁBADO
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

        // COMPENSADO
        registro.horaCompensadaDesde
          ? `${registro.horaCompensadaDesde} → ${registro.horaCompensadaHasta}`
          : '-',

        // ESTADO
        registro.horasExtras >
        0
          ? 'Compensado'
          : 'Normal',
      ]
    ),

    columnStyles: {
      0: { cellWidth: 28 },

      1: { cellWidth: 42 },

      2: { cellWidth: 32 },

      3: { cellWidth: 42 },

      4: { cellWidth: 32 },

      5: { cellWidth: 42 },

      6: { cellWidth: 28 },
    },
  });

  // ======================================
  // FOOTER
  // ======================================

  const pages =
    doc.internal.getNumberOfPages();

  for (
    let i = 1;
    i <= pages;
    i++
  ) {
    doc.setPage(i);

    doc.setFontSize(9);

    doc.text(
      `Página ${i} de ${pages}`,
      250,
      200
    );
  }

  // ======================================
  // DESCARGAR
  // ======================================

  doc.save(
    `reporte_banco_horas_${dayjs().format(
      'YYYYMMDD_HHmm'
    )}.pdf`
  );
};

// ======================================================
// EXCEL
// ======================================================

export const generarExcel = (
  registros
) => {
  // ======================================
  // DATA
  // ======================================

  const data = registros.map(
    (registro) => ({
      Fecha: dayjs(
        registro.fecha
      ).format('DD/MM/YYYY'),

      Jornada: `${registro.horaEntrada} → ${registro.horaSalida}`,

      Horas: `${registro.horasTrabajadas}h`,

      Extras: `+${registro.horasExtras}h`,

      'Horario Extra':
        registro.horaExtraDesde
          ? `${registro.horaExtraDesde} → ${registro.horaExtraHasta}`
          : '-',

      Sábado:
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

      Compensado:
        registro.horaCompensadaDesde
          ? `${registro.horaCompensadaDesde} → ${registro.horaCompensadaHasta}`
          : '-',

      Estado:
        registro.horasExtras >
        0
          ? 'Compensado'
          : 'Normal',
    })
  );

  // ======================================
  // SHEET
  // ======================================

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    );

  // ======================================
  // COLUMNAS
  // ======================================

  worksheet['!cols'] = [
    { wch: 15 },

    { wch: 25 },

    { wch: 12 },

    { wch: 12 },

    { wch: 25 },

    { wch: 15 },

    { wch: 25 },

    { wch: 15 },
  ];

  // ======================================
  // WORKBOOK
  // ======================================

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Historial'
  );

  // ======================================
  // EXPORTAR
  // ======================================

  XLSX.writeFile(
    workbook,
    `reporte_banco_horas_${dayjs().format(
      'YYYYMMDD_HHmm'
    )}.xlsx`
  );
};