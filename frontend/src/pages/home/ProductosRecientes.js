import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
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
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
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
    <div className="mx-auto">
      <Slider ref={sliderRef} {...sliderSettings}>
        {recentProducts.map((product) => {
          const outOfStock = product?.stock <= 0;
          return (
            <div key={product.id_producto} className="px-6">
              <ProductTemplate
                product={product}
                showImage={true}
                showTitle={true}
                showPrice={true}
                showRating={true}
                showAddButton={true}
                showVerMasButton={true}
                redirectOnImageClick={true}
                buttonText="Agregar carrito"
                customClasses={{
                  container: "w-[100%]",
                  imageContainer:
                    "h-80 flex items-center justify-center cursor-pointer",
                  image: "w-full h-full object-contain",
                  titleContainer: "h-10 overflow-hidden",
                  title: "text-sm font-bold text-center",
                  price: "text-center text-lg",
                  rating: "h-5 my-2 flex items-center justify-center",
                  star: "w-5 mx-0.5",
                  ratingText: "ml-2 text-sm",
                  buttonContainer: "flex items-center gap-2 mt-2",
                  addButton: outOfStock
                    ? "bg-[#89B4FA] text-white py-3 px-4 rounded w-[60%]"
                    : "bg-blue-500 text-white py-3 px-4 rounded w-[60%] transition-colors duration-300 hover:bg-blue-600",
                  verMasButton:
                    "bg-purple-500 text-white py-3 px-4 rounded w-[40%] transition-colors duration-300 hover:bg-purple-600",
                }}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
