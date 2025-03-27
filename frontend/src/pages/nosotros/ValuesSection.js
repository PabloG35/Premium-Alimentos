// src/pages/nosotros/ValuesSection.js
import React from "react";

const ValuesSection = () => {
  const values = [
    {
      title: "Be world-class",
      description: "Ali utique ea. Ut enim at nominau omnius. Culpa ipsum...",
    },
    {
      title: "Share everything you know",
      description: "Mollitia delectus a omnis. Quoe velit aliquid...",
    },
    {
      title: "Always learning",
      description: "At velit repellendus et officios fuga possimus...",
    },
    {
      title: "Innovation",
      description: "Excepteur sint occaecat cupidatat non proident...",
    },
    {
      title: "Collaboration",
      description: "Duis aute irure dolor in reprehenderit in voluptate...",
    },
    {
      title: "Passion",
      description: "Sed ut perspiciatis unde omnis iste natus error...",
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
