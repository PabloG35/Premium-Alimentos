// src/pages/nosotrs/MissionSection.js
import React from "react";

export default function MissionSection() {
  // Fecha de inicio
  const startDate = new Date("2022-10-02");
  // Fecha actual
  const currentDate = new Date();
  // Diferencia en milisegundos
  const timeDiff = currentDate - startDate;
  // Convertir la diferencia a días (redondeando hacia abajo)
  const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Definición de los datos con colores personalizados para cada value
  const stats = [
    {
      id: 1,
      name: "Unidades vendidas",
      value: "+1,000",
      textColor: "text-pm-naranja", // Ejemplo de color: verde
    },
    {
      id: 2,
      name: "Clientes mensuales",
      value: "+100",
      textColor: "text-[#F991CC]", // Ejemplo de color: azul
    },
    {
      id: 3,
      name: "Alimentando su mascota",
      value: `${diffDays} Días`,
      textColor: "text-[#00A6A6]", // Ejemplo de color: rojo
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base/7 heading">{stat.name}</dt>
              <dd
                className={`order-first text-3xl heading tracking-tight sm:text-5xl ${stat.textColor}`}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
