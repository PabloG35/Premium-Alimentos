// src/pages/nosotros/TeamSection.js
import React from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Pablo Gaxiola",
      role: "CEO/Fundador",
      imgSrc: "",
    },
    {
      name: "Sofia Gaxiola",
      role: "Gerente General",
      imgSrc: "",
    },
  ];

  // Función para obtener las iniciales del nombre
  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0);
    return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
  };

  return (
    <section className="h-[50vh] flex flex-col justify-center text-center">
      <div className="px-4">
        <h2 className="text-3xl heading mb-4">Nuestro equipo</h2>
        <p className="text-lg text-gray-700 mb-8">
          Somos dueños de perros, como tú. Personas que vivimos los mismos
          retos, y que decidimos hacer algo al respecto. Hoy, convertimos
          nuestra experiencia en soluciones reales para quienes también buscan
          lo mejor.
        </p>
        <div className="w-full flex flex-row justify-center gap-28 items-center mt-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col justify-end items-center">
              <div className="mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={member.imgSrc} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl heading">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
