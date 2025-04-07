// src/pages/nosotrs/MissionSection.js
import React from "react";

const MissionSection = () => (
  <div className="h-[25vh] my-20 flex flex-col justify-center text-center">
    <div className="px-4">
      <h2 className="text-3xl heading mb-4">Nuestra misión</h2>
      <p className="text-lg text-gray-700 mb-8">
        Ayudar a cada dueño a elegir el alimento perfecto sin dudas ni
        remordimientos. Solo marcas premium, evaluadas con rigor y entregadas
        con compromiso.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl heading">+1,000 unidades vendidas</h3>
          <p className="text-gray-600">Perros alimentados con confianza real</p>
        </div>
        <div>
          <h3 className="text-2xl heading">+100 clientes mensuales</h3>
          <p className="text-gray-600">Dueños que vuelven porque confían en nosotros</p>
        </div>
        <div>
          <h3 className="text-2xl heading">Compramos directo al fabricante</h3>
          <p className="text-gray-600">Sin intermediarios. Más frescura, mejor precio</p>
        </div>
      </div>
    </div>
  </div>
);

export default MissionSection;
