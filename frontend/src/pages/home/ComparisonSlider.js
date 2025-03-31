// src/components/ComparisonSlider.js
import React, { useRef, useState } from "react";

const ComparisonSlider = ({
  beforeImage,
  afterImage,
  handleImage,
  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(50);

  // Función para actualizar el offset basado en la posición horizontal del puntero
  const updateOffset = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newOffset = ((clientX - rect.left) / rect.width) * 100;
      if (newOffset < 0) newOffset = 0;
      if (newOffset > 100) newOffset = 100;
      setOffset(newOffset);
    }
  };

  // Eventos para mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    const onMouseMove = (e) => {
      updateOffset(e.clientX);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // Eventos para touch
  const handleTouchStart = (e) => {
    e.preventDefault();
    const onTouchMove = (e) => {
      updateOffset(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {/* Imagen "Antes" en fondo */}
      <img
        src={beforeImage}
        alt="Antes"
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
      />
      {/* Imagen "Después" se muestra solo en la parte revelada */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${offset}%` }}
      >
        <img
          src={afterImage}
          alt="Después"
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
        />
      </div>
      {/* Control deslizante */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="absolute top-0 bottom-0 flex items-center"
        style={{
          left: `${offset}%`,
          transform: "translateX(-50%)",
          cursor: "ew-resize",
        }}
      >
        <img
          src={handleImage}
          alt="Handle"
          className="w-12 h-12 object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ComparisonSlider;
