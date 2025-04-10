import React from "react";
import Image from "next/image";

const ValuesSection = () => {
  const values = [
    {
      title: "Excelencia sin excepciones",
      description: "Solo lo que le daríamos a nuestras propias mascotas",
      image: "/SVGs/estrella3D.svg",
    },
    {
      title: "Compartimos para ayudarte a elegir mejor",
      description: "Creemos en dueños informados, no confundidos",
      image: "/SVGs/compartir3D.svg",
    },
    {
      title: "Aprendemos junto a ti",
      description: "Cada perro nos enseña a ser mejores",
      image: "/SVGs/estadisticas3D.svg",
    },
    {
      title: "Innovación consciente",
      description: "Traemos marcas que hacen las cosas distinto",
      image: "/SVGs/engrane3D.svg",
    },
    {
      title: "Colaboración con propósito",
      description: "Trabajamos con marcas que comparten nuestra visión",
      image: "/SVGs/conectar3D.svg",
    },
    {
      title: "Pasión por lo que importa",
      description: "Amamos a los perros, y se nota en cada detalle",
      image: "/SVGs/corazon3D.svg",
    },
  ];

  return (
    <section className="h-auto bg-gray-50 flex items-center">
      <div className="mx-auto px-4 text-center">
        <h2 className="text-3xl heading mb-8">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-6 rounded-lg shadow-sm flex flex-col items-center"
            >
              <div className="relative mb-4 w-16 h-16">
                <Image
                  src={value.image}
                  alt={`Valor ${index}`}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl heading mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
