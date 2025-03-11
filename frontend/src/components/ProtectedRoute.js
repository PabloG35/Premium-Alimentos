// src/components/ProtectedRoute.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Si no hay token o user, redirige a login
    if (!token || !user) {
      router.replace("/auth");
    }
  }, [token, user, router]);

  if (!token || !user) {
    return <p>Cargando...</p>;
  }
  return children;
};

export default ProtectedRoute;
