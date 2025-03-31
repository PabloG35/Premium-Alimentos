// src/components/CollageGrid.js
import React from "react";

const IMAGES = [
  { src: "/Dogs/french.jpg", caption: "Imagen 1" },
  { src: "/Dogs/schnauzer.jpg", caption: "Imagen 2" },
  { src: "/Dogs/chihuahua.png", caption: "Imagen 3" },
  { src: "/Dogs/pastor.png", caption: "Imagen 4" },
  { src: "/Dogs/ganadero.png", caption: "Imagen 5" },
  { src: "/Dogs/salchicha.png", caption: "Imagen 6" },
  { src: "/Dogs/golden.png", caption: "Imagen 7" },
  { src: "/Dogs/ingles.png", caption: "Imagen 8" },
  { src: "/Dogs/french.jpg", caption: "Imagen 9" },
];

const CollageGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {IMAGES.map((img, index) => (
        <div key={index} className="relative w-full h-48">
          <img
            src={img.src}
            alt={img.caption}
            className="w-full h-full object-cover"
          />

        </div>
      ))}
    </div>
  );
};

export default CollageGrid;
