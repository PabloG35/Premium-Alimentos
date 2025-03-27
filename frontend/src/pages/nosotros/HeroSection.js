// src/pages/nosotros/HeroSection.js
import React from "react";
import CollageGrid from "@/src/pages/nosotros/CollageGrid";

const HeroSection = () => (
  <section className="h-[calc(100vh-112px)] mt-[112px] bg-gray-50 flex items-center">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Columna izquierda: Texto */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">
          We’re changing the way people connect
        </h1>
        <p className="text-lg text-gray-700">
          Cupidatat minim id magna ipsum sint dolor qui. Sunt sit in quis
          cupidatat mollit...
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
