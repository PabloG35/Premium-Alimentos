// pages/usuarios/index.js
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AdminAuthContext from "@/context/AdminAuthContext";
import Layout from "@/components/Layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const obtenerToken = () => localStorage.getItem("adminToken");

async function obtenerUsuarios() {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const response = await fetch(`${BASE_URL}/api/usuario/usuarios`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} al obtener usuarios`);
  }

  const data = await response.json();
  return data.usuarios;
}

async function eliminarUsuario(id) {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const response = await fetch(
    `${BASE_URL}/api/usuario/usuarios/eliminar/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Error al eliminar usuario");

  return await response.json();
}

async function crearAdmin(data) {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const response = await fetch(`${BASE_URL}/api/usuario/usuarios/crear-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Error al crear usuario");

  return await response.json();
}

export default function Usuarios() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [filtroRoles, setFiltroRoles] = useState([
    "CEO",
    "Director",
    "Supervisor",
    "usuario",
  ]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "Supervisor",
  });

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    } else {
      cargarUsuarios();
      cargarSuscripciones();
    }
  }, [admin, loading, router]);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      console.log("📌 Usuarios obtenidos:", data);
      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error);
    }
  };

  const cargarSuscripciones = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `${BASE_URL}/api/usuario/usuarios/obtenerSuscripciones`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSuscripciones(data.suscripciones || []);
    } catch (error) {
      console.error("❌ Error obteniendo suscripciones:", error);
    }
  };

  const toggleFiltro = (rol) => {
    setFiltroRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const eliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((user) => user.id_usuario !== id));
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
    }
  };

  const crearNuevoUsuario = async (e) => {
    e.preventDefault();
    try {
      await crearAdmin(nuevoUsuario);
      cargarUsuarios();
      setNuevoUsuario({
        nombre: "",
        email: "",
        password: "",
        rol: "Supervisor",
      });
    } catch (error) {
      console.error("❌ Error creando usuario:", error);
    }
  };

  if (loading || !admin) return <p>Cargando...</p>;

  // Filtrar usuarios por rol
  const usuariosFiltrados = usuarios.filter((user) =>
    filtroRoles.includes(user.rol)
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

        {/* Filtros de roles */}
        <div className="mb-4 flex gap-4">
          {["CEO", "Director", "Supervisor", "usuario"].map((rol) => (
            <label key={rol} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtroRoles.includes(rol)}
                onChange={() => toggleFiltro(rol)}
              />
              {rol}
            </label>
          ))}
        </div>

        {/* Tabla de Usuarios usando shadcn/ui Table components */}
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Suscrito</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((user) => {
                let suscrito = "";
                let color = "";
                if (user.rol === "usuario") {
                  const sub = suscripciones.find(
                    (s) => s.correo.toLowerCase() === user.correo.toLowerCase()
                  );
                  suscrito = sub ? "Suscrito" : "No suscrito";
                  color = sub ? "text-green-500" : "text-red-500";
                }
                return (
                  <TableRow key={user.id_usuario}>
                    <TableCell>{user.id_usuario}</TableCell>
                    <TableCell>{user.nombre_usuario}</TableCell>
                    <TableCell>{user.correo}</TableCell>
                    <TableCell>{user.rol}</TableCell>
                    <TableCell>
                      {user.rol === "usuario" && (
                        <span className={`${color} font-bold`}>{suscrito}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => eliminar(user.id_usuario)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Eliminar
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-2 text-center">
                  No hay usuarios disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableCaption>
            {usuariosFiltrados.length} usuario(s) encontrado(s)
          </TableCaption>
        </Table>

        {/* Formulario para crear nuevo usuario (Solo para CEO) */}
        {admin.rol === "CEO" && (
          <form
            onSubmit={crearNuevoUsuario}
            className="mt-6 p-4 border rounded"
          >
            <h2 className="text-xl font-bold mb-2">Crear Nuevo Usuario</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Correo"
                value={nuevoUsuario.email}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={nuevoUsuario.password}
                onChange={(e) =>
                  setNuevoUsuario({
                    ...nuevoUsuario,
                    password: e.target.value,
                  })
                }
                className="p-2 border rounded"
                required
              />
              <select
                value={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                }
                className="p-2 border rounded"
              >
                <option value="Supervisor">Supervisor</option>
                <option value="Director">Director</option>
                <option value="CEO">CEO</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Crear Usuario
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
