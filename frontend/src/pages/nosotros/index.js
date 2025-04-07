// /pages/nosotros/index.js
import React from "react";
import HeroSection from "@/src/pages/nosotros/HeroSection";
import MissionSection from "@/src/pages/nosotros/MissionSection";
import ValuesSection from "@/src/pages/nosotros/ValuesSection";
import TeamSection from "@/src/pages/nosotros/TeamSection";
import Layout from "@/src/components/Layout";

const Nosotros = () => {
  return (
    <>
      <Layout>
        <HeroSection />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
      </Layout>
    </>
  );
};

export default Nosotros;
