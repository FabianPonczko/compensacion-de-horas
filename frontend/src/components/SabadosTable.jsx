export default function SabadosTable({
  sabados,
  onDelete,
  onPresentar
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">
              Fecha
            </th>

            <th className="p-3 text-left">
              Totales
            </th>

            <th className="p-3 text-left">
              Restantes
            </th>

            <th className="p-3 text-left">
              Estado
            </th>

            <th className="p-3 text-left">
              Progreso
            </th>

            <th className="p-3 text-left">
              Acción
            </th>
            <th className="p-3 text-left">
              Estado
            </th>
            <th className="p-3 text-left">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {sabados.map((sabado) => (
            <tr
              key={sabado._id}
              className="border-b"
            >
              <td className="p-3">
                {sabado.fecha}
              </td>

              <td className="p-3">
                {sabado.horasTotales}h
              </td>

              <td className="p-3">
                {sabado.horasRestantes}h
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    sabado.estado ===
                    'Completado'
                      ? 'bg-green-100 text-green-700'
                      : sabado.estado ===
                        'Parcial'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {sabado.estado}
                </span>
              </td>

              <td className="p-3 w-64">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    style={{
                      width: `${sabado.progreso}%`,
                    }}
                    className="bg-black h-3 rounded-full"
                  />
                </div>
              </td>

              <td className="p-3">
                <button
                  onClick={() =>
                    onDelete(
                      sabado._id
                    )
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-lg"
                >
                  Eliminar
                </button>
              </td>
              <td className="p-3">
                {sabado.presentado}
              </td>
              <td className="p-3">
                <button
                  onClick={() =>
                    onPresentar(
                      sabado._id
                    )
                  }
                  className="bg-blue-700 text-white px-3 py-1 rounded-lg"
                >
                  Presentado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!sabados.length && (
        <div className="text-center py-10 text-gray-500">
          No hay sábados registrados
        </div>
      )}
    </div>
  );
}