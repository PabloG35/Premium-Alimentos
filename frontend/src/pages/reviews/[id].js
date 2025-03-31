// src/pages/reviews/[id].js
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import Slider from "react-slick";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import React from "react";

const ratings = [1, 2, 3, 4, 5];

// Componente ProductCard
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
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <img
          src={
            producto.imagenes && producto.imagenes.length > 0
              ? producto.imagenes[0].url_imagen
              : "/SVGs/añadirImagen.svg"
          }
          alt={producto.nombre}
          className="w-48 h-48 object-cover mb-4 rounded-lg"
        />
        <h2 className="text-2xl font-semibold text-center mb-4">
          {producto.nombre}
        </h2>
        <div className="w-full mb-4">
          <Listbox value={selectedRating} onChange={onRatingChange}>
            <Listbox.Label className="block text-center mb-2">
              Calificación (1-5):
            </Listbox.Label>
            <Listbox.Button className="w-full border rounded p-2 text-center">
              {selectedRating} ⭐
            </Listbox.Button>
            <Listbox.Options className="border rounded mt-1">
              {ratings.map((num) => (
                <Listbox.Option
                  key={num}
                  value={num}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  {num} ⭐
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <div className="w-full mb-4">
          <label className="block text-center mb-2">Comentario:</label>
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
  // reviews: { [id_producto]: { rating, comment } }
  const [reviews, setReviews] = useState({});
  const [thankYouOpen, setThankYouOpen] = useState(false);

  // 1. Obtener datos de la orden
  useEffect(() => {
    if (!id) return;
    const fetchOrderData = async () => {
      try {
        const res = await fetch(`/api/usuario/resenas/estado/${id}`);
        if (!res.ok) throw new Error("Error al obtener datos de la orden");
        const data = await res.json();
        setOrderData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [id]);

  // 2. Para cada producto sin imágenes, obtener la primera imagen
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
            if (producto.imagenes && producto.imagenes.length > 0)
              return producto;
            try {
              const res = await fetch(`/api/productos/${producto.id_producto}`);
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
  }, [orderData]);

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

  const handleSubmitReview = async (productId) => {
    const reviewData = reviews[productId];
    if (!reviewData || !reviewData.rating) {
      alert("Por favor, selecciona una calificación");
      return;
    }
    try {
      const res = await fetch(`/api/usuario/resenas`, {
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
      // Remover el producto revisado de la lista
      setOrderData((prev) => ({
        ...prev,
        productos: prev.productos.filter(
          (prod) => prod.id_producto !== productId
        ),
      }));
      // Si al remover ya no quedan productos, mostrar Dialog
      if (orderData.productos.length === 1) {
        setThankYouOpen(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Slider responsive según el ejemplo proporcionado
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <p className="text-red-500 text-center">{error}</p>
      </Layout>
    );
  }
  if (!orderData || !orderData.productos || orderData.productos.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-center">
            ¡Gracias por su retroalimentación!
          </h1>
        </div>
      </Layout>
    );
  }

  const content =
    orderData.productos.length > 1 ? (
      <Slider {...sliderSettings}>
        {orderData.productos.map((producto) => (
          <div key={producto.id_producto} className="p-4">
            <ProductCard
              producto={producto}
              selectedRating={reviews[producto.id_producto]?.rating || 3}
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
        ))}
      </Slider>
    ) : (
      orderData.productos.map((producto) => (
        <ProductCard
          key={producto.id_producto}
          producto={producto}
          selectedRating={reviews[producto.id_producto]?.rating || 3}
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Reseñas para la Orden: {orderData.id_orden}
        </h1>
        {content}
      </div>
      <Transition appear show={thankYouOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {}}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900"
                >
                  ¡Gracias por su retroalimentación!
                </Dialog.Title>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                    onClick={() => router.push("/perfil")}
                  >
                    Volver a Perfil
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
}
