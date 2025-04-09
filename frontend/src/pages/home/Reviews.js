import React, { useState, useEffect } from "react";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import styles from "@/src/styles/reviews.module.css";
import ScrollHighlight from "@/src/components/Highlight";
import { Separator } from "@/src/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/components/ui/carousel";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  // Mapea id_producto -> producto
  const [products, setProducts] = useState({});
  // Índice del slide actualmente activo
  const [activeIndex, setActiveIndex] = useState(0);

  // Cargar reseñas recientes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/usuario/resenas/recientes`);
        const data = await res.json();
        setReviews(Array.isArray(data.resenas) ? data.resenas : []);
      } catch (error) {
        console.error("Error al cargar reseñas:", error);
      }
    };
    fetchReviews();
  }, []);

  // Auto-avanzar el slide cada 3 segundos
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [reviews]);

  // Cargar información de productos relacionados con las reseñas (si no se han cargado)
  useEffect(() => {
    if (reviews.length === 0) return;
    const fetchProductsForReviews = async () => {
      const missingReviews = reviews.filter(
        (review) => !products[review.id_producto]
      );
      const productRequests = missingReviews.map(async (review) => {
        const prodId = review.id_producto;
        try {
          const res = await fetch(`${BACKEND_URL}/api/productos/${prodId}`);
          const data = await res.json();
          return { prodId, data };
        } catch (err) {
          console.error("Error al cargar producto:", err);
          return null;
        }
      });
      const productResults = await Promise.all(productRequests);
      const newProducts = {};
      productResults.forEach((result) => {
        if (result) {
          newProducts[result.prodId] = result.data;
        }
      });
      setProducts((prev) => ({ ...prev, ...newProducts }));
    };
    fetchProductsForReviews();
  }, [reviews, BACKEND_URL, products]);

  if (reviews.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <ScrollHighlight
        highlightColor="#f1a252"
        highlightHeight="20px"
        highlightBottom="10px"
      >
        <h2 className={styles.reviewsHeading}>
          Lo que opinan nuestros clientes
        </h2>
      </ScrollHighlight>
      <Separator className="mt-2 mb-4" />
      <div className={styles.sliderContainer}>
        <Carousel className="w-full">
          <CarouselContent
            className="flex pointer-events-none transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {reviews.map((review) => {
              const productData = products[review.id_producto];
              const fullStars = parseInt(review.calificacion, 10);
              const emptyStars = 5 - fullStars;
              return (
                <CarouselItem
                  key={review.id_reseña}
                  className={styles.slideItem}
                >
                  <div
                    className={styles.imageContainer}
                    style={{ position: "relative" }}
                  >
                    <Image
                      src={
                        productData &&
                        productData.imagenes &&
                        productData.imagenes.length > 0
                          ? productData.imagenes[0].url_imagen
                          : "/SVGs/imagePlaceHolder.svg"
                      }
                      alt={productData?.nombre || "Producto"}
                      fill
                      className={styles.productImage}
                    />
                  </div>

                  <div className={styles.reviewContent}>
                    <div className={styles.starsContainer}>
                      {Array.from({ length: fullStars }).map((_, i) => (
                        <Image
                          key={`full-${i}`}
                          src="/SVGs/starIcon.svg"
                          alt="star full"
                          width={16} // Ajusta el tamaño según tu diseño
                          height={16} // Ajusta el tamaño según tu diseño
                          className={styles.productStar}
                        />
                      ))}

                      {Array.from({ length: emptyStars }).map((_, i) => (
                        <Image
                          key={`empty-${i}`}
                          src="/SVGs/starIconEmpty.svg"
                          alt="star empty"
                          width={16}
                          height={16}
                          className={styles.productStar}
                        />
                      ))}
                    </div>
                    <p className={styles.reviewText}>“{review.comentario}”</p>
                    <p className={styles.reviewUser}>
                      - {review.nombre_usuario}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {/* No se incluyen flechas ni interacciones */}
        </Carousel>
      </div>
    </div>
  );
};

export default Reviews;
