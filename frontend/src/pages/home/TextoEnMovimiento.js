import React from "react";
import Marquee from "react-fast-marquee";

const TextoEnMovimiento = () => {
  return (
    <div
      className="pt-28 pb-6"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      <Marquee
        speed={80}
        gradient={false}
        pauseOnHover={false}
        // loop 0 es infinito, pero por defecto ya es infinito
        autoFill={true}
      >
        {/* Hardcodeamos el contenido para tener un control exacto de los espacios */}
        <span className="heading text-[35px] mx-4">
          Calidad en la que tú confias
        </span>
        <img
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          className="h-12 w-auto inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
          Envío gratis en compras mayores a $999
        </span>
        <img
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          className="h-12 w-auto inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
        Tranquilidad servida en su plato
        </span>
        <img
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          className="h-12 w-auto inline-block mx-12"
          style={{ verticalAlign: "middle" }}
        />
        <span className="heading text-[35px] mx-4">
        #PremiumAlimentos — tú eliges bien
        </span>
        {/* Aquí se pone el logo con espacio extra para que se separe del inicio */}
        <img
          src="/PremiumAlimentos/icon.png"
          alt="Logo"
          className="h-12 w-auto inline-block mx-14"
          style={{ verticalAlign: "middle" }}
        />
      </Marquee>
    </div>
  );
};

export default TextoEnMovimiento;
