// src/pages/tienda.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import Link from "next/link";
import ProductTemplate from "@/src/components/ProductTemplate";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import styles from "../styles/tienda.module.css";

export default function Tienda() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [selectedEdad, setSelectedEdad] = useState([]);
  const [selectedRazas, setSelectedRazas] = useState([]);
  const [enExistencia, setEnExistencia] = useState(false);

  // Estados para secciones colapsables
  const [openMarcas, setOpenMarcas] = useState(true);
  const [openEdad, setOpenEdad] = useState(true);
  const [openRaza, setOpenRaza] = useState(true);
  const [openExistencia, setOpenExistencia] = useState(true);

  // Opciones para los filtros
  const marcasOptions = [
    "Royal Canin",
    "Diamond Naturals",
    "Taste of The Wild",
    "Blue Buffalo",
  ];
  const edadOptions = ["Adulto", "Cachorro"];
  const razaOptions = [
    "Jack Russel",
    "Bulldog Frances",
    "King Charles",
    "Dachshund (Salchicha)",
    "Cavalier King",
    "Maltese",
    "Todas las Razas",
  ];

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/productos`, {
          mode: "cors",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [BACKEND_URL]);

  useEffect(() => {
    if (router.query.marca) {
      const marcaQuery = router.query.marca;
      if (typeof marcaQuery === "string") {
        setSelectedMarcas([marcaQuery]);
      } else if (Array.isArray(marcaQuery)) {
        setSelectedMarcas(marcaQuery);
      }
    }
  }, [router.query.marca]);

  const toggleMarca = (marca) => {
    setSelectedMarcas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const toggleEdad = (edad) => {
    setSelectedEdad((prev) =>
      prev.includes(edad) ? prev.filter((e) => e !== edad) : [...prev, edad]
    );
  };

  const toggleRaza = (raza) => {
    setSelectedRazas((prev) =>
      prev.includes(raza) ? prev.filter((r) => r !== raza) : [...prev, raza]
    );
  };

  const toggleEnExistencia = () => {
    setEnExistencia((prev) => !prev);
  };

  const filteredProductos = productos.filter((prod) => {
    if (selectedMarcas.length > 0 && !selectedMarcas.includes(prod.marca))
      return false;
    if (selectedRazas.length > 0 && !selectedRazas.includes(prod.raza))
      return false;
    if (selectedEdad.length > 0) {
      const desc = prod.descripcion.toLowerCase();
      let match = false;
      if (selectedEdad.includes("Adulto") && desc.includes("adulto"))
        match = true;
      if (selectedEdad.includes("Cachorro") && desc.includes("cachorro"))
        match = true;
      if (!match) return false;
    }
    if (enExistencia && prod.stock <= 0) return false;
    return true;
  });

  return (
    <Layout>
      <div className="p-6 mt-[112px] mb-40">
        <h1 className="text-4xl heading mb-8">Tienda</h1>
        <div className="flex w-full max-w-6xl mx-auto">
          {/* Sidebar de filtros */}
          <aside className="w-1/4 pr-4 space-y-4">
            {/* Filtro Marcas */}
            <div>
              <div
                onClick={() => setOpenMarcas(!openMarcas)}
                className="flex items-center justify-between cursor-pointer "
              >
                <h2 className="text-2xl heading">Marcas</h2>
                <img
                  src={openMarcas ? "/SVGs/arriba.svg" : "/SVGs/abajo.svg"}
                  alt="Toggle Marcas"
                  className="w-6 h-6 transition-transform duration-100"
                />
              </div>
              <hr className="my-2" />
              {openMarcas && (
                <div className="mt-2">
                  {marcasOptions.map((marca) => (
                    <div key={marca} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`marca-${marca}`}
                        checked={selectedMarcas.includes(marca)}
                        onChange={() => toggleMarca(marca)}
                        className="mr-2 cursor-pointer "
                      />
                      <label
                        htmlFor={`marca-${marca}`}
                        className="text-lg cursor-pointer"
                      >
                        {marca}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Filtro Edad */}
            <div>
              <div
                onClick={() => setOpenEdad(!openEdad)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h2 className="text-2xl heading">Edad</h2>
                <img
                  src={openEdad ? "/SVGs/arriba.svg" : "/SVGs/abajo.svg"}
                  alt="Toggle Edad"
                  className="w-6 h-6 transition-transform duration-100"
                />
              </div>
              <hr className="my-2" />
              {openEdad && (
                <div className="mt-2">
                  {edadOptions.map((edad) => (
                    <div key={edad} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`edad-${edad}`}
                        checked={selectedEdad.includes(edad)}
                        onChange={() => toggleEdad(edad)}
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor={`edad-${edad}`}
                        className="text-lg cursor-pointer"
                      >
                        {edad}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Filtro Raza */}
            <div>
              <div
                onClick={() => setOpenRaza(!openRaza)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h2 className="text-2xl heading">Raza</h2>
                <img
                  src={openRaza ? "/SVGs/arriba.svg" : "/SVGs/abajo.svg"}
                  alt="Toggle Raza"
                  className="w-6 h-6 transition-transform duration-100"
                />
              </div>
              <hr className="my-2" />
              {openRaza && (
                <div className="mt-2">
                  {razaOptions.map((raza) => (
                    <div key={raza} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`raza-${raza}`}
                        checked={selectedRazas.includes(raza)}
                        onChange={() => toggleRaza(raza)}
                        className="mr-2 cursor-pointer"
                      />
                      <label
                        htmlFor={`raza-${raza}`}
                        className="text-lg cursor-pointer"
                      >
                        {raza}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Filtro En existencia */}
            <div>
              <div
                onClick={() => setOpenExistencia(!openExistencia)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h2 className="text-2xl heading">Disponibilidad</h2>
                <img
                  src={openExistencia ? "/SVGs/arriba.svg" : "/SVGs/abajo.svg"}
                  alt="Toggle Existencia"
                  className="w-6 h-6 transition-transform duration-100"
                />
              </div>
              <hr className="my-2" />
              {openExistencia && (
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="enExistencia"
                    checked={enExistencia}
                    onChange={toggleEnExistencia}
                    className="switch_1"
                  />
                  <span className="pl-2">En existencia</span>
                  <style jsx>{`
                    input[type="checkbox"].switch_1 {
                      -webkit-appearance: none;
                      -moz-appearance: none;
                      appearance: none;
                      width: 3.5em;
                      height: 1.5em;
                      background: #ddd;
                      border-radius: 3em;
                      position: relative;
                      cursor: pointer;
                      outline: none;
                      transition: all 0.2s ease-in-out;
                    }
                    input[type="checkbox"].switch_1:checked {
                      background: #0ebeff;
                    }
                    input[type="checkbox"].switch_1:after {
                      position: absolute;
                      content: "";
                      width: 1.5em;
                      height: 1.5em;
                      border-radius: 50%;
                      background: #fff;
                      box-shadow: 0 0 0.25em rgba(0, 0, 0, 0.3);
                      transform: scale(0.7);
                      left: 0;
                      transition: all 0.2s ease-in-out;
                    }
                    input[type="checkbox"].switch_1:checked:after {
                      left: calc(100% - 1.5em);
                    }
                  `}</style>
                </div>
              )}
            </div>
          </aside>
          {/* Área de productos */}
          <main className="w-3/4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <LoadingAnimation />
              </div>
            ) : filteredProductos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProductos.map((producto) => (
                  <Link
                    key={producto.id_producto}
                    href={`/tienda/${producto.id_producto}`}
                    className="hover:opacity-90 transition-opacity"
                  >
                    <ProductTemplate
                      product={producto}
                      showImage={true}
                      showTitle={true}
                      showPrice={true}
                      showRating={true}
                      showAddButton={true}
                      customClasses={{
                        imageContainer: styles.productImageContainer,
                        image: styles.productImage,
                        titleContainer: styles.titleContainer,
                        title: styles.productTitle,
                        price: styles.productPrice,
                        rating: styles.starsContainer,
                        star: styles.productStar,
                        ratingText: styles.productRatingText,
                        addButton: styles.addButton,
                      }}
                      onAddToCart={() =>
                        console.log(
                          "Agregar al carrito producto:",
                          producto.id_producto
                        )
                      }
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center">
                No se encontraron productos con estos filtros.
              </p>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
