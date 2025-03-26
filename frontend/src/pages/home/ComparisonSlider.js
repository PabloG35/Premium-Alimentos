import React, { useRef, useState } from "react";
import Image from "next/image";

const ComparisonSlider = ({
  beforeImage,
  afterImage,
  handleImage,
  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState(50);

  // Update offset based on horizontal pointer position
  const updateOffset = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newOffset = ((clientX - rect.left) / rect.width) * 100;
      if (newOffset < 0) newOffset = 0;
      if (newOffset > 100) newOffset = 100;
      setOffset(newOffset);
    }
  };

  // Mouse events
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

  // Touch events
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
      {/* "Before" image as background */}
      <Image
        src={beforeImage}
        alt="Antes"
        fill
        className="object-cover select-none"
        draggable={false}
      />
      {/* "After" image visible only in the revealed portion */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${offset}%` }}
      >
        <Image
          src={afterImage}
          alt="Después"
          fill
          className="object-cover select-none"
          draggable={false}
        />
      </div>
      {/* Slider control */}
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
        <Image
          src={handleImage}
          alt="Handle"
          width={48}
          height={48}
          className="object-contain select-none"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ComparisonSlider;
