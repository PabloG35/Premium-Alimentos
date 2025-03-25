import ScrollHighlight from "@/src/components/Highlight";
import Image from "next/image";
import { useState } from "react";

// Componente Slider (Before/After)
function Slider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event) => {
    if (!isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="w-full h-full relative" onMouseUp={handleMouseUp}>
      <div
        className="relative w-full h-full overflow-hidden select-none"
        onMouseMove={handleMove}
        onMouseDown={handleMouseDown}
      >
        {/* Imagen "Antes" */}
        <Image
          alt="Antes"
          fill
          draggable={false}
          priority
          src="/Hero/ExtraInfo_1.jpg"
          style={{ objectFit: "cover", borderRadius: "50px" }}
          sizes="100vw 100vh"
        />

        {/* Imagen "Después" con clipPath según la posición */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden select-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            alt="Después"
            fill
            draggable={false}
            priority
            src="/Hero/ExtraInfo_2.jpg"
            style={{ objectFit: "cover", borderRadius: "50px" }}
            sizes="100vw 100vh"
          />
        </div>

        {/* Control del slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `calc(${sliderPosition}% - 1px)` }}
        >
          <div className="bg-white absolute rounded-full h-3 w-3 -left-1 top-[calc(50%-5px)]" />
        </div>
      </div>
    </div>
  );
}

// Componente general: Slider a la izquierda y sección informativa a la derecha
export default function SliderWithInfo() {
  const shortMessage = "NO TE PREOCUPES\nLO ESTAS HACIENDO BIEN";
  const bulletPoints = [
    "Solo marcas premium, sin compromisos ni excepciones",
    "Cada fórmula ha pasado nuestro filtro de confianza",
    "Ingredientes limpios, reales y seleccionados por expertos",
    "Cuidamos lo que más amas: su salud, energía y felicidad",
    "Te damos la paz de saber que estás haciendo lo correcto",
  ];

  return (
    <div className="w-full h-[70vh] flex">
      {/* Columna izquierda: Slider */}
      <div className="w-1/2 h-full">
        <Slider />
      </div>
      {/* Columna derecha: Información textual */}
      <div className="w-1/2 flex flex-col justify-center p-16">
        <p className="text-xl font-semibold mb-4">#PremiumAlimentos</p>

        <h1 className="text-3xl heading uppercase mb-4">
          {shortMessage.split("\n").map((line, index) => {
            if (index === 1) {
              return (
                <ScrollHighlight
                  key={index}
                  highlightColor="#74d4ff"
                  highlightHeight="27px"
                  highlightBottom="8px"
                >
                  {line}
                  <br />
                </ScrollHighlight>
              );
            }
            return (
              <span key={index}>
                {line}
                <br />
              </span>
            );
          })}
        </h1>

        <ul className="list-disc pl-5 space-y-2">
          {bulletPoints.map((point, index) => (
            <li key={index} className="text-lg">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
