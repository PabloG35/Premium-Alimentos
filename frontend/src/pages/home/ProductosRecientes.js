// src/componentes/pages/home/ProductosRecientes
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import styles from "../../styles/productosRecientes.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductTemplate from "@/src/components/ProductTemplate";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

export default function RecentProductsCarousel() {
  const [recentProducts, setRecentProducts] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const url = `${BACKEND_URL}/api/productos/recientes`;
        console.log("Fetching productos recientes desde:", url);
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setRecentProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };

    fetchRecentProducts();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
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
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="recent-products-carousel p-4">
      <Slider ref={sliderRef} {...sliderSettings}>
        {recentProducts.map((product) => (
          <div key={product.id_producto} className="p-2">
            <ProductTemplate
              product={product}
              showImage={true}
              showTitle={true}
              showPrice={true}
              showRating={true}
              showAddButton={true}
              buttonText="Agregar carrito"
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
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
