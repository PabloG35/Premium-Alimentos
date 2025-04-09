import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

const TextoEnMovimiento = () => {
  return (
    <div
      className="my-32"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <Marquee speed={80} gradient={false} pauseOnHover={false} autoFill={true}>
        {/* Hardcodeamos el contenido para tener un control exacto de los espacios */}
        <span className="heading text-[35px] mx-4">
          Calidad en la que tú confias
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={48} // h-12 equivale a 48px
          height={48} // Se asume que el ícono es cuadrado
          className="inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
          Envío gratis en compras mayores a $999
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={48}
          height={48}
          className="inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
          Tranquilidad servida en su plato
        </span>
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={48}
          height={48}
          className="inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
          #PremiumAlimentos — tú eliges bien
        </span>
        {/* Aquí se pone el logo con espacio extra para que se separe del inicio */}
        <Image
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          width={48}
          height={48}
          className="inline-block mx-14"
          style={{ verticalAlign: "middle" }}
        />
      </Marquee>
    </div>
  );
};

export default TextoEnMovimiento;
