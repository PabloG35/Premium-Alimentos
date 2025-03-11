import pool from "../db.js";
import cloudinary from "../config/cloudinary.js";

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await pool.query(
      `SELECT p.*, 
              p.ingredientes::json AS ingredientes,
              COALESCE(
                json_agg(
                  json_build_object('url_imagen', i.url_imagen)
                ) FILTER (WHERE i.url_imagen IS NOT NULL), '[]'
              ) AS imagenes
       FROM productos p
       LEFT JOIN imagenes_producto i ON p.id_producto = i.id_producto
       GROUP BY p.id_producto
       ORDER BY p.fecha_creacion DESC`
    );
    return res.json(productos.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un solo producto por su ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const result = await pool.query(
      `SELECT p.*, 
         p.ingredientes::json AS ingredientes,
         COALESCE(
           json_agg(
             json_build_object('url_imagen', i.url_imagen)
           ) FILTER (WHERE i.url_imagen IS NOT NULL), '[]'
         ) AS imagenes
       FROM productos p
       LEFT JOIN imagenes_producto i ON p.id_producto = i.id_producto
       WHERE p.id_producto = $1
       GROUP BY p.id_producto`,
      [id_producto]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener los productos más recientes (máx. 8)
const obtenerProductosRecientes = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  try {
    const productos = await pool.query(
      `SELECT p.*, 
              p.ingredientes::json AS ingredientes,
              COALESCE(
                json_agg(
                  json_build_object('url_imagen', i.url_imagen)
                ) FILTER (WHERE i.url_imagen IS NOT NULL), '[]'
              ) AS imagenes
       FROM productos p
       LEFT JOIN imagenes_producto i ON p.id_producto = i.id_producto
       GROUP BY p.id_producto
       ORDER BY p.fecha_creacion DESC
       LIMIT 8`
    );
    return res.json(productos.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos recientes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener el producto más vendido
const obtenerProductoMasVendido = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, 
        p.ingredientes::json AS ingredientes,
        COALESCE(
          json_agg(json_build_object('url_imagen', i.url_imagen))
          FILTER (WHERE i.url_imagen IS NOT NULL), '[]'
        ) AS imagenes,
        COALESCE(SUM(detalle.cantidad), 0) AS total_ventas
      FROM productos p
      LEFT JOIN imagenes_producto i ON p.id_producto = i.id_producto
      LEFT JOIN detalles_orden detalle ON p.id_producto = detalle.id_producto
      GROUP BY p.id_producto
      ORDER BY total_ventas DESC
      LIMIT 1`
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener producto más vendido:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Añadir un nuevo producto
const agregarProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      marca,
      raza,
      ingredientes,
      edad,
    } = req.body;
    console.log("🟡 Archivos recibidos en backend:", req.files);
    if (!nombre || !precio || !stock || !marca || !raza || !edad) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios." });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "Debe subir al menos una imagen válida (JPG, JPEG, PNG).",
      });
    }
    let parsedIngredientes;
    if (typeof ingredientes === "string") {
      try {
        parsedIngredientes = JSON.parse(ingredientes);
      } catch (error) {
        parsedIngredientes = {};
      }
    } else {
      parsedIngredientes = ingredientes;
    }
    const nuevoProducto = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, marca, raza, ingredientes, edad)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_producto`,
      [
        nombre,
        descripcion || "",
        precio,
        stock,
        marca,
        raza,
        parsedIngredientes,
        edad,
      ]
    );
    const id_producto = nuevoProducto.rows[0].id_producto;
    const imagenes = req.files.map((file) => file.path);
    for (const urlImagen of imagenes) {
      await pool.query(
        `INSERT INTO imagenes_producto (id_producto, url_imagen) VALUES ($1, $2)`,
        [id_producto, urlImagen]
      );
    }
    return res.json({
      message: "Producto agregado correctamente",
      id_producto,
    });
  } catch (error) {
    console.error("❌ Error al agregar producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar un producto
const editarProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const {
      nombre,
      precio,
      marca,
      descripcion,
      stock,
      raza,
      ingredientes,
      edad,
    } = req.body;
    let parsedIngredientes;
    if (typeof ingredientes === "string") {
      try {
        parsedIngredientes = JSON.parse(ingredientes);
      } catch (error) {
        parsedIngredientes = {};
      }
    } else {
      parsedIngredientes = ingredientes;
    }
    const productoEditado = await pool.query(
      `UPDATE productos 
       SET nombre = $1, precio = $2, marca = $3, descripcion = $4, stock = $5, raza = $6, ingredientes = $7, edad = $8
       WHERE id_producto = $9 RETURNING *`,
      [
        nombre,
        precio,
        marca,
        descripcion,
        stock,
        raza,
        parsedIngredientes,
        edad,
        id_producto,
      ]
    );
    if (productoEditado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json({
      message: "Producto actualizado correctamente",
      producto: productoEditado.rows[0],
    });
  } catch (error) {
    console.error("Error al editar producto:", error);
    return res.status(500).json({ error: "Error al editar producto" });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;
    if (!id_producto) {
      return res.status(400).json({ error: "El id_producto es requerido." });
    }
    console.log("Iniciando eliminación del producto con id:", id_producto);
    const imagenesResult = await pool.query(
      `SELECT url_imagen FROM imagenes_producto WHERE id_producto = $1`,
      [id_producto]
    );
    const imagenes = imagenesResult.rows;
    if (imagenes.length > 0) {
      const eliminarImagenesPromises = imagenes.map(async (img) => {
        if (!img.url_imagen) return;
        try {
          const urlParts = img.url_imagen.split("/");
          if (urlParts.length === 0) throw new Error("URL no válida.");
          const fileWithExtension = urlParts.pop();
          const decodedFile = decodeURIComponent(fileWithExtension);
          const publicId = decodedFile.substring(
            0,
            decodedFile.lastIndexOf(".")
          );
          const fullPublicId = `productos/${publicId}`;
          const result = await cloudinary.uploader.destroy(fullPublicId);
          if (result.result !== "ok" && result.result !== "not found") {
            console.error(
              `No se pudo eliminar la imagen ${fullPublicId}:`,
              result
            );
          }
        } catch (error) {
          console.error(
            "Error al procesar o eliminar la imagen con URL:",
            img.url_imagen,
            error
          );
        }
      });
      await Promise.all(eliminarImagenesPromises);
    }
    await pool.query(`DELETE FROM imagenes_producto WHERE id_producto = $1`, [
      id_producto,
    ]);
    await pool.query(`DELETE FROM productos WHERE id_producto = $1`, [
      id_producto,
    ]);
    return res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const actualizarStock = async (req, res) => {
  try {
    const { id_producto } = req.params;
    const { stock } = req.body;
    const stockActualizado = await pool.query(
      "UPDATE productos SET stock = $1 WHERE id_producto = $2 RETURNING *",
      [stock, id_producto]
    );
    if (stockActualizado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.json({
      message: "Stock actualizado correctamente",
      producto: stockActualizado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar stock:", error);
    return res.status(500).json({ error: "Error al actualizar stock" });
  }
};

const subirImagenProducto = async (req, res) => {
  try {
    if (!req.file) {
      console.error("❌ No se recibió ninguna imagen");
      return res.status(400).json({ error: "No se ha subido ninguna imagen" });
    }
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "productos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    return res.json({ urlImagen: result.secure_url });
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    return res.status(500).json({ error: "Error al subir imagen" });
  }
};

export {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  editarProducto,
  eliminarProducto,
  actualizarStock,
  subirImagenProducto,
  obtenerProductosRecientes,
  obtenerProductoMasVendido,
};
