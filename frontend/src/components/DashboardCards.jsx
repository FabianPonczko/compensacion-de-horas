export default function DashboardCards({
  resumen,
}) {
  const cards = [
    {
      title: 'Horas Trabajadas',

      value:
        resumen?.totalHoras || 0,
    },

    {
      title: 'Horas Extra',

      value:
        resumen?.totalExtras || 0,
    },

    {
      title: 'Registros',

      value:
        resumen?.totalRegistros ||
        0,
    },

    {
      title: 'Sábados Pendientes',

      value:
        resumen?.sabadosPendientes ||
        0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <p className="text-gray-500 text-sm">
            {card.title}
          </p>

          <h3 className="text-4xl font-bold mt-2">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}