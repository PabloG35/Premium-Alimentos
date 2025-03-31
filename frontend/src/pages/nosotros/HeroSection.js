// src/pages/nosotros/HeroSection.js
import React from "react";
import CollageGrid from "@/src/pages/nosotros/CollageGrid";

const HeroSection = () => (
  <section className="h-[calc(100vh-112px)] mt-[112px] bg-gray-50 flex items-center">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna izquierda: Texto */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          Cambiamos la forma en que cuidas a tu perro
        </h1>
        <p className="text-lg text-gray-700">
          No solo vendemos alimento. Creamos un espacio donde puedes sentirte
          seguro de que estás haciendo lo correcto por quien más amas.
        </p>
      </div>
      {/* Columna derecha: Collage */}
      <div>
        <CollageGrid />
      </div>
    </div>
  </section>
);

export default HeroSection;
