import Image from "next/image";

const brands = [
  {
    src: "/RoyalCanin/RCLogo.png",
    alt: "Royal Canin",
    description:
      "Nutrición de precisión para perros excepcionales. Formulado con respaldo científico y veterinario, Royal Canin no deja nada al azar. Cada croqueta está diseñada para razas y necesidades específicas, porque cada perro merece una dieta hecha a su medida.",
    bgColor: "#D5AD6B", // Color de fondo para Royal Canin
  },
  {
    src: "/ToTW/ToTWLogo.png",
    alt: "Taste of the Wild",
    description:
      "El ADN de un lobo en cada bocado. Sin granos, con carnes reales y superalimentos, Taste of the Wild nutre el instinto natural de tu perro. Alimentación inspirada en la naturaleza, con ingredientes que honran su linaje salvaje.",
    bgColor: "#D5D4C3", // Color de fondo para Taste of the Wild
  },
  {
    src: "/BlueBuffalo/BFLogo.png",
    alt: "Blue Buffalo",
    description:
      "Ingredientes de verdad, salud de verdad. Con proteínas de alta calidad y LifeSource Bits®, Blue Buffalo ofrece una nutrición premium que cuida la inmunidad, el pelaje y la vitalidad de tu mejor amigo.",
    bgColor: "#335080", // Color de fondo para Blue Buffalo
  },
  {
    src: "/DiamondNaturals/DNLogo.png",
    alt: "Diamond Naturals",
    description:
      "Nutrición premium sin pagar de más. Diamond Naturals equilibra calidad y accesibilidad con ingredientes funcionales como probióticos y superalimentos. Más que comida, un compromiso con la salud canina.",
    bgColor: "#FFEAD0", // Color de fondo para Diamond Naturals
  },
];

export default function BrandsSection() {
  return (
    <div className="space-y-12 mx-auto">
      {brands.map((brand, index) => (
        <div key={index} className="w-full px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
            {index % 2 === 0 ? (
              <>
                {/* Logo a la izquierda */}
                <div
                  className="rounded-lg shadow-md flex items-center justify-center"
                  style={{
                    backgroundColor: brand.bgColor,
                    width: "clamp(150px, 20vw, 250px)",
                    height: "clamp(150px, 20vw, 250px)",
                  }}
                >
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
                {/* Descripción a la derecha */}
                <div className="brand-description text-sm max-w-xl text-center">
                  {brand.description}
                </div>
              </>
            ) : (
              <>
                {/* Descripción a la izquierda */}
                <div className="brand-description text-sm max-w-xl text-center">
                  {brand.description}
                </div>
                {/* Logo a la derecha */}
                <div
                  className="brand-logo-container rounded-lg shadow-md flex items-center justify-center"
                  style={{
                    backgroundColor: brand.bgColor,
                    width: "clamp(150px, 18vw, 250px)",
                    height: "clamp(150px, 18vw, 250px)",
                  }}
                >
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={250}
                    height={250}
                    className="object-contain"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
