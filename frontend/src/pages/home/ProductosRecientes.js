import React, { useState, useEffect } from "react";
import ProductTemplate from "@/src/components/ProductTemplate";
import { Separator } from "@/src/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function RecentProductsCarousel() {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/productos/recientes`, {
          mode: "cors",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setRecentProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      }
    };
    fetchRecentProducts();
  }, []);

  return (
    <>
      <h1 className="heading text-5xl sm:text-center md:text-start">
        Recien llegados
      </h1>
      <Separator className="mt-2 mb-4" />
      <div className="mx-auto mb-14 w-full">
        <Carousel className="w-full max-w-full">
          {/* 
            -ml-2 contrarresta el pl-2 de cada item en pantallas <640
            y -ml-4 sería si tuviéramos md:pl-4. Pero en este caso
            solo usaremos pl-2 y sm:pl-2 → se ajusta solo con -ml-2.
          */}
          <CarouselContent className="-ml-2 flex">
            {recentProducts.map((product) => {
              const outOfStock = product?.stock <= 0;
              return (
                <CarouselItem
                  key={product.id_producto}
                  // 1 card <640, 2 cards [640..1023], 3 cards >=1024
                  className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <ProductTemplate
                      product={product}
                      showImage={true}
                      showTitle={true}
                      showPrice={true}
                      showRating={true}
                      showAddButton={true}
                      showVerMasButton={true}
                      redirectOnImageClick={true}
                      buttonText="Agregar carrito"
                      customClasses={{
                        container: "w-full",
                        imageContainer:
                          "h-80 flex items-center justify-center cursor-pointer",
                        image: "w-full h-full object-contain",
                        titleContainer: "h-10 overflow-hidden",
                        title: "text-sm font-bold text-center",
                        price: "text-center text-lg",
                        rating: "h-5 my-2 flex items-center justify-center",
                        star: "w-5 mx-0.5",
                        ratingText: "ml-2 text-sm",
                        buttonContainer: "flex items-center gap-2 mt-2",
                        addButton: outOfStock
                          ? "bg-[#89B4FA] text-white py-3 px-4 rounded w-[60%]"
                          : "bg-blue-500 text-white py-3 px-4 rounded w-[60%] transition-colors duration-300 hover:bg-blue-600",
                        verMasButton:
                          "bg-purple-500 text-white py-3 px-4 rounded w-[40%] transition-colors duration-300 hover:bg-purple-600",
                      }}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="!absolute left-0" />
          <CarouselNext className="!absolute right-0" />
        </Carousel>
      </div>
    </>
  );
}
