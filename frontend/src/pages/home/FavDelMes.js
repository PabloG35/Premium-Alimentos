// pages/home/FavDelMes.js
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ProductTemplate from "@/src/components/ProductTemplate";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import { Separator } from "@/src/components/ui/separator";

// Importamos componentes del carousel de shadcn
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

export default function FavDelMes() {
  const [product, setProduct] = useState(null);
  // Para la vista de miniaturas en md+: autoplay cada 3 seg
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  // Estado para controlar la animación de pulso
  const [flashIndex, setFlashIndex] = useState(-1);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 1. Cargar el producto más vendido (favorito del mes)
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/productos/masvendido`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) =>
        console.error("Error al cargar el producto más vendido:", err)
      );
  }, [BACKEND_URL]);

  // 2. Procesar las imágenes únicas sin invertir el orden
  const images = useMemo(() => {
    if (!product || !Array.isArray(product.imagenes)) return [];
    const unique = product.imagenes.reduce((acc, curr) => {
      if (!acc.find((item) => item.url_imagen === curr.url_imagen)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    return unique.slice();
  }, [product]);

  // 3. Auto-play en “md+” cada 3 segundos (si isAutoPlay es true)
  useEffect(() => {
    if (!isAutoPlay || images.length === 0) return;
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay, images.length]);

  // 4. Disparar la animación de pulso cada vez que cambie la imagen
  useEffect(() => {
    if (images.length === 0) return;
    setFlashIndex(selectedImage);
    const timer = setTimeout(() => {
      setFlashIndex(-1);
    }, 1000); // 1 segundo de animación
    return () => clearTimeout(timer);
  }, [selectedImage, images.length]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
      <h1 className="heading text-5xl mt-16">Favorito del Mes</h1>
      <Separator className="mt-2 mb-6" />
      <div className="w-full">
        {/* -- LAYOUT SM (pantallas chicas): columna con carousel shadcn -- */}
        <div className="flex flex-col gap-4 md:hidden">
          {/* Título */}
          <h1 className="text-3xl heading text-center mt-4">
            {product.nombre}
          </h1>
          {/* Carousel de imágenes */}
          <div className="w-full flex justify-center">
            <Carousel className="w-full max-w-xs">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="relative aspect-square w-full">
                        <Image
                          src={img.url_imagen}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          {/* Detalles del producto */}
          <div className="px-4">
            <ProductTemplate
              product={product}
              showImage={false}
              showTitle={false} // Ya está arriba
              showPrice={true}
              showRating={true}
              showAddButton={true}
              showVerMasButton={true}
              showExtraIcons={true}
              redirectOnImageClick={false}
              buttonText="Agregar carrito"
              customClasses={{
                container: "w-full",
                titleContainer: "mb-4",
                title: "text-4xl heading",
                price: "text-2xl text-gray-700 mb-4",
                rating: "flex items-center justify-start",
                star: "w-5 mx-0.5",
                ratingText: "ml-2 text-lg text-gray-600",
                buttonContainer: "flex flex-row gap-2 mt-4",
                addButton:
                  "flex-1 bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition",
                verMasButton:
                  "flex-1 bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition text-center",
              }}
            />
          </div>
        </div>

        {/* -- LAYOUT MD+ (pantallas grandes): Barra miniatura izquierda + imagen principal + info -- */}
        <div className="hidden md:flex h-[70vh]">
          {/* Columna Izquierda: miniaturas */}
          <div className="md:w-3/5 flex gap-4 h-full">
            <div className="w-20 h-full flex flex-col gap-2 overflow-auto">
              {images.map((img, idx) => {
                const isSelected = selectedImage === idx;
                const isFlashing = flashIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedImage(idx);
                      setIsAutoPlay(false);
                    }}
                    className={`cursor-pointer border-2 p-1 rounded transition-colors duration-300
                    ${isSelected ? "border-blue-500" : "border-transparent"}
                    ${isFlashing ? "animate-pulse" : ""}`}
                  >
                    <Image
                      src={img.url_imagen}
                      alt={`Thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover rounded"
                    />
                  </div>
                );
              })}
            </div>
            {/* Imagen principal */}
            <div className="flex-1 relative group h-full">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage].url_imagen}
                  alt={product.nombre}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  Sin imagen
                </div>
              )}
              {/* Botones de navegación */}
              // Botón "Anterior"
              <button
                onClick={() =>
                  images.length > 0 &&
                  setSelectedImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                aria-label="Imagen anterior"
                className="hidden md:block absolute top-1/2 left-4 
             transform -translate-y-1/2 opacity-0 
             group-hover:opacity-100 transition"
              >
                <Image
                  src="/SVGs/izquierda.svg"
                  alt="Anterior"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
              // Botón "Siguiente"
              <button
                onClick={() =>
                  images.length > 0 &&
                  setSelectedImage((prev) => (prev + 1) % images.length)
                }
                aria-label="Imagen siguiente"
                className="hidden md:block absolute top-1/2 right-4 
             transform -translate-y-1/2 opacity-0 
             group-hover:opacity-100 transition"
              >
                <Image
                  src="/SVGs/derecha.svg"
                  alt="Siguiente"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
          {/* Columna Derecha: Detalles del producto (incluye título) */}
          <div className="md:w-2/5 p-4 flex flex-col justify-center">
            <ProductTemplate
              product={product}
              showImage={false}
              showTitle={true} // Título se muestra aquí en pantallas grandes
              showPrice={true}
              showRating={true}
              showAddButton={true}
              showVerMasButton={true}
              showExtraIcons={true}
              redirectOnImageClick={true}
              buttonText="Agregar carrito"
              customClasses={{
                container: "w-full",
                titleContainer: "mb-4",
                title: "text-4xl heading",
                price: "text-2xl text-gray-700 mb-4",
                rating: "flex items-center justify-start",
                star: "w-5 mx-0.5",
                ratingText: "ml-2 text-lg text-gray-600",
                buttonContainer: "flex flex-row gap-2 mt-4",
                addButton:
                  "flex-1 bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition",
                verMasButton:
                  "flex-1 bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 transition text-center",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
