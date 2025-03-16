import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductTemplate from "@/src/components/ProductTemplate";

const FavDelMes = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Cargar el producto más vendido (favorito del mes)
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/productos/masvendido`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) =>
        console.error("Error al cargar el producto más vendido:", err)
      );
  }, []);

  if (!product) {
    return <p className="text-center">Cargando producto favorito del mes...</p>;
  }

  // Invertir el arreglo de imágenes para mostrar el orden esperado
  const images = product.imagenes ? product.imagenes.slice().reverse() : [];

  return (
    <div className="w-full h-[70vh]">
      <div className="flex h-full">
        {/* Columna Izquierda: Slider de imágenes */}
        <div className="md:w-3/5 flex gap-4 h-full">
          {/* Miniaturas verticales */}
          <div className="w-20 h-full flex flex-col gap-2">
            {images.map((img, idx) => (
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
          {/* Imagen principal */}
          <div className="flex-1 relative group h-full">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage].url_imagen}
                alt={product.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                Sin imagen
              </div>
            )}
            {/* Botón para imagen anterior */}
            <button
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
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
            {/* Botón para imagen siguiente */}
            <button
              onClick={() =>
                setSelectedImage((prev) => (prev + 1) % images.length)
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

        {/* Columna Derecha: Detalles del producto usando ProductTemplate */}
        <div className="md:w-2/5 p-4 flex flex-col justify-center">
          <ProductTemplate
            product={product}
            showImage={false} // La imagen se muestra en el slider
            showTitle={true}
            showPrice={true}
            showRating={true}
            showAddButton={true} // El botón usará la función integrada para agregar al carrito (Comprar ahora)
            showVerMasButton={true}
            showExtraIcons={true} // Se muestran los 4 SVGs extra
            customClasses={{
              container: "w-full",
              titleContainer: "mb-4",
              title: "text-4xl font-bold",
              price: "text-2xl text-gray-700 mb-4",
              // Alineamos las estrellas a la izquierda:
              rating: "flex items-center justify-start",
              star: "productStar",
              ratingText: "ml-2 text-lg text-gray-600",
              addButton:
                "w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition",
              verMasContainer: "mt-4",
              verMasButton:
                "w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition text-center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FavDelMes;
