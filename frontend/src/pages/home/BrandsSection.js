import Image from "next/image";

const brands = [
  { src: "/DiamondNaturals/DNLogo.png", alt: "Brand 1" },
  { src: "/ToTW/ToTWLogo.png", alt: "Brand 2" },
  { src: "/RoyalCanin/RCLogo.png", alt: "Brand 3" },
  { src: "/BlueBuffalo/BFLogo.png", alt: "Brand 4" },
];

export default function BrandsSection() {
  return (
    <div className="brands-section flex justify-center items-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="brand-container flex justify-center items-center rounded-lg p-4 shadow-md"
            style={{
              backgroundColor: "#e4e4e7", 
              width: "clamp(150px, 18vw, 250px)", // Responsive sizing
              height: "clamp(150px, 18vw, 250px)",
            }}
          >
            <div className="brand-image-wrapper">
              <Image
                src={brand.src}
                alt={brand.alt}
                width={300}
                height={300}
                className="brand-logo"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="line"></div>
    </div>
    
  );
}

