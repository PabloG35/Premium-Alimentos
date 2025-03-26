import Link from "next/link";
import Image from "next/image";
import styles from "@/src/styles/navbar.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { CartContext } from "@/src/context/CartContext";
import CartModal from "@/src/components/CartModal"; // Ajusta la ruta según tu estructura

export default function Navbar() {
  const { token } = useContext(AuthContext);
  const { obtenerCantidadCarrito } = useContext(CartContext);
  const cantidadEnCarrito = obtenerCantidadCarrito();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`bg-zinc-50 font-harmonia font-semibold text-slate-950 w-full h-28 fixed top-0 ${
          cartModalOpen ? "z-40 filter blur-sm" : "z-50"
        } border-b border-zinc-200 transition-shadow duration-500 ${
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
            <div className="flex-1 flex items-center justify-center gap-8 text-lg">
              <Link href="/" className={styles.menuLink}>
                INICIO
              </Link>
              {/* Dropdown de TIENDA */}
              <div className={`${styles.menu} relative`}>
                <h2 className={`${styles["menu-title"]}`}>TIENDA</h2>
                <ul className={`${styles["menu-dropdown"]} text-base`}>
                  <li>
                    <Link
                      href={{
                        pathname: "/tienda",
                        query: { marca: "Royal Canin" },
                      }}
                    >
                      ROYAL CANIN
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/tienda",
                        query: { marca: "Diamond Naturals" },
                      }}
                    >
                      DIAMOND NATURALS
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/tienda",
                        query: { marca: "Taste of The Wild" },
                      }}
                    >
                      TASTE OF THE WILD
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={{
                        pathname: "/tienda",
                        query: { marca: "Blue Buffalo" },
                      }}
                    >
                      BLUE BUFFALO
                    </Link>
                  </li>
                </ul>
              </div>
              <Link href="/nosotros" className={styles.menuLink}>
                NOSOTROS
              </Link>
              <Link href="/contacto" className={styles.menuLink}>
                CONTACTO
              </Link>
            </div>
            {/* Right Icons */}
            <div className="flex items-center justify-end gap-6">
              <button
                aria-label="Buscar"
                className="flex items-center justify-center"
              >
                <Image
                  src="/SVGs/lupa.svg"
                  alt="Buscar"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              {token ? (
                <Link href="/perfil">
                  <Image
                    src="/SVGs/usuarioMas.svg"
                    alt="Perfil"
                    width={24}
                    height={24}
                    className="w-6 h-6 cursor-pointer"
                  />
                </Link>
              ) : (
                <Link href="/auth">
                  <Image
                    src="/SVGs/usuarioLogin.svg"
                    alt="Usuario"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </Link>
              )}
              {/* Botón para abrir el modal */}
              <button
                onClick={() => setCartModalOpen(true)}
                className="relative flex items-center justify-center"
              >
                <Image
                  src="/SVGs/carrito.svg"
                  alt="Carrito"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                {cantidadEnCarrito > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cantidadEnCarrito}
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* Mobile Version */}
          <div className="flex [@media(min-width:1080px)]:hidden w-full items-center h-full">
            {/* (Versión móvil, sin cambios en este ejemplo) */}
          </div>
        </div>
      </nav>
      {/* Modal del carrito */}
      <CartModal open={cartModalOpen} setOpen={setCartModalOpen} />
    </>
  );
}
