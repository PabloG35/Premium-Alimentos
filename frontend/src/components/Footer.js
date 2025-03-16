import { useState } from "react";
import Link from "next/link";

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
        {/* Parte superior: 4 columnas con menor gap */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Columna 1: Logo, Descripción y Redes Sociales */}
          <div>
            <Link href="/">
              <img
                src="/PremiumAlimentos/logo.png"
                alt="Logo Premium Alimentos"
                className="w-48 cursor-pointer transition-colors duration-300 hover:opacity-75"
              />
            </Link>
            <p className="text-md leading-6 w-72 pt-4">
              En Premium Alimentos, somos una empresa mexicana dedicada a
              brindar alimentos saludables y de alta calidad para perros,
              siempre a precios accesibles.
            </p>
            <div className="flex space-x-2 mt-10">
              <Link href="#">
                <img
                  src="/SVGs/whatsapp.svg"
                  alt="WhatsApp"
                  className="w-12 h-12 transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <img
                  src="/SVGs/facebook.svg"
                  alt="Facebook"
                  className="w-12 h-12 transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <img
                  src="/SVGs/instagram.svg"
                  alt="Instagram"
                  className="w-12 h-12 transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
              <Link href="#">
                <img
                  src="/SVGs/tiktok.svg"
                  alt="Tiktok"
                  className="w-12 h-12 transition-colors duration-300 hover:filter hover:brightness-125 cursor-pointer"
                />
              </Link>
            </div>
          </div>

          {/* Columna 2: Enlaces de la Compañía */}
          <div>
            <h3 className="text-2xl font-semibold text-pm-orange mb-2 pt-6">
              <Link
                href="/tienda"
                className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
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
                  Royal Canina
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

          {/* Columna 3: Avisos de Privacida */}
          <div>
            <h3 className="text-2xl font-semibold text-pm-orange mb-2 pt-6">
              <Link
                href="/privacidad/privacidad"
                className="transition-colors duration-300 hover:text-pm-naranja cursor-pointer"
              >
                Avisos de Privacida
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

          {/* Columna 4: Registro por correo */}
          <div>
            <h3 className="text-2xl font-semibold text-pm-orange mb-2 pt-6 cursor-pointer">
              REGÍSTRATE
            </h3>
            <p className="text-lg mb-4">
              Regístrate y recibe 10% en tu primera compra
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="flex-1 p-2 bg-transparent border border-white rounded-l outline-none text-white"
              />
              <button
                onClick={handleRegistro}
                className="bg-pm-orange p-2 border border-white border-l-0 rounded-r"
              >
                <img
                  src="/SVGs/rightArrow.svg"
                  alt="Enviar"
                  className="w-5 h-5"
                />
              </button>
            </div>
            {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
          </div>
        </div>

        {/* Parte inferior */}
        <div className="mt-8 border-t border-gray-200 pt-6 pb-6 text-center text-sm">
          {/* Íconos de pago y métodos */}
          <div className="flex justify-center items-center space-x-4 mb-4">
            <img
              src="/SVGs/spei.svg"
              alt="spei"
              className="w-16 h-16 rounded-2xl"
            />
            <img
              src="/SVGs/mastercard.svg"
              alt="Mastercard"
              className="w-16 h-16"
            />
            <img
              src="/SVGs/visa.svg"
              alt="Visa"
              className="w-16 h-16 rounded-2xl"
            />
            <img
              src="/SVGs/americanexpress.svg"
              alt="American Express"
              className="w-16 h-16 rounded-2xl"
            />
            <img
              src="/SVGs/mercadopago.svg"
              alt="Mercadopago"
              className="w-16 h-16 rounded-2xl"
            />
            <img
              src="/SVGs/cash.svg"
              alt="Efectivo"
              className="w-16 h-16 rounded-2xl"
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
