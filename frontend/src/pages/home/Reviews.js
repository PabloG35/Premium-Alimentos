// src/pages/home/Reviews.js
import React, { useState, useEffect } from "react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({}); // Mapea id_producto -> producto
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Cargar las 12 reseñas más recientes
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/usuario/resenas/recientes`)
      .then((res) => res.json())
      .then((data) =>
        // Verificamos que data.resenas sea un array, sino devolvemos []
        setReviews(Array.isArray(data.resenas) ? data.resenas : [])
      )
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [BACKEND_URL]);

  // Cargar la información de cada producto para cada reseña
  useEffect(() => {
    if (reviews.length > 0) {
      reviews.forEach((review) => {
        const prodId = review.id_producto;
        if (!products[prodId]) {
          fetch(`${BACKEND_URL}/api/productos/${prodId}`)
            .then((res) => res.json())
            .then((data) =>
              setProducts((prev) => ({ ...prev, [prodId]: data }))
            )
            .catch((err) => console.error("Error al cargar producto:", err));
        }
      });
    }
  }, [reviews, BACKEND_URL, products]);

  // Auto-advance: cambiar slide cada 4 segundos si no se ha interactuado
  useEffect(() => {
    if (!autoAdvance || reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoAdvance, reviews]);

  // Mientras no se carguen las reseñas o el producto correspondiente al slide actual, mostramos loading
  if (reviews.length === 0 || !products[reviews[currentIndex]?.id_producto]) {
    return <p className="text-center">Cargando reseñas y producto...</p>;
  }

  // Función para simular el swipe pasando por slides intermedios
  const goToSlide = (targetIndex) => {
    if (targetIndex === currentIndex) return;
    const step = targetIndex > currentIndex ? 1 : -1;
    let newIndex = currentIndex;
    const interval = setInterval(() => {
      newIndex += step;
      setCurrentIndex(newIndex);
      if (newIndex === targetIndex) {
        clearInterval(interval);
      }
    }, 150); // 150ms por paso (ajustable)
  };

  return (
    <div className="w-full h-[70vh] bg-zinc-200 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Contenido del slider */}
      <div
        className="h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {reviews.map((review) => {
          const product = products[review.id_producto];
          const fullStars = parseInt(review.calificacion, 10);
          const emptyStars = 5 - fullStars;
          return (
            <div
              key={review.id_reseña}
              className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center p-4"
            >
              {/* Título general */}
              <h2 className="text-center heading text-3xl mb-4">
                Lo que opinan nuestros clientes
              </h2>
              {/* Imagen del producto */}
              <div className="mb-4">
                <img
                  src={
                    product?.imagenes?.length > 0
                      ? product.imagenes[0].url_imagen
                      : "/placeholder.jpg"
                  }
                  alt={product?.nombre || "Producto"}
                  className="max-h-[30vh] object-contain"
                />
              </div>
              {/* Contenido de la reseña */}
              <div className="w-full max-w-xl">
                {/* Estrellas: llenas y vacías */}
                <div className="flex items-center justify-center mb-2">
                  {Array.from({ length: fullStars }).map((_, i) => (
                    <img
                      key={`full-${i}`}
                      src="/SVGs/starIcon.svg"
                      alt="star full"
                      className="w-6 h-6 mr-1"
                    />
                  ))}
                  {Array.from({ length: emptyStars }).map((_, i) => (
                    <img
                      key={`empty-${i}`}
                      src="/SVGs/starIconEmpty.svg"
                      alt="star empty"
                      className="w-6 h-6 mr-1"
                    />
                  ))}
                </div>
                {/* Comentario en itálica y entre comillas */}
                <p className="text-center text-gray-700 italic">
                  “{review.comentario}”
                </p>
                {/* Nombre del usuario con "-" debajo */}
                <p className="text-center text-sm text-gray-500 mt-2">
                  - {review.nombre_usuario}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Navegación con dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {reviews.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => {
                setAutoAdvance(false);
                goToSlide(index);
              }}
              className={`transition-all duration-300 ${
                isActive ? "w-8 h-4 rounded-full" : "w-4 h-4 rounded-full"
              } bg-gray-200`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Reviews;
