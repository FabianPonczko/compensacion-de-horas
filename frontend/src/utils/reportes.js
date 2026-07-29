import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';

import dayjs from 'dayjs';

// ======================================
// PDF
// ======================================

export const generarPDFReporte = ({
  registros,
  resumen,
}) => {
  const doc = new jsPDF();

  // ==========================================
  // HEADER
  // ==========================================

  doc.setFontSize(10);
  
  doc.text(
    'Roberto Fabian Ponczko',
    140,
    17
  );

  doc.text(
    'L:6000726',
    150,
    21
  );

  doc.setFontSize(22);
  
  doc.text(
    'Banco de Horas',
    14,
    20
  );

  doc.setFontSize(11);

  doc.text(
    `Fecha: ${dayjs().format(
      'DD/MM/YYYY HH:mm'
    )}`,
    14,
    30
  );

  // ==========================================
  // RESUMEN
  // ==========================================

  doc.setFontSize(16);

  doc.text(
    'Resumen',
    14,
    45
  );

  // ==========================================
  // TABLA RESUMEN
  // ==========================================

  const resumenData = [
    [
      'Total registros',
      resumen
        ?.totalRegistros || 0,
    ],

    [
      'Horas trabajadas',
      `${
        resumen?.totalHoras ||
        0
      }h`,
    ],

    [
      'Horas extra',
      `${
        resumen?.totalExtras ||
        0
      }h`,
    ],

    [
      'Horas compensadas',
      `${
        resumen?.totalHorasCompensadas ||
        0
      }h`,
    ],

    [
      'Sábados pendientes',
      resumen
        ?.sabadosPendientes ||
        0,
    ],
  ];

  autoTable(doc, {
    startY: 50,

    head: [
      ['Concepto', 'Valor'],
    ],

    body: resumenData,
  });

  // ==========================================
  // TABLA REGISTROS
  // ==========================================

  const registrosData =
    (registros ?[...registros].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) : []).map(
      (registro) => [
        
        
        dayjs(registro.fecha).format('DD/MM/YYYY'),
      

        registro.horaEntrada,

        registro.horaSalida,

        
  `${registro.horasTrabajadas} h`,

  `${registro.horasExtras} h`,

  registro.horaExtraDesde
    ? `De ${registro.horaExtraDesde} a ${registro.horaExtraHasta}`
    : '-',

  registro.horaCompensadaDesde
    ? `De ${registro.horaCompensadaDesde} a ${registro.horaCompensadaHasta}`
    : '-',

         dayjs(registro.sabadoAsignado
          ?.fecha).format('DD/MM/YYYY') || '-',

        registro.observaciones ||
          '-',
      ]
    );

  autoTable(doc, {
    startY:
      doc.lastAutoTable.finalY +
      15,

    head: [
      [
        'Fecha',
        'Entrada',
        'Salida',
        'Trabajadas',
        'Extras',
        'Horario Extra',
        'Compensación',
        'Sábado',
        // 'Observaciones',
      ],
    ],

    body: registrosData,
  });

  // ==========================================
  // DESCARGAR
  // ==========================================

  doc.save(
    `Banco-de-horas-Fabian-${dayjs().format(
      'YYYY-MM-DD'
    )}.pdf`
  );
};

// ======================================
// EXCEL
// ======================================

export const generarExcelReporte =
  ({
    registros,
    resumen,
  }) => {
    // ==========================================
    // HOJA RESUMEN
    // ==========================================

    const resumenData = [
      {
        Concepto:
          'Total registros',

        Valor:
          resumen
            ?.totalRegistros ||
          0,
      },

      {
        Concepto:
          'Horas trabajadas',

        Valor: `${
          resumen?.totalHoras ||
          0
        }h`,
      },

      {
        Concepto:
          'Horas extra',

        Valor: `${
          resumen?.totalExtras ||
          0
        }h`,
      },

      {
        Concepto:
          'Horas compensadas',

        Valor: `${
          resumen?.totalHorasCompensadas ||
          0
        }h`,
      },

      {
        Concepto:
          'Sábados pendientes',

        Valor:
          resumen
            ?.sabadosPendientes ||
          0,
      },
    ];

    // ==========================================
    // HOJA REGISTROS
    // ==========================================

    const registrosData =
  (registros?.registros ?[...registros.registros].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) : []).map(
    (registro) => ({
      
      Fecha:
        registro.fecha,

      Entrada:
        registro.horaEntrada,

      Salida:
        registro.horaSalida,

      Trabajadas: `${registro.horasTrabajadas}h`,

      Extras: `${registro.horasExtras}h`,

      'Horario Extra':
        registro.horaExtraDesde
          ? `${registro.horaExtraDesde} → ${registro.horaExtraHasta}`
          : '-',

      Compensación:
        registro.horaCompensadaDesde
          ? `${registro.horaCompensadaDesde} → ${registro.horaCompensadaHasta}`
          : '-',
      Sabado:  
        registro.sabadoAsignado?.fecha,
      Observaciones:
        registro.observaciones ||
        '-',
    })
  );

    // ==========================================
    // WORKBOOK
    // ==========================================

    const workbook =
      XLSX.utils.book_new();

    // ==========================================
    // SHEET RESUMEN
    // ==========================================

    const resumenSheet =
      XLSX.utils.json_to_sheet(
        resumenData
      );

    XLSX.utils.book_append_sheet(
      workbook,
      resumenSheet,
      'Resumen'
    );

    // ==========================================
    // SHEET REGISTROS
    // ==========================================

    const registrosSheet =
      XLSX.utils.json_to_sheet(
        registrosData
      );

    XLSX.utils.book_append_sheet(
      workbook,
      registrosSheet,
      'Registros'
    );

    // ==========================================
    // EXPORTAR
    // ==========================================

    XLSX.writeFile(
      workbook,
      `reporte_${Date.now()}.xlsx`
    );
  };
// ======================================
// WHATSAPP
// ======================================

export const generarTextoWhatsApp = (
  resumen
) => {
  return `
📊 REPORTE BANCO DE HORAS

⏱ Horas trabajadas:
${resumen.totalHoras}h

🔥 Horas extras:
${resumen.totalExtras}h

✅ Horas compensadas:
${resumen.totalHorasCompensadas}h

📅 Sábados pendientes:
${resumen.sabadosPendientes}
`;
};

export const generarLinkWhatsApp = (
  resumen
) => {
  const texto =
    generarTextoWhatsApp(
      resumen
    );

  return `https://wa.me/?text=${encodeURIComponent(
    texto
  )}`;
};