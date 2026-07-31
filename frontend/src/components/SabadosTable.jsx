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

            <th className="p-3 text-center">
              Totales
            </th>

            <th className="p-3 text-center">
              Restantes
            </th>

            <th className="p-3 text-center">
              Estado
            </th>

            <th className="p-3 text-center">
              Progreso
            </th>

            <th className="p-3 text-center">
              Acción
            </th>
            <th className="p-3 text-center">
              Estado
            </th>
            <th className="p-3 text-center">
              Acción
            </th>
          </tr>
        </thead>

        <tbody>
          {sabados.map((sabado) => {
            
            const yaPresentado = sabado.presentado === 'X';

          return(

            <tr
            key={sabado._id}
            className="border-b"
            >
              {console.log("sabado",sabado)}
              <td className="p-3">
                {sabado.fecha}
              </td>

              <td className="p-3 text-center">
                {sabado.horasTotales}h
              </td>

              <td className="p-3 text-center">
                {sabado.horasRestantes}h
              </td>

              <td className="p-3 text-center">
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

              <td className="p-3 text-center">
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

              <td className="p-3 text-center">
                {sabado.presentado}
              </td>

              <td className="p-3">
              <button
                disabled={yaPresentado}
                onClick={() => onPresentar(sabado._id)}
                className="bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {yaPresentado ? 'Presentado' : 'Presentar'}
              </button>
              </td>
            </tr>
          )})}
          
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