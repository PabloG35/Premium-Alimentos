// src/pages/home/BrandSection
import { Separator } from "@/src/components/ui/separator";

const callouts = [
  {
    name: "Royal Canin",
    description: "Nutrición especializada, ciencia veterinaria.",
    imageSrc:
      "/RoyalCanin/RCLogo_Colored.jpg",
    imageAlt:
      "Royal Canin Logo",
    href: "#",
  },
  {
    name: "Taste of The Wild",
    description: "Dieta ancestral, sin granos.",
    imageSrc:
      "/ToTW/ToTWLogo_Colored.jpg",
    imageAlt:
      "Taste of The Wild Logo",
    href: "#",
  },
  {
    name: "Diamond Naturals",
    description: "Ingredientes naturales, nutrición equilibrada.",
    imageSrc:
      "/DiamondNaturals/DNLogo_Colored.jpg",
    imageAlt: "Diamond Naturals Logo",
    href: "#",
  },
  {
    name: "Blue Buffallo",
    description: "Nutrición natural, ingredientes genuinos.",
    imageSrc:
      "/BlueBuffalo/BFLogo_Colored.jpg",
    imageAlt: "Blue Buffallo Logo",
    href: "#",
  },
];

export default function BrandsSection() {
  return (
    <>
      <h1 className="heading text-5xl">Nuestras Marcas</h1>
      <Separator />
      <div className="">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:space-y-0">
              {callouts.map((callout) => (
                <div key={callout.name} className="group relative">
                  <img
                    alt={callout.imageAlt}
                    src={callout.imageSrc}
                    className="w-full rounded-lg bg-white object-cover group-hover:opacity-75 max-sm:h-80 sm:aspect-2/1 lg:aspect-square"
                  />
                  <h3 className="mt-6 text-sm text-gray-500">
                    <a href={callout.href}>
                      <span className="absolute inset-0" />
                      {callout.name}
                    </a>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {callout.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
