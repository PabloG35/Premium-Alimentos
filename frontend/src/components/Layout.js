// src/components/Layout.js
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="layout-container w-full bg-zinc-50">
      {/* Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      {/* Main Content with standard margins */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 bg-zinc-50">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Agregar una propiedad estática vacía para evitar el error de getInitialProps
Layout.getInitialProps = async () => ({});

export default Layout;
