// src/pages/api/contact/email.js
import nodemailer from "nodemailer";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { to, subject, text, html } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Contacto" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    ...(html && { html }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email", error });
  }
}
