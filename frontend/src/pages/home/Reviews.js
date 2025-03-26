import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import styles from "@/src/styles/reviews.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollHighlight from "@/src/components/Highlight";
import Image from "next/image";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({}); // Maps id_producto -> producto
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const sliderRef = useRef(null);

  // Load the most recent reviews
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/usuario/resenas/recientes`)
      .then((res) => res.json())
      .then((data) =>
        setReviews(Array.isArray(data.resenas) ? data.resenas : [])
      )
      .catch((err) => console.error("Error al cargar reseñas:", err));
  }, [BACKEND_URL]);

  // Load product info for reviews concurrently
  useEffect(() => {
    if (reviews.length > 0) {
      const fetchProductsForReviews = async () => {
        // Include products as dependency so missing ones are determined from current state
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
  }, [reviews, BACKEND_URL, products]); // Added products to dependencies

  // Custom arrows for the slider using Next.js Image
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
        <Image src="/SVGs/derecha.svg" alt="Siguiente" width={16} height={16} />
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
        <Image
          src="/SVGs/izquierda.svg"
          alt="Anterior"
          width={16}
          height={16}
        />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: reviews.length > 1, // Infinite only if more than one review
    speed: 500,
    autoplay: reviews.length > 1, // Autoplay only if more than one review
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
                  <Image
                    src={
                      product && product.imagenes && product.imagenes.length > 0
                        ? product.imagenes[0].url_imagen
                        : "/SVGs/añadirImagen.svg"
                    }
                    alt={product?.nombre || "Producto"}
                    width={200}
                    height={200}
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
                        width={16}
                        height={16}
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
