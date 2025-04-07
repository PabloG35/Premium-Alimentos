// pages/auth/index.js
import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import { AuthContext } from "@/src/context/AuthContext";
import Image from "next/image";
import LoadingAnimation from "@/src/components/LoadingAnimation";

export default function Login() {
  const router = useRouter();
  const { token, loading, login, registerUser } = useContext(AuthContext);
  const [modo, setModo] = useState("login"); // "login" or "register"
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    // Si ya terminó la carga y existe el token, redirige a /perfil
    if (!loading && token) {
      router.push("/perfil");
    }
  }, [token, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      await login({ correo, contraseña });
      router.push("/perfil");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("Error en el servidor");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    try {
      await registerUser({
        nombre_usuario: `${nombre} ${apellido}`,
        correo,
        contraseña,
      });
      // Luego de registrar, podrías redirigir a la página de login o intentar iniciar sesión automáticamente
      router.push("/auth");
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      setMensaje("Error en el servidor");
    }
  };

  return (
    <Layout>
      <div className="w-full h-[calc(100vh-112px)] flex items-center justify-center">
        <div className="w-full max-w-md">
          {modo === "login" ? (
            <form
              onSubmit={handleLoginSubmit}
              className="bg-white p-8 rounded shadow-md"
            >
              <h1 className="text-2xl heading mb-6 text-center">
                Iniciar Sesión
              </h1>
              {mensaje && (
                <p className="text-red-500 mb-4 text-center">{mensaje}</p>
              )}
              <input
                type="email"
                id="correo-login"
                name="correo"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full p-4 border rounded mb-4"
                required
              />
              <input
                type="password"
                id="contraseña-login"
                name="contraseña"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full p-4 border rounded mb-6"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors duration-200 mb-6"
              >
                Iniciar Sesión
              </button>
              <div className="text-center space-y-2">
                <p className="text-sm">
                  No tienes una cuenta?{" "}
                  <span
                    className="text-pm-naranja inline-flex items-center cursor-pointer font-bold"
                    onClick={() => setModo("register")}
                  >
                    Crear cuenta
                    <Image
                      src="/SVGs/derecha.svg"
                      alt="Ir"
                      width={16}
                      height={16}
                      className="w-4 h-4 ml-1"
                    />
                  </span>
                </p>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleRegisterSubmit}
              className="bg-white p-8 rounded shadow-md"
            >
              <h1 className="text-2xl heading mb-6 text-center">
                Crear Cuenta
              </h1>
              {mensaje && (
                <p className="text-red-500 mb-4 text-center">{mensaje}</p>
              )}
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  id="nombre-register"
                  name="nombre"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-4 border rounded"
                  required
                />
                <input
                  type="text"
                  id="apellido-register"
                  name="apellido"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full p-4 border rounded"
                  required
                />
              </div>
              <input
                type="email"
                id="correo-register"
                name="correo"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full p-4 border rounded mb-4"
                required
              />
              <input
                type="password"
                id="contraseña-register"
                name="contraseña"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full p-4 border rounded mb-6"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors duration-200 mb-6"
              >
                Crear Cuenta
              </button>
              <div className="text-center">
                <p className="text-sm">
                  Ya tienes una cuenta?{" "}
                  <span
                    className="text-pm-naranja inline-flex items-center cursor-pointer font-bold"
                    onClick={() => setModo("login")}
                  >
                    Iniciar Sesión
                    <Image
                      src="/SVGs/derecha.svg"
                      alt="Ir"
                      width={16}
                      height={16}
                      className="w-4 h-4 ml-1"
                    />
                  </span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
