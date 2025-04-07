// pages/ordenes/reviews/[id].js

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useGlobalLoading } from "@/context/GlobalLoadingContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Asegúrate de que la ruta es la correcta para admin
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ToastAction } from "@/components/ui/toast";
import {
  useNotification,
  NOTIFICATION_TYPES,
} from "@/context/NotificationContext";

// 1. Notificación inline para mostrar alertas en pantalla
function InlineNotification() {
  const { notifications, removeNotification } = useNotification();
  const alertNotification = notifications.find(
    (n) => n.type === NOTIFICATION_TYPES.ALERT && n.displayInline
  );
  if (!alertNotification) return null;

  return (
    <div className="flex justify-center my-4">
      <Alert
        key={alertNotification.id}
        variant="destructive"
        onClick={() => removeNotification(alertNotification.id)}
      >
        <AlertTitle>{alertNotification.title}</AlertTitle>
        <AlertDescription>{alertNotification.description}</AlertDescription>
      </Alert>
    </div>
  );
}

// 2. Componente de estrellas personalizado (Rating)
const CustomRating = ({ value = 0, onChange, max = 5, editable = false }) => {
  const [permanentRating, setPermanentRating] = useState(value);
  const [temporaryRating, setTemporaryRating] = useState(null);
  const [isFixed, setIsFixed] = useState(false);

  const handleMouseEnter = (index) => {
    if (editable && !isFixed) {
      setTemporaryRating(index + 1);
    }
  };

  const handleMouseLeave = () => {
    if (!isFixed) {
      setTemporaryRating(null);
    }
  };

  const handleClick = (index) => {
    if (editable) {
      const newRating = index + 1;
      setPermanentRating(newRating);
      onChange(newRating);
      setIsFixed(true);
    }
  };

  const ratingToShow =
    temporaryRating !== null ? temporaryRating : permanentRating;

  return (
    <div className="flex justify-center" onMouseLeave={handleMouseLeave}>
      {Array.from({ length: max }).map((_, index) => (
        <div
          key={index}
          className={editable ? "cursor-pointer" : "cursor-default"}
          onMouseEnter={() => handleMouseEnter(index)}
          onClick={() => handleClick(index)}
        >
          {index < ratingToShow ? (
            <img
              src="/SVGs/starIcon.svg"
              alt="Estrella llena"
              className="w-6 h-6"
            />
          ) : (
            <img
              src="/SVGs/starIconEmpty.svg"
              alt="Estrella vacía"
              className="w-6 h-6"
            />
          )}
        </div>
      ))}
    </div>
  );
};

// 3. Tarjeta de producto que usa el CustomRating y un textarea para el comentario
const ProductCard = React.memo(
  ({
    producto,
    selectedRating,
    comment,
    onRatingChange,
    onCommentChange,
    onSubmit,
    disabled,
  }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
        <img
          src={
            producto.imagenes && producto.imagenes.length > 0
              ? producto.imagenes[0].url_imagen
              : "/SVGs/añadirImagen.svg"
          }
          alt={producto.nombre}
          className="w-48 h-48 object-cover mb-4 rounded-lg mx-auto"
        />
        <h2 className="text-2xl font-semibold mb-4">{producto.nombre}</h2>
        <div className="w-full mb-4">
          <CustomRating
            value={selectedRating}
            onChange={onRatingChange}
            editable={true}
            max={5}
          />
        </div>
        <div className="w-full mb-4">
          <label className="block mb-2">Comentario:</label>
          <textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Escribe tu reseña..."
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {disabled ? "Reseña completada" : "Enviar Reseña"}
        </button>
      </div>
    );
  }
);

export default function ReviewsPage() {
  const router = useRouter();
  const { id } = router.query; // id_orden
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState({});
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const { addNotification } = useNotification();
  const { setIsLoading } = useGlobalLoading();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 4. Fetch de datos de la orden para admin usando el endpoint correspondiente
  useEffect(() => {
    if (!id) return;
    const fetchOrderData = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/estado/${id}`);
        if (!res.ok) throw new Error("Error al obtener datos de la orden");
        const data = await res.json();

        // Filtramos los productos ya reseñados (asumiendo que la propiedad "resenada" es true si ya se hizo la reseña)
        const filteredData = {
          ...data,
          productos: data.productos.filter((prod) => !prod.resenada),
        };

        setOrderData(filteredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [id, BACKEND_URL]);

  // 5. Obtener imagen en caso de que el producto no la tenga, usando la API de productos
  useEffect(() => {
    if (
      orderData &&
      orderData.productos &&
      orderData.productos.length > 0 &&
      orderData.productos.some(
        (prod) =>
          !prod.imagenes || (prod.imagenes && prod.imagenes.length === 0)
      )
    ) {
      const fetchImages = async () => {
        const updatedProducts = await Promise.all(
          orderData.productos.map(async (producto) => {
            if (producto.imagenes && producto.imagenes.length > 0) {
              return producto;
            }
            try {
              const res = await fetch(
                `${BACKEND_URL}/api/productos/${producto.id_producto}`
              );
              if (res.ok) {
                const productDetails = await res.json();
                const firstImage =
                  productDetails.imagenes && productDetails.imagenes.length > 0
                    ? productDetails.imagenes[0].url_imagen
                    : "/SVGs/añadirImagen.svg";
                return { ...producto, imagenes: [{ url_imagen: firstImage }] };
              }
              return {
                ...producto,
                imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
              };
            } catch (error) {
              console.error("Error al obtener imagen del producto:", error);
              return {
                ...producto,
                imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
              };
            }
          })
        );
        setOrderData((prev) => ({ ...prev, productos: updatedProducts }));
      };
      fetchImages();
    }
  }, [orderData, BACKEND_URL]);

  // 6. Manejo de rating y comentario para cada producto
  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  // 7. Validate and send review with global loading overlay
  const handleSubmitReview = async (productId) => {
    const reviewData = reviews[productId];

    if (!reviewData || !reviewData.rating) {
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Error",
        description: "Por favor, selecciona una calificación.",
        displayInline: true,
      });
      return;
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 25) {
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Error",
        description: "El comentario debe tener al menos 25 caracteres.",
        displayInline: true,
      });
      return;
    }

    // Activate global loading overlay
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuario/resenas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_orden: id,
          id_producto: productId,
          calificacion: reviewData.rating,
          comentario: reviewData.comment || "",
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al enviar la reseña");
      }

      // Update state by filtering out the reviewed product
      setOrderData((prev) => ({
        ...prev,
        productos: prev.productos.filter(
          (prod) => prod.id_producto !== productId
        ),
      }));

      addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        title: "¡Gracias!",
        description: "El feedback se ha registrado correctamente.",
        variant: "success",
        duration: 3000,
      });

      if (orderData.productos.length === 1) {
        setThankYouOpen(true);
      }
    } catch (err) {
      addNotification({
        type: NOTIFICATION_TYPES.TOAST,
        variant: "destructive",
        duration: 3000,
        action: (
          <ToastAction
            altText="Ir a FAQ"
            onClick={() => (window.location.href = "/")}
          >
            FAQ
          </ToastAction>
        ),
      });
    } finally {
      // Deactivate global loading overlay regardless of outcome
      setIsLoading(false);
    }
  };

  // 8. Render de carga, error o sin productos para reseñar
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!orderData || !orderData.productos || orderData.productos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl heading text-center">
          ¡Gracias por el feedback!
        </h1>
      </div>
    );
  }

  // Si hay más de un producto, se muestra en un Carousel; de lo contrario, se lista directamente
  const content =
    orderData.productos.length > 1 ? (
      <Carousel className="w-full">
        <CarouselContent>
          {orderData.productos.map((producto) => (
            <CarouselItem key={producto.id_producto}>
              <div className="p-4">
                <ProductCard
                  producto={producto}
                  selectedRating={reviews[producto.id_producto]?.rating || 0}
                  comment={reviews[producto.id_producto]?.comment || ""}
                  onRatingChange={(value) =>
                    handleRatingChange(producto.id_producto, value)
                  }
                  onCommentChange={(value) =>
                    handleCommentChange(producto.id_producto, value)
                  }
                  onSubmit={() => handleSubmitReview(producto.id_producto)}
                  disabled={producto.resenada}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ) : (
      orderData.productos.map((producto) => (
        <ProductCard
          key={producto.id_producto}
          producto={producto}
          selectedRating={reviews[producto.id_producto]?.rating || 0}
          comment={reviews[producto.id_producto]?.comment || ""}
          onRatingChange={(value) =>
            handleRatingChange(producto.id_producto, value)
          }
          onCommentChange={(value) =>
            handleCommentChange(producto.id_producto, value)
          }
          onSubmit={() => handleSubmitReview(producto.id_producto)}
          disabled={producto.resenada}
        />
      ))
    );

  // 9. Render final: muestra el formulario de reseñas y un diálogo que redirige a la gestión de órdenes
  return (
    <>
      <div className="max-w-xl h-[calc(100vh-112px)] pt-9 mx-auto text-center">
        <h1 className="text-3xl heading mb-4">
          Reseñas para la Orden: {orderData.id_orden}
        </h1>

        <InlineNotification />

        {content}
      </div>

      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="max-w-md p-6 text-center">
          <DialogTitle className="text-2xl font-bold">
            ¡Gracias por el feedback!
          </DialogTitle>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
              onClick={() => router.push("/ordenes")}
            >
              Volver a Órdenes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
