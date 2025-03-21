import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AuthContext } from "@/src/context/AuthContext";
import { CartContext } from "@/src/context/CartContext";

export default function ProductTemplate({
  product,
  showImage = true,
  showTitle = true,
  showPrice = true,
  showDescription = false,
  showRating = false,
  showIngredients = false,
  showAddButton = false, // botón para agregar al carrito o comprar
  showBuyButton = false,
  showVerMasButton = false,
  showExtraIcons = false, // grilla de 4 íconos extra
  buttonText = "Comprar ahora", // Prop para personalizar el texto del botón
  onAddToCart, // función opcional para carrito
  onBuyNow = () => {},
  customClasses = {},
}) {
  const router = useRouter();
  const [fetchedRating, setFetchedRating] = useState(null);
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Si stock es 0 o menor, consideramos que está agotado.
  const isOutOfStock = product?.stock <= 0;

  // Extraemos idProducto de forma segura
  const idProducto = product?.id_producto || null;

  useEffect(() => {
    if (showRating && idProducto) {
      fetch(`${BACKEND_URL}/api/usuario/resenas/promedio/${idProducto}`)
        .then((res) => res.json())
        .then((data) => {
          setFetchedRating(data.promedio);
        })
        .catch((err) => {
          console.error("Error fetching rating:", err);
          setFetchedRating(0);
        });
    }
  }, [product, showRating, idProducto]);

  const rating = fetchedRating !== null ? fetchedRating : 0;

  // Función por defecto para agregar al carrito
  const handleAddToCartDefault = async () => {
    if (!idProducto) return;
    try {
      await addToCart({ id_producto: idProducto, cantidad: 1 });
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar al carrito");
    }
  };

  const handleCartClick = onAddToCart ? onAddToCart : handleAddToCartDefault;

  return (
    <div
      className={`${customClasses.container || ""} relative ${
        isOutOfStock ? "opacity-50" : ""
      }`}
    >
      {/* Si el producto está agotado, mostramos un badge en la esquina superior derecha */}
      {isOutOfStock && (
        <div
          className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1"
          style={{ zIndex: 10 }}
        >
          Agotado
        </div>
      )}
      {showImage && (
        <div className={customClasses.imageContainer || ""}>
          {product.imagenes && product.imagenes.length > 0 ? (
            <img
              src={product.imagenes[0].url_imagen}
              alt={product.nombre}
              className={customClasses.image || ""}
            />
          ) : (
            <div className={customClasses.noImage || ""}>Sin imagen</div>
          )}
        </div>
      )}
      {showTitle && (
        <div className={customClasses.titleContainer || ""}>
          <h2 className={customClasses.title || ""}>{product.nombre}</h2>
        </div>
      )}
      {showPrice && (
        <p className={customClasses.price || ""}>${product.precio}</p>
      )}
      {showDescription && product.descripcion && (
        <p className={customClasses.description || ""}>{product.descripcion}</p>
      )}
      {showRating && (
        <div
          className={
            customClasses.rating ||
            "flex items-center justify-start starsContainer"
          }
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={
                rating >= i + 1
                  ? "/SVGs/starIcon.svg"
                  : "/SVGs/starIconEmpty.svg"
              }
              alt="star"
              className={customClasses.star || "productStar"}
            />
          ))}
          <span
            className={customClasses.ratingText || "ml-2 text-lg text-gray-600"}
          >
            {rating > 0 ? Number(rating).toFixed(1) : "0"}
          </span>
        </div>
      )}
      {showIngredients && product.ingredientes && (
        <div className={customClasses.ingredients || ""}>
          <h3 className={customClasses.ingredientsTitle || ""}>
            Ingredientes:
          </h3>
          <ul className={customClasses.ingredientsList || ""}>
            {Object.entries(product.ingredientes).map(([categoria, items]) => (
              <li key={categoria}>
                <span className={customClasses.ingredientCategory || ""}>
                  {categoria}:{" "}
                </span>
                {items.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(showAddButton || showBuyButton) && (
        <div className={customClasses.buttonContainer || ""}>
          {showAddButton && (
            <button
              onClick={handleCartClick}
              disabled={isOutOfStock}
              className={`${customClasses.addButton || ""} ${
                isOutOfStock ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {buttonText}
            </button>
          )}
          {showBuyButton && (
            <button
              onClick={onBuyNow}
              disabled={isOutOfStock}
              className={`${customClasses.buyButton || ""} ${
                isOutOfStock ? "bg-gray-400 cursor-not-allowed" : ""
              }`}
            >
              {buttonText}
            </button>
          )}
        </div>
      )}
      {showVerMasButton && (
        <div className={customClasses.verMasContainer || "mt-4"}>
          <button
            onClick={() => router.push(`/tienda/${idProducto}`)}
            className={
              customClasses.verMasButton ||
              "w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800 transition"
            }
          >
            Ver Más
          </button>
        </div>
      )}
      {showExtraIcons && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/SVGs/pagoseguro.svg"
              alt="Pago Seguro"
              width={50}
              height={50}
            />
            <span className="text-lg font-medium text-center">
              Pago
              <br />
              Seguro
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/SVGs/box.svg"
              alt="Envío Rápido"
              width={50}
              height={50}
            />
            <span className="text-lg font-medium text-center">
              Envío
              <br />
              Rápido
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/SVGs/calidad.svg"
              alt="Calidad garantizada"
              width={50}
              height={50}
            />
            <span className="text-lg font-medium text-center">
              Calidad
              <br />
              Garantizada
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/SVGs/datosseguros.svg"
              alt="Datos Seguros"
              width={50}
              height={50}
            />
            <span className="text-lg font-medium text-center">
              Datos
              <br />
              Seguros
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
