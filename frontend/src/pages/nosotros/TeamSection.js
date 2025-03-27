// src/pages/nosotros/TeamSection.js
import React from "react";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Michael Foster",
      role: "Co-Founder / CTO",
      imgSrc: "/SVGs/añadirImagen.svg",
    },
    {
      name: "Dries Vincent",
      role: "Business Relations",
      imgSrc: "/SVGs/añadirImagen.svg",
    },
  ];

  return (
    <section className="h-[50vh] flex flex-col justify-center text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-4">Nuestro equipo</h2>
        <p className="text-lg text-gray-700 mb-8">
          Somos un grupo dinámico de personas apasionadas por lo que hacemos...
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                <img
                  src={member.imgSrc}
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
