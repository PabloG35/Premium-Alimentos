// pages/_app.js
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AdminAuthProvider>
      <Component {...pageProps} />
    </AdminAuthProvider>
  );
}
