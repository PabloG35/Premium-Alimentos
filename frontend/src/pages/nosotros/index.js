// src/pages/nosotros/index.js
import React from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/pages/nosotros/HeroSection";
import MissionSection from "@/src/pages/nosotros/MissionSection";
import ValuesSection from "@/src/pages/nosotros/ValuesSection";
import TeamSection from "@/src/pages/nosotros/TeamSection";

const Nosotros = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <Footer />
    </>
  );
};

export default Nosotros;
