import Link from "next/link";
import { cerrarSesion } from "@/services/authService";

export default function Sidebar() {
  return (
    <nav className="sticky top-0 w-64 bg-gray-800 text-white h-screen p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <ul>
          <li className="mb-2">
            <Link href="/tienda">
              <span className="block p-2 hover:bg-gray-700 rounded cursor-pointer">
                Gestión de Productos
              </span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/ordenes">
              <span className="block p-2 hover:bg-gray-700 rounded cursor-pointer">
                Órdenes
              </span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/usuarios">
              <span className="block p-2 hover:bg-gray-700 rounded cursor-pointer">
                Usuarios
              </span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/usuarios/suscripciones">
              <span className="block p-2 hover:bg-gray-700 rounded cursor-pointer">
                Suscripciones
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <button
        onClick={cerrarSesion}
        className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 cursor-pointer"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}
