// pages/home/Reviews.js
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import styles from "@/src/styles/reviews.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollHighlight from "@/src/components/Highlight";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({}); // Mapea id_producto -> producto
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const sliderRef = useRef(null);

  // Cargar las reseñas más recientes
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/usuario/resenas/recientes`)
      .then((res) => res.json())
      .then((data) =>
        setReviews(Array.isArray(data.resenas) ? data.resenas : [])
      )
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [BACKEND_URL]);

  // Cargar la información de cada producto relacionado de forma concurrente
  useEffect(() => {
    if (reviews.length > 0) {
      const fetchProductsForReviews = async () => {
        const missingReviews = reviews.filter(
          (review) => !products[review.id_producto]
        );
        const productRequests = missingReviews.map((review) => {
          const prodId = review.id_producto;
          return fetch(`${BACKEND_URL}/api/productos/${prodId}`)
            .then((res) => res.json())
            .then((data) => ({ prodId, data }))
            .catch((err) => {
              console.error("Error al cargar producto:", err);
              return null;
            });
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
    }
  }, [reviews, BACKEND_URL]);

  // Flechas personalizadas para el slider
  const CustomNextArrow = ({ className, style, onClick, pauseAutoplay }) => {
    const handleClick = () => {
      pauseAutoplay();
      onClick();
    };
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={handleClick}
      >
        <img src="/SVGs/derecha.svg" alt="Siguiente" />
      </div>
    );
  };

  const CustomPrevArrow = ({ className, style, onClick, pauseAutoplay }) => {
    const handleClick = () => {
      pauseAutoplay();
      onClick();
    };
    return (
      <div
        className={className}
        style={{ ...style, display: "block" }}
        onClick={handleClick}
      >
        <img src="/SVGs/izquierda.svg" alt="Anterior" />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: reviews.length > 1, // Solo infinito si hay más de una review
    speed: 500,
    autoplay: reviews.length > 1, // Autoplay solo si hay más de una review
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (
      <CustomNextArrow
        pauseAutoplay={() =>
          sliderRef.current && sliderRef.current.slickPause()
        }
      />
    ),
    prevArrow: (
      <CustomPrevArrow
        pauseAutoplay={() =>
          sliderRef.current && sliderRef.current.slickPause()
        }
      />
    ),
  };

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
      <div className={styles.sliderContainer}>
        <Slider
          ref={sliderRef}
          {...sliderSettings}
          className={styles.slickSlider}
        >
          {reviews.map((review) => {
            const product = products[review.id_producto];
            const fullStars = parseInt(review.calificacion, 10);
            const emptyStars = 5 - fullStars;
            return (
              <div key={review.id_reseña} className={styles.slideItem}>
                <div className={styles.imageContainer}>
                  <img
                    src={
                      product && product.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0].url_imagen
                        : "/SVGs/añadirImagen.svg"
                    }
                    alt={product?.nombre || "Producto"}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.reviewContent}>
                  <div className={styles.starsContainer}>
                    {Array.from({ length: fullStars }).map((_, i) => (
                      <img
                        key={`full-${i}`}
                        src="/SVGs/starIcon.svg"
                        alt="star full"
                        className={styles.productStar}
                      />
                    ))}
                    {Array.from({ length: emptyStars }).map((_, i) => (
                      <img
                        key={`empty-${i}`}
                        src="/SVGs/starIconEmpty.svg"
                        alt="star empty"
                        className={styles.productStar}
                      />
                    ))}
                  </div>
                  <p className={styles.reviewText}>“{review.comentario}”</p>
                  <p className={styles.reviewUser}>- {review.nombre_usuario}</p>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Reviews;
