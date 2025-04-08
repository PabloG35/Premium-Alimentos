// src/components/Footer.js
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleRegistro = async () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Validar que se ingrese un correo
    if (!correo) {
      setMensaje("Por favor, ingresa un correo.");
      return;
    }

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/usuario/usuarios/registroSuscripciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMensaje(data.message || "Registro exitoso.");
        setCorreo(""); // Limpia el input
      } else {
        setMensaje(data.error || "Hubo un error.");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje("Error en el servidor. Intenta más tarde.");
    }
  };

  return (
    <footer className="bg-pm-azulFuerte text-white py-12">
      <div className="container mx-auto px-8">
        {/* Parte superior: Grid de columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Columna 1: Logo, descripción y redes sociales (siempre visible) */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link href="/">
              <Image
                src="/PremiumAlimentos/logo.png"
                alt="Logo Premium Alimentos"
                width={192}
                height={64}
                style={{ objectFit: "contain" }}
                className="cursor-pointer transition-colors duration-300 hover:opacity-75"
              />
            </Link>
            <p className="pt-4 max-w-[18rem] text-base leading-6">
              En Premium Alimentos vendemos tranquilidad, salud y felicidad en
              cada entrega. Solo marcas en las que confiarías con los ojos
              cerrados.
            </p>
            <div className="flex space-x-2 mt-10">
              <Link href="#">
                <Image
                  src="/SVGs/whatsapp.svg"
                  alt="WhatsApp"
                  width={48}
                  height={48}
                  className="transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/SVGs/facebook.svg"
                  alt="Facebook"
                  width={48}
                  height={48}
                  className="transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/SVGs/instagram.svg"
                  alt="Instagram"
                  width={48}
                  height={48}
                  className="transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <Image
                  src="/SVGs/tiktok.svg"
                  alt="Tiktok"
                  width={48}
                  height={48}
                  className="transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
            </div>
          </div>

          {/* Columna 2: Enlaces de la Compañía  
              Se muestra en md y lg (oculta en sm) */}
          <div className="hidden md:block">
            <h3 className="text-2xl text-pm-orange mb-2 pt-6">
              <Link
                href="/tienda"
                className="transition-colors heading duration-300 hover:text-pm-naranja cursor-pointer"
              >
                Compañia
              </Link>
            </h3>
            <ul className="space-y-1 text-lg">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Royal Canin
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Diamond Naturals
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Taste of The Wild
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Avisos de Privacidad  
              Se oculta en md y sm; visible solo en lg */}
          <div className="hidden lg:block">
            <h3 className="text-2xl text-pm-orange mb-2 pt-6">
              <Link
                href="/privacidad/privacidad"
                className="transition-colors duration-300 heading hover:text-pm-naranja cursor-pointer"
              >
                Avisos de Privacidad
              </Link>
            </h3>
            <ul className="space-y-1 text-lg">
              <li>
                <Link
                  href="/privacidad/privacidad"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Avisos de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad/devolucion"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Devolución
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad/terminos"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad/refactor"
                  className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
                >
                  Refactor Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Registro por correo  
              Se muestra en md y lg (oculta en sm) */}
          <div className="hidden md:block">
            <h3 className="text-2xl heading text-pm-orange mb-2 pt-6 cursor-pointer">
              Regístrate
            </h3>
            <p className="text-lg mb-4">
              Regístrate y recibe 10% en tu primera compra
            </p>
            <div className="flex">
              <input
                type="email"
                id="correoFooter"
                name="correo"
                placeholder="Tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="flex-1 p-2 bg-transparent border border-white rounded-l outline-none text-white"
              />
              <button
                onClick={handleRegistro}
                className="bg-pm-orange p-2 border border-white border-l-0 rounded-r"
              >
                <Image
                  src="/SVGs/derecha.svg"
                  alt="Enviar"
                  width={20}
                  height={20}
                  className="reverse"
                />
              </button>
            </div>
            {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
          </div>
        </div>

        {/* Parte inferior */}
        <div className="mt-8 border-t border-gray-200 pt-6 pb-6 text-center text-sm">
          {/* Grupo de SVGs oculto en sm */}
          <div className="hidden sm:flex justify-center items-center space-x-4 mb-4">
            <Image
              src="/SVGs/spei.svg"
              alt="spei"
              width={64}
              height={64}
              className="rounded-2xl"
            />
            <Image
              src="/SVGs/mastercard.svg"
              alt="Mastercard"
              width={64}
              height={64}
            />
            <Image
              src="/SVGs/visa.svg"
              alt="Visa"
              width={64}
              height={64}
              className="rounded-2xl"
            />
            <Image
              src="/SVGs/americanexpress.svg"
              alt="American Express"
              width={64}
              height={64}
              className="rounded-2xl"
            />
            <Image
              src="/SVGs/mercadopago.svg"
              alt="Mercadopago"
              width={64}
              height={64}
              className="rounded-2xl"
            />
            <Image
              src="/SVGs/cash.svg"
              alt="Efectivo"
              width={64}
              height={64}
              className="rounded-2xl"
            />
          </div>
          <p>
            ©2024 Premium Alimentos. Todos los derechos reservados{" "}
            <span className="underline transition-colors duration-300 hover:text-pm-naranja cursor-pointer">
              Refactor Solutions
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
