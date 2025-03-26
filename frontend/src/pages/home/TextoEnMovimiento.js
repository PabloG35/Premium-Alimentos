import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const TextoEnMovimiento = () => {
  return (
    <div
      className="pt-8 my-14"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <Marquee speed={80} gradient={false} pauseOnHover={false} autoFill={true}>
        {/* Hardcoded content for precise spacing */}
        <span className="font-harmonia font-black text-[40px] mx-4">
          Calidad en la que tú confias
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={40}
          height={40}
          className="inline-block mx-4"
          style={{ verticalAlign: "middle" }}
        />
        <span className="font-harmonia font-black text-[40px] mx-4">
          Envío gratis en compras mayores a $999
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={40}
          height={40}
          className="inline-block mx-4"
          style={{ verticalAlign: "middle" }}
        />
        <span className="font-harmonia font-black text-[40px] mx-4">
          Tranquilidad servida en su plato
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={40}
          height={40}
          className="inline-block mx-4"
          style={{ verticalAlign: "middle" }}
        />
        <span className="font-harmonia font-black text-[40px] mx-4">
          #PremiumAlimentos — tú eliges bien
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={40}
          height={40}
          className="inline-block mx-8"
          style={{ verticalAlign: "middle" }}
        />
      </Marquee>
    </div>
  );
};

export default TextoEnMovimiento;
