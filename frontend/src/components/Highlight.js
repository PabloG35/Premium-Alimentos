import { useState, useEffect, useRef } from "react";

const ScrollHighlight = ({
  children,
  highlightColor = "#FFA500", // Color por defecto (naranja)
  highlightHeight = "28px", // Altura por defecto
  highlightBottom = "0px", // Distancia inferior por defecto
}) => {
  const [progress, setProgress] = useState(0);
  const elementRef = useRef(null);

  const handleScroll = () => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Se completa el progress al recorrer el 70% del alto de la ventana
    let newProgress = (windowHeight - rect.top) / (windowHeight * 0.7);
    newProgress = Math.max(0, Math.min(newProgress, 1));
    setProgress(newProgress);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    // Ejecutar al montar para el valor inicial
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={elementRef} className="relative inline-block z-0">
      {/* Underline configurado vía props, se posiciona detrás del contenido */}
      <span
        className="absolute left-0 z-[-1] rounded-md"
        style={{
          width: "100%",
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
          transition: "transform 0.1s linear",
          backgroundColor: highlightColor,
          height: highlightHeight,
          bottom: highlightBottom,
        }}
      ></span>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ScrollHighlight;
