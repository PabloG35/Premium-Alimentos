import { useState, useEffect } from "react";
import Image from "next/image";

const ReviewsSlider = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // null significa que se muestran todas; de lo contrario se filtra por esa calificación
  const [filterRating, setFilterRating] = useState(null);

  // Ancho efectivo de cada tarjeta: 400px + 20px de margen derecho = 420px
  const effectiveCardWidth = 420;
  const visibleCards = 2; // Mostramos 2 tarjetas a la vez

  // Cálculo estático del promedio a partir de todas las reseñas
  const totalAllReviews = reviews.length;
  const sumAllRatings = reviews.reduce((acc, r) => acc + r.calificacion, 0);
  const averageRating =
    totalAllReviews > 0 ? sumAllRatings / totalAllReviews : 0;
  // Redondeo: si promedio es 4.6 o más se muestran 5, si es menor a 4.5 pero >= 4 se muestran 4, etc.
  const displayRating = Math.floor(averageRating + 0.4);

  // Para las barras de progreso, usamos los datos globales (todas las reseñas)
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rating = Math.round(review.calificacion);
    if (starCounts[rating] !== undefined) {
      starCounts[rating]++;
    }
  });

  // Filtrado de reseñas para el slider, según el filtro seleccionado.
  const filteredReviews =
    filterRating === null
      ? reviews
      : reviews.filter(
          (review) => Math.round(review.calificacion) === filterRating
        );

  // Reiniciamos el slider cada vez que cambia el filtro.
  useEffect(() => {
    setCurrentIndex(0);
  }, [filterRating]);

  // Funciones para avanzar/retroceder en el slider (sobre las reseñas filtradas)
  const nextSlide = () => {
    if (currentIndex >= filteredReviews.length - visibleCards) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + visibleCards);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) return;
    const newIndex = currentIndex - visibleCards;
    setCurrentIndex(newIndex < 0 ? 0 : newIndex);
  };

  // Función para manejar click en la barra: si se hace click en la misma barra ya seleccionada se resetea el filtro.
  const handleBarClick = (star) => {
    if (filterRating === star) {
      setFilterRating(null);
    } else {
      setFilterRating(star);
    }
  };

  return (
    <div className="py-8">
      {/* Título centrado */}
      <h2 className="text-3xl font-bold text-center mb-4">Reseñas</h2>

      {/* Contenedor para promedio y barras de progreso */}
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-center mb-8 px-4 gap-8">
        {/* Izquierda: Promedio y estrellas (estático, basado en todas las reseñas) */}
        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
          <div className="flex mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Image
                key={i}
                src={
                  i < displayRating
                    ? "/SVGs/starIcon.svg"
                    : "/SVGs/starIconEmpty.svg"
                }
                alt="star"
                width={24}
                height={24}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {totalAllReviews} reseñas
          </p>
        </div>
        {/* Derecha: Barras de progreso clickeables */}
        <div className="w-full md:w-1/2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starCounts[star];
            const percentage =
              totalAllReviews > 0 ? (count / totalAllReviews) * 100 : 0;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleBarClick(star)}
                className="flex items-center w-full mb-2 focus:outline-none hover:opacity-50 transition-opacity"
              >
                <span className="w-16 flex-shrink-0 text-left">
                  {star}{" "}
                  <Image
                    src="/SVGs/starIcon.svg"
                    alt="star"
                    width={16}
                    height={16}
                    className="inline"
                  />
                </span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full mx-2">
                  <div
                    className="h-4 bg-blue-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slider de reseñas */}
      {filteredReviews.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay reseñas para esta selección.
        </p>
      ) : (
        <div className="relative flex items-center justify-center">
          <div className="w-[1240px] overflow-hidden rounded-lg mx-auto">
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${
                  currentIndex * effectiveCardWidth
                }px)`,
              }}
            >
              {filteredReviews.map((review, idx) => (
                <div
                  key={review.id_reseña || idx}
                  className="flex-shrink-0 w-[400px] h-[320px] bg-white shadow-md rounded-lg mr-5 p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[55px] h-[55px] rounded-full overflow-hidden">
                      {review.foto || review.imagen ? (
                        <Image
                          src={review.foto || review.imagen}
                          alt="Profile Image"
                          width={55}
                          height={55}
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          src="/SVGs/user-placeholder.svg"
                          alt="Placeholder Image"
                          width={55}
                          height={55}
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-1">
                        {review.nombre_usuario || review.name}
                      </h3>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Image
                            key={i}
                            src={
                              i < Math.round(review.calificacion)
                                ? "/SVGs/starIcon.svg"
                                : "/SVGs/starIconEmpty.svg"
                            }
                            alt="star"
                            width={20}
                            height={20}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comentario}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md"
          >
            <Image
              src="/SVGs/izquierda.svg"
              alt="Flecha Izquierda"
              width={24}
              height={24}
            />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md"
          >
            <Image
              src="/SVGs/derecha.svg"
              alt="Flecha Derecha"
              width={24}
              height={24}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSlider;
