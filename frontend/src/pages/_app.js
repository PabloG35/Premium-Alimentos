// pages/_app.js
import "@/src/styles/globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CartProvider } from "@/src/context/CartContext";
import { AuthProvider } from "@/src/context/AuthContext";
import { NotificationProvider } from "@/src/context/NotificationContext";
import {
  GlobalLoadingProvider,
  useGlobalLoading,
} from "@/src/context/GlobalLoadingContext";
import GlobalLoadingOverlay from "@/src/components/GlobalLoadingOverlay";

function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <GlobalLoadingProvider>
            <InnerApp Component={Component} pageProps={pageProps} />
          </GlobalLoadingProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

function InnerApp({ Component, pageProps }) {
  const { isLoading } = useGlobalLoading();

  return (
    <>
      <GlobalLoadingOverlay isLoading={isLoading} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
