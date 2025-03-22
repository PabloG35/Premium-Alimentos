// controllers/carrito.js
import pool from "@/db.js";

const obtenerCarrito = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const carrito = await pool.query(
      `SELECT c.id_producto, p.nombre, p.precio, c.cantidad, (p.precio * c.cantidad) AS subtotal
       FROM carrito c
       INNER JOIN productos p ON c.id_producto = p.id_producto
       WHERE c.id_usuario = $1`,
      [id_usuario]
    );
    return res.json({ carrito: carrito.rows });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const agregarAlCarrito = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto, cantidad } = req.body;
    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "Datos inválidos" });
    }
    const producto = await pool.query(
      "SELECT stock FROM productos WHERE id_producto = $1",
      [id_producto]
    );
    if (producto.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    if (producto.rows[0].stock < cantidad) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }
    const productoEnCarrito = await pool.query(
      "SELECT cantidad FROM carrito WHERE id_usuario = $1 AND id_producto = $2",
      [id_usuario, id_producto]
    );
    if (productoEnCarrito.rows.length > 0) {
      const nuevaCantidad = productoEnCarrito.rows[0].cantidad + cantidad;
      if (nuevaCantidad > producto.rows[0].stock) {
        return res
          .status(400)
          .json({ error: "No puedes agregar más de lo disponible en stock" });
      }
      await pool.query(
        "UPDATE carrito SET cantidad = $1 WHERE id_usuario = $2 AND id_producto = $3",
        [nuevaCantidad, id_usuario, id_producto]
      );
    } else {
      await pool.query(
        "INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES ($1, $2, $3)",
        [id_usuario, id_producto, cantidad]
      );
    }
    return res.json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const eliminarDelCarrito = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto } = req.params;
    const productoEnCarrito = await pool.query(
      "SELECT * FROM carrito WHERE id_usuario = $1 AND id_producto = $2",
      [id_usuario, id_producto]
    );
    if (productoEnCarrito.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }
    await pool.query(
      "DELETE FROM carrito WHERE id_usuario = $1 AND id_producto = $2",
      [id_usuario, id_producto]
    );
    return res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const calcularTotal = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const carrito = await pool.query(
      `SELECT SUM(p.precio * c.cantidad) AS subtotal
       FROM carrito c
       INNER JOIN productos p ON c.id_producto = p.id_producto
       WHERE c.id_usuario = $1`,
      [id_usuario]
    );
    const subtotal = carrito.rows[0].subtotal || 0;
    const envio = subtotal >= 999 ? 0 : 199;
    const total = subtotal + envio;
    return res.json({ subtotal, envio, total });
  } catch (error) {
    console.error("Error al calcular total:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export { obtenerCarrito, agregarAlCarrito, eliminarDelCarrito, calcularTotal };
