// src/components/Navbar.js
import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { CartContext } from "@/src/context/CartContext";

export default function Navbar() {
  const { token } = useContext(AuthContext);
  const { obtenerCantidadCarrito, cartItems } = useContext(CartContext);
  const cantidadEnCarrito = obtenerCantidadCarrito();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-zinc-50 text-slate-950 w-full h-28 fixed top-0 z-50 border-b border-zinc-200 transition-shadow duration-500 ${
        isScrolled ? "shadow-xl" : ""
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center px-4 md:px-8 h-full">
        {/* Desktop Version */}
        <div className="hidden [@media(min-width:1080px)]:flex w-full items-center h-full">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <Link href="/">
              <div className="relative w-40 h-40 flex items-center">
                <Image
                  src="/PremiumAlimentos/logoNaranja.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  sizes="(max-width: 1080px) 100vw, 10rem"
                />
              </div>
            </Link>
          </div>
          {/* Central Menu */}
          <div className="flex-1 flex items-center justify-center gap-8 text-lg font-roboto font-bold">
            <Link href="/" className="menu-link">
              HOME
            </Link>
            <Link
              href="/tienda"
              className="menu-link cursor-pointer flex items-center gap-1 transition-all duration-300 group-hover:text-pm-naranja"
            >
              <span>TIENDA</span>
              <img
                src="/SVGs/abajo.svg"
                alt="Abajo"
                className="arrow-icon w-4 h-4 inline-block ml-1"
              />
            </Link>
            <Link href="/nosotros" className="menu-link">
              NOSOTROS
            </Link>
            <Link href="/contacto" className="menu-link">
              CONTACTO
            </Link>
          </div>
          {/* Right Icons */}
          <div className="flex items-center justify-end gap-6">
            <button
              aria-label="Buscar"
              className="flex items-center justify-center"
            >
              <img src="/SVGs/lupa.svg" alt="Buscar" className="w-6 h-6" />
            </button>
            {token ? (
              <Link href="/perfil">
                <img
                  src="/SVGs/usuarioMas.svg"
                  alt="Perfil"
                  className="w-6 h-6 cursor-pointer"
                />
              </Link>
            ) : (
              <Link href="/auth">
                <img
                  src="/SVGs/usuarioLogin.svg"
                  alt="Usuario"
                  className="w-6 h-6"
                />
              </Link>
            )}
            <Link href="/carrito">
              <div className="relative flex items-center justify-center">
                <img
                  src="/SVGs/carrito.svg"
                  alt="Carrito"
                  className="w-6 h-6"
                />
                {cantidadEnCarrito > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cantidadEnCarrito}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
        {/* Mobile Version */}
        <div className="flex [@media(min-width:1080px)]:hidden w-full items-center h-full">
          <div className="flex-1 flex items-center justify-start">
            <button
              aria-label="Menu"
              className="flex items-center justify-center"
            >
              <img src="/SVGs/hamburguesa.svg" alt="Menu" className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Link href="/">
              <div className="relative w-32 h-28">
                <Image
                  src="/PremiumAlimentos/logoNaranja.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  sizes="(max-width: 1080px) 100vw, 8rem"
                />
              </div>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end gap-6">
            <button
              aria-label="Buscar"
              className="flex items-center justify-center"
            >
              <img src="/SVGs/lupa.svg" alt="Buscar" className="w-6 h-6" />
            </button>
            {token ? (
              <Link href="/perfil">
                <img
                  src="/SVGs/usuarioMas.svg"
                  alt="Perfil"
                  className="w-6 h-6 cursor-pointer"
                />
              </Link>
            ) : (
              <Link href="/auth">
                <img
                  src="/SVGs/usuarioLogin.svg"
                  alt="Usuario"
                  className="w-6 h-6"
                />
              </Link>
            )}
            <Link href="/carrito">
              <div className="relative flex items-center justify-center">
                <img
                  src="/SVGs/carrito.svg"
                  alt="Carrito"
                  className="w-6 h-6"
                />
                {cantidadEnCarrito > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-xs text-slate-900 rounded-full w-5 h-5 flex items-center justify-center">
                    {cantidadEnCarrito}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
