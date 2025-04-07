// components/ProtectedRoute.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AdminAuthContext from "@/context/AdminAuthContext";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return admin ? children : null;
}
