// src/components/ProtectedRoute.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/src/context/AuthContext";
import LoadingAnimation from "@/src/components/LoadingAnimation";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!token || !user)) {
      router.replace("/auth");
    }
  }, [token, user, loading, router]);

  return (
    <>
      {children}
      {(loading || (!token || !user)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <LoadingAnimation />
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
