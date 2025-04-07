// pages/_app.js
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import {
  GlobalLoadingProvider,
  useGlobalLoading,
} from "@/context/GlobalLoadingContext";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import "@/styles/globals.css";

function InnerApp({ Component, pageProps }) {
  const { isLoading } = useGlobalLoading();
  return (
    <>
      <GlobalLoadingOverlay isLoading={isLoading} />
      <Component {...pageProps} />
    </>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <GlobalLoadingProvider>
        <AdminAuthProvider>
          <InnerApp Component={Component} pageProps={pageProps} />
        </AdminAuthProvider>
      </GlobalLoadingProvider>
    </NotificationProvider>
  );
}
