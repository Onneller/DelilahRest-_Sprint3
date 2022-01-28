const express = require("express");
const router = express.Router();
const actions = require("../database/actions");
const auth = require("../middlewares/security/auth");

router.get("/product/:id", auth.validateToken, async (req, res) => {
  try {
    const result = await actions.Select(
      "SELECT * FROM productos WHERE id = :id",
      { id: req.params.id }
    );
    if (result.length === 0) {
      res.status(500).json({ success: false, msg: "NOT_FOUND_PRODUCT" });
    } else {
      res.status(200).json({ success: true, msg: "FOUND_PRODUCT", quantity: result.length, data: result });
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.get("/products", auth.validateToken, async (req, res) => {
  try {
    const result = await actions.Select("SELECT * FROM productos", {});
    res.status(200).json({ success: true, quantity: result.length, data: result });
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

router.put("/product/:id", auth.authAdmin, auth.validateFormatProduct, async (req, res) => {
  // Actualizar todo el producto
  const product = req.body;
  const exists = await actions.Select(
    "SELECT * FROM productos WHERE id = :id",
    { id: req.params.id }
  );
  const Id = req.params.id;
  if (exists.length === 0) {
    res.status(500).json({ success: false, msg: "NOT_FOUND_PRODUCT" });
  } else {
    try {
      const result = await actions.Update(
        `UPDATE productos SET nombre =:nombre, valor =:valor, foto =:foto  WHERE id = ${Id}`,
        product);
      res.status(200).json({ success: true, msg: "UPDATED_PRODUCT" });
    } catch (error) {
      res.status(404).json({success: false, msg: error.message});
    }
  }
});

router.post("/product", auth.authAdmin, auth.validateFormatProduct, async (req, res) => {
  const product = req.body;
  product.nombreUsuario = product.nombre.toLowerCase();

  const existsNombre = await actions.Select(
    "SELECT * FROM productos WHERE nombre = :nombre",
    { nombre: req.body.nombre }
  );
  console.log(existsNombre);
  if (existsNombre.length > 0) {
    res.status(500).json({ success: false, msg: "PRODUCT_ALREADY_EXIST" });
  } else {
    try {
      const result = await actions.Insert(
        `INSERT INTO productos (nombre, valor, foto) VALUES (:nombre, :valor, :foto)`,
        product);
      res.status(200).json({ success: true, msg: "CREATED_PRODUCT"});
    } catch (error) {
      res.status(404).json({success: false, msg: error.message});
    }
  }
});

router.delete("/product/:id", auth.authAdmin, async (req, res) => {
  const exists = await actions.Select(
    "SELECT * FROM productos WHERE id = :id",
    { id: req.params.id }
  );
  if (exists.length === 0) {
    res.status(500).json({ success: false, msg: "NOT_FOUND_PRODUCT" });
  } else {
    try {
      const result = await actions.Delete(
        "DELETE FROM productos WHERE id = :id", { id: req.params.id } );

      res.status(200).json({ success: true, msg: "DELETED_PRODUCT" });
    } catch (error) {
      res.status(404).json({success: false, msg: error.message});
    }
  }
});

router.patch("/product/:id", auth.authAdmin, auth.validateFormatProductUpdate, async (req, res) => {
  // Actualizar solo una propiedad del producto
  const product = req.body;
  const Id = req.params.id;
  const exists = await actions.Select(
    "SELECT * FROM productos WHERE id = :id",
    { id: req.params.id }
  );
  if (exists.length === 0) {
    res.status(500).json({ success: false, msg: "NOT_FOUND_PRODUCT" });
  } else {
    try {
      const productId = product.id ? product.id : exists[0].id;
      const productNombre = product.nombre ? product.nombre : exists[0].nombre;
      const productValor = product.valor ? product.valor : exists[0].valor;
      const productFoto = product.foto ? product.foto : exists[0].foto;
      const update = await actions.Update(
        `UPDATE productos SET  id = :id, nombre = :nombre, valor = :valor, foto = :foto WHERE id = ${Id}`,
        {
          id: productId,
          nombre: productNombre,
          valor: productValor,
          foto: productFoto,
        }
      );
      res.status(200).json({ success: true, msg: "UPDATED_PRODUCT" });
    } catch (error) {
      res.status(404).json({success: false, msg: error.message});
    }
  }
});

module.exports = router;
