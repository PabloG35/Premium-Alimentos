import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import ReviewsSlider from "./ReviewsSlider"; // Ajusta la ruta si es necesario

function IngredientDropdown({ category, items }) {
  const [open, setOpen] = useState(false);
  let parsedItems = items;
  if (Array.isArray(items)) {
    try {
      const joined = items.join(",");
      parsedItems = JSON.parse(joined);
    } catch (err) {
      parsedItems = items.map((item) =>
        item.replace(/^\[|]$/g, "").replace(/^"|"$/g, "")
      );
    }
  }
  return (
    <div className="py-2">
      <p
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer text-xl font-semibold text-gray-800 transition-colors duration-200 hover:text-gray-600 border-b border-gray-300"
      >
        {category}
        <span
          className={`transform transition duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </p>
      <ul
        className={`mt-2 pl-5 list-disc transition-all duration-500 overflow-hidden ${
          open
            ? "max-h-96 opacity-100 border-b border-gray-300"
            : "max-h-0 opacity-0"
        }`}
      >
        {Array.isArray(parsedItems) ? (
          parsedItems.map((ing, idx) => (
            <li key={idx} className="text-lg text-gray-700 py-1">
              {ing}
            </li>
          ))
        ) : (
          <li className="text-lg text-gray-700 py-1">{parsedItems}</li>
        )}
      </ul>
    </div>
  );
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const reviewsRef = useRef(null);

  const [producto, setProducto] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      // Fetch del producto
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProducto(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener el producto:", error);
          setLoading(false);
        });
      // Fetch de las reseñas
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resenas/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setReviews(data.resenas || []);
        })
        .catch((error) =>
          console.error("Error al obtener las reseñas:", error)
        );
    }
  }, [id]);

  if (loading || !producto) {
    return (
      <>
        <Navbar />
        <div className="px-3 mt-[112px] max-w-[1400px] mx-auto bg-zinc-50">
          Cargando producto...
        </div>
        <Footer />
      </>
    );
  }

  const increment = () => setQty((prev) => prev + 1);
  const decrement = () => {
    if (qty > 1) setQty((prev) => prev - 1);
  };

  // Cálculo del promedio y redondeo dinámico de estrellas
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.calificacion, 0) / reviews.length
      : 0;
  const displayRating = Math.floor(averageRating + 0.4);

  // Scroll suave hasta el componente de reseñas
  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-3 mt-[112px] max-w-[1400px] mx-auto bg-zinc-50 pb-8">
        {/* Top Section */}
        <div className="flex pt-5 flex-col md:flex-row gap-6">
          {/* Left: Área de imágenes con thumbnails verticales */}
          <div className="md:w-3/5 flex gap-4 h-[600px]">
            <div className="w-20 h-full flex flex-col gap-2">
              {producto.imagenes &&
                producto.imagenes.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`cursor-pointer border-2 p-1 rounded transition-colors duration-300 ${
                      selectedImage === idx
                        ? "border-blue-500 animate-pulse"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.url_imagen}
                      alt={`Thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                  </div>
                ))}
            </div>
            <div className="flex-1 relative group h-full">
              {producto.imagenes && producto.imagenes.length > 0 ? (
                <Image
                  src={producto.imagenes[selectedImage].url_imagen}
                  alt={producto.nombre}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  Sin imagen
                </div>
              )}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? producto.imagenes.length - 1 : prev - 1
                  )
                }
                className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
              >
                <img
                  src="/SVGs/izquierda.svg"
                  alt="Anterior"
                  className="w-6 h-6"
                />
              </button>
              <button
                onClick={() =>
                  setSelectedImage(
                    (prev) => (prev + 1) % producto.imagenes.length
                  )
                }
                className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
              >
                <img
                  src="/SVGs/derecha.svg"
                  alt="Siguiente"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
          {/* Right: Detalles del producto */}
          <div className="md:w-2/5 flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{producto.nombre}</h1>
            <p className="text-2xl text-green-600">${producto.precio}</p>
            {/* Descripción debajo del precio */}
            <div>
              <h2 className="text-2xl font-bold mb-2">Descripción</h2>
              <p className="text-lg">{producto.descripcion}</p>
            </div>
            {/* Línea clickeable de reseñas: estrellas dinámicas y número sin paréntesis */}
            <div
              onClick={scrollToReviews}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <div className="flex items-center">
                {reviews.length > 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Image
                      key={i}
                      src={
                        i < displayRating
                          ? "/SVGs/starIcon.svg"
                          : "/SVGs/starIconEmpty.svg"
                      }
                      alt="star"
                      width={20}
                      height={20}
                    />
                  ))
                ) : (
                  <span className="text-lg">Sin reseñas</span>
                )}
              </div>
              <span className="text-lg">{reviews.length} reseñas</span>
            </div>
            {/* Fila para Agregar al carrito y contador: botón 80%, contador 20% */}
            <div className="flex gap-4 w-full">
              <button className="w-[80%] bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition">
                Agregar al carrito
              </button>
              <div className="w-[20%] flex items-center justify-center border rounded">
                <button onClick={decrement} className="px-2">
                  <Image
                    src="/SVGs/menos.svg"
                    alt="Menos"
                    width={20}
                    height={20}
                  />
                </button>
                <span className="mx-2 text-lg">{qty}</span>
                <button onClick={increment} className="px-2">
                  <Image src="/SVGs/mas.svg" alt="Más" width={20} height={20} />
                </button>
              </div>
            </div>
            {/* Botón "Comprar ahora" a ancho completo */}
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition">
              Comprar ahora
            </button>
            {/* Container de Pago Seguro, Envío Rápido y Calidad garantizada */}
            <div className="flex mt-4">
              <div className="flex flex-col items-center justify-center flex-1">
                <Image
                  src="/SVGs/pagoseguro.svg"
                  alt="Pago Seguro"
                  width={50}
                  height={50}
                />
                <span className="text-lg font-medium text-center">
                  Pago
                  <br />
                  Seguro
                </span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <Image
                  src="/SVGs/box.svg"
                  alt="Envío Rápido"
                  width={50}
                  height={50}
                />
                <span className="text-lg font-medium text-center">
                  Envío
                  <br />
                  Rápido
                </span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <Image
                  src="/SVGs/calidad.svg"
                  alt="Calidad garantizada"
                  width={50}
                  height={50}
                />
                <span className="text-lg font-medium text-center">
                  Calidad
                  <br />
                  Garantizada
                </span>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <Image
                  src="/SVGs/datosseguros.svg"
                  alt="Datos Seguros"
                  width={50}
                  height={50}
                />
                <span className="text-lg font-medium text-center">
                  Datos
                  <br />
                  Seguros
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section: Ingredientes y Reviews */}
        <div className="mt-8 space-y-8">
          {/* Ingredientes */}
          {producto.ingredientes && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Ingredientes</h2>
              <div className="space-y-2">
                {Object.entries(producto.ingredientes).map(
                  ([categoria, items]) => (
                    <IngredientDropdown
                      key={categoria}
                      category={categoria}
                      items={items}
                    />
                  )
                )}
              </div>
            </div>
          )}
          {/* Sección de reseñas: se asigna un ref para el scroll */}
          <div ref={reviewsRef}>
            <ReviewsSlider reviews={reviews} />
          </div>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          80% {
            transform: translateX(-5px);
          }
          40%,
          60% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </>
  );
}
