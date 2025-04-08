import { Separator } from "@/src/components/ui/separator";

const callouts = [
  {
    name: "Royal Canin",
    description: "Nutrición especializada, ciencia veterinaria.",
    imageSrc: "/RoyalCanin/RCLogo_Colored.jpg",
    imageAlt: "Royal Canin Logo",
    href: "#",
  },
  {
    name: "Taste of The Wild",
    description: "Dieta ancestral, sin granos.",
    imageSrc: "/ToTW/ToTWLogo_Colored.jpg",
    imageAlt: "Taste of The Wild Logo",
    href: "#",
  },
  {
    name: "Diamond Naturals",
    description: "Ingredientes naturales, nutrición equilibrada.",
    imageSrc: "/DiamondNaturals/DNLogo_Colored.jpg",
    imageAlt: "Diamond Naturals Logo",
    href: "#",
  },
  {
    name: "Blue Buffallo",
    description: "Nutrición natural, ingredientes genuinos.",
    imageSrc: "/BlueBuffalo/BFLogo_Colored.jpg",
    imageAlt: "Blue Buffallo Logo",
    href: "#",
  },
];

export default function BrandsSection() {
  return (
    <>
      <h1 className="heading text-5xl text-center mb-4">Nuestras Marcas</h1>
      <Separator />
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-6 grid max-md:grid-cols-2 grid-cols-4 gap-y-12 gap-x-6 max-md:gap-4">
          {callouts.map((callout) => (
            <div key={callout.name} className="group relative">
              <img
                src={callout.imageSrc}
                alt={callout.imageAlt}
                className="w-full rounded-lg bg-white object-cover group-hover:opacity-75"
              />
              <h3 className="mt-6 text-sm text-gray-500">
                <a href={callout.href} className="relative">
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
    </>
  );
}
