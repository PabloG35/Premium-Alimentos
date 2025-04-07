// src/components/Navbar.js
import Link from "next/link";
import Image from "next/image";
import styles from "@/src/styles/navbar.module.css";
import { useContext, useEffect, useState } from "react";
import { useSidebar } from "@/src/components/ui/sidebar";
import { AuthContext } from "@/src/context/AuthContext";
import { CartContext } from "@/src/context/CartContext";
import CartModal from "@/src/components/CartModal";

export default function Navbar() {
  const { token } = useContext(AuthContext);
  const { obtenerCantidadCarrito } = useContext(CartContext);
  const cantidadEnCarrito = obtenerCantidadCarrito();
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const isDesktop = windowWidth > 1080;
  const isMobile = windowWidth <= 765;
  let logoSize = 150;
  if (isMobile) {
    const diff = 765 - windowWidth;
    logoSize = Math.max(150 - diff, 110);
  }

  return (
    <>
      <nav
        className={`bg-zinc-50 font-harmonia font-semibold text-slate-950 w-full h-28 fixed top-0 ${
          cartModalOpen ? "z-40 filter blur-sm" : "z-50"
        } border-b border-zinc-200 transition-shadow duration-500 ${
          isScrolled ? "shadow-xl" : ""
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center px-4 h-full">
          {isDesktop ? (
            // Desktop: logo left, central menu, right icons.
            <div className="flex w-full items-center h-full">
              {/* Logo */}
              <div className="flex items-center justify-start">
                <Link href="/">
                  <div
                    className="relative"
                    style={{ width: "150px", height: "150px" }}
                  >
                    <Image
                      src="/PremiumAlimentos/logoNaranja.png"
                      alt="Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      priority
                      sizes="100vw"
                    />
                  </div>
                </Link>
              </div>
              {/* Central Menu */}
              <div className="flex-1 flex items-center justify-center gap-8 text-lg">
                <Link href="/" className={styles.menuLink}>
                  INICIO
                </Link>
                <div className={`${styles.menu} relative`}>
                  <h2 className={styles["menu-title"]}>
                    <Link href="/tienda">TIENDA</Link>
                  </h2>
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
          ) : (
            // Tablet/Mobile: hamburger on left (opens sidebar), centered logo, and right icons always visible.
            <div className="flex w-full items-center h-full justify-between">
              {/* Hamburger trigger */}
              <div className="flex items-center">
                <button onClick={toggleSidebar} aria-label="Abrir menú">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
              {/* Centered Logo */}
              <div className="flex items-center justify-center">
                <Link href="/">
                  <div
                    className="relative"
                    style={{
                      width: `${isMobile ? logoSize : 150}px`,
                      height: `${isMobile ? logoSize : 150}px`,
                    }}
                  >
                    <Image
                      src="/PremiumAlimentos/logoNaranja.png"
                      alt="Logo"
                      fill
                      style={{ objectFit: "contain" }}
                      priority
                      sizes="100vw"
                    />
                  </div>
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
          )}
        </div>
      </nav>
      <CartModal open={cartModalOpen} setOpen={setCartModalOpen} />
    </>
  );
}
