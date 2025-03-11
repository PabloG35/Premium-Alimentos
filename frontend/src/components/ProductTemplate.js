import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext"; // Importamos el contexto del carrito

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
  const { addToCart } = useContext(CartContext); // Extraemos la función del contexto

  // Extraemos idProducto de forma segura
  const idProducto = product?.id_producto || null;

  useEffect(() => {
    if (showRating && idProducto) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resenas/promedio/${idProducto}`
      )
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

  // Función por defecto para agregar al carrito usando el método del CartContext
  const handleAddToCartDefault = async () => {
    if (!idProducto) return;
    try {
      // Usamos addToCart del contexto, que internamente llama a fetchCart y actualiza el estado
      await addToCart({ id_producto: idProducto, cantidad: 1 });
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar al carrito");
    }
  };

  // Si se pasa onAddToCart se usa esa función; de lo contrario, se usa la función por defecto
  const handleCartClick = onAddToCart ? onAddToCart : handleAddToCartDefault;

  return (
    <div className={customClasses.container || ""}>
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
              className={customClasses.addButton || ""}
            >
              {buttonText}
            </button>
          )}
          {showBuyButton && (
            <button
              onClick={onBuyNow}
              className={customClasses.buyButton || ""}
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
