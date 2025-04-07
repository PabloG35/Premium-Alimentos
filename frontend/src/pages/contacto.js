"use client";

import { useState } from "react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import Layout from "@/src/components/Layout";
import {
  useNotification,
  NOTIFICATION_TYPES,
} from "@/src/context/NotificationContext";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { ToastAction } from "@/src/components/ui/toast";

function InlineNotification() {
  const { notifications, removeNotification } = useNotification();
  const alertNotification = notifications.find(
    (n) => n.type === NOTIFICATION_TYPES.ALERT && n.displayInline
  );
  if (!alertNotification) return null;
  return (
    <div className="space-y-2">
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

function ContactoContent() {
  const { addNotification } = useNotification();
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        displayInline: true,
      });
      return;
    }

    if (!agreed) {
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Error",
        description: "Debes aceptar la política de privacidad.",
        displayInline: true,
      });
      return;
    }

    const htmlContent = `
      <h1>Usuario quiere ponerse en contacto</h1>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Nombre:</strong> ${formData.firstName}</li>
        <li><strong>Apellido:</strong> ${formData.lastName}</li>
        <li><strong>Email:</strong> ${formData.email}</li>
        <li><strong>Teléfono:</strong> ${formData.phoneNumber}</li>
        <li><strong>Mensaje:</strong> ${formData.message}</li>
      </ul>
    `;
    const textContent = `
Usuario quiere ponerse en contacto

Nombre: ${formData.firstName}
Apellido: ${formData.lastName}
Email: ${formData.email}
Teléfono: ${formData.phoneNumber}
Mensaje: ${formData.message}
    `;

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "pablogaxiola35@gmail.com",
          subject: "Atencion a cliente",
          text: textContent,
          html: htmlContent,
        }),
      });

      if (res.ok) {
        addNotification({
          type: NOTIFICATION_TYPES.TOAST,
          title: "Exito!",
          description: "Te responderemos lo antes posible.",
          variant: "success",
          duration: 3000,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        const data = await res.json();
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
      }
    } catch (error) {
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
    }
  };

  return (
    <div className="h-[calc(100vh-112px)] pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl heading tracking-tight text-gray-900 sm:text-5xl">
          Contáctanos
        </h2>
        <InlineNotification />
        <p className="mt-2 text-lg text-gray-600">Queremos escucharte.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-xl space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="lastName">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="phoneNumber">Número de Teléfono</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="123-456-7890"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="message">Mensaje</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="terms" checked={agreed} onCheckedChange={setAgreed} />
          <Label htmlFor="terms">
            Acepta nuestra{" "}
            <a
              href="/privacidad"
              target="_blank"
              className="font-semibold text-pm-azulFuerte"
            >
              política de privacidad
            </a>
            .
          </Label>
        </div>
        <div>
          <button
            type="submit"
            disabled={!agreed}
            className={`w-full rounded-md px-4 py-2 text-white transition-colors duration-300 ${
              agreed
                ? "bg-pm-azul hover:bg-pm-azulFuerte"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Hablemos!
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Contacto() {
  return (
    <Layout>
      <ContactoContent />
    </Layout>
  );
}
