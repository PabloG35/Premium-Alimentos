// src/pages/nosotros/ValuesSection.js
import React from "react";

const ValuesSection = () => {
  const values = [
    {
      title: "Excelencia sin excepciones",
      description: "Solo lo que le daríamos a nuestras propias mascotas",
    },
    {
      title: "Compartimos para ayudarte a elegir mejor",
      description: "Creemos en dueños informados, no confundidos",
    },
    {
      title: "Aprendemos junto a ti",
      description: "Cada perro nos enseña a ser mejores",
    },
    {
      title: "Innovación consciente",
      description: "Traemos marcas que hacen las cosas distinto",
    },
    {
      title: "Colaboración con propósito",
      description: "Trabajamos con marcas que comparten nuestra visión",
    },
    {
      title: "Pasión por lo que importa",
      description: "Amamos a los perros, y se nota en cada detalle",
    },
  ];

  return (
    <section className="h-[75vh] bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-8">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-sm flex flex-col items-center"
            >
              <img
                src="/SVGs/añadirImagen.svg"
                alt="Valor placeholder"
                className="mb-4 w-16 h-16"
              />
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
