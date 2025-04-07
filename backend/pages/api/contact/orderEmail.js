// pages/api/contact/orderEmail.js
import nodemailer from "nodemailer";

export const sendOrderCompletedEmail = async (orden) => {
  // Configurar el transporter utilizando Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,  // Asegúrate que esta variable tenga solo la dirección (p.ej. pablogaxiola@premiumalimentos.com)
      pass: process.env.EMAIL_PASS,
    },
  });

  // Construir el contenido del correo usando los datos de la orden
  const htmlContent = `
    <h1>Orden Completada</h1>
    <p>La orden <strong>${orden.numero_orden}</strong> se ha completado exitosamente.</p>
    <ul style="list-style: none; padding: 0;">
      <li><strong>ID de Orden:</strong> ${orden.id_orden}</li>
      <li><strong>Método de Pago:</strong> ${orden.metodo_pago}</li>
      <li><strong>Estado de Pago:</strong> ${orden.estado_pago}</li>
      <li><strong>Dirección de Envío:</strong> ${orden.direccion_envio}</li>
      <!-- Puedes agregar más detalles de la orden si es necesario -->
    </ul>
  `;

  const textContent = `
Orden Completada

ID de Orden: ${orden.id_orden}
Número de Orden: ${orden.numero_orden}
Método de Pago: ${orden.metodo_pago}
Estado de Pago: ${orden.estado_pago}
Dirección de Envío: ${orden.direccion_envio}
`;

  const mailOptions = {
    from: `"Premium Alimentos" <${process.env.EMAIL_USER}>`,
    to: "pablogaxiola35@gmail.com",  // Dirección a la que deseas que se envíe el correo
    subject: "Notificación de Orden Completada",
    text: textContent,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de orden completada enviado:", info.response);
  } catch (error) {
    console.error("Error enviando correo de orden completada:", error);
  }
};
