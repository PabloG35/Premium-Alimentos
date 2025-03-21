import "@/src/styles/globals.css";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
