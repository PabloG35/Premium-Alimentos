import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/Hero/HeroImage1.jpg",
  "/Hero/HeroImage2.jpg",
  "/Hero/HeroImage3.jpg",
  "/Hero/HeroImage4.jpg",
];

export default function HeroCarousel() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const delay = 5000;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 770);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: delay,
    fade: true,
    speed: 500,
    afterChange: (index) => setCurrentSlide(index),
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="relative w-full overflow-hidden h-[calc(100vh-112px)] mt-[112px] bg-zinc-200">
      <Slider ref={sliderRef} {...settings}>
        {images.map((src, index) => {
          const imageSrc = isMobile
            ? src.replace(".jpg", `_${index + 1}.jpg`)
            : src;
          return (
            <div key={index} className="relative w-full h-[calc(100vh-112px)]">
              <Image
                src={imageSrc}
                alt={`Hero image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 770px) 100vw, 100vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </Slider>
      {/* Controles en la esquina inferior derecha */}
      <div className="absolute bottom-5 right-5 flex items-center gap-4 bg-white rounded-full py-1">
        <button
          onClick={handlePrev}
          className="bg-white rounded-full shadow p-2"
        >
          <img src="/SVGs/izquierda.svg" alt="Anterior" className="w-4 h-4" />
        </button>
        <span className="text-black text-lg">
          {currentSlide + 1}/{images.length}
        </span>
        <button
          onClick={handleNext}
          className="bg-white rounded-full shadow p-2"
        >
          <img src="/SVGs/derecha.svg" alt="Siguiente" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
