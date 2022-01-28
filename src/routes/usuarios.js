const express = require("express");
const auth = require("../middlewares/security/auth");
const actions = require("../database/actions");

const router = express.Router();

router.get("/user/:id", auth.validateToken, async (req, res) => {
  try {
    const body = req.body;
    let result = 0;
    let deniedService = false;
    if (body.ids.idRole == 1) {
      result = await actions.Select("SELECT * FROM usuarios WHERE id = :id", {
        id: req.params.id,
      });
    } else if (body.ids.id == req.params.id) {
      result = await actions.Select("SELECT * FROM usuarios WHERE id = :id", {
        id: req.params.id,
      });
    } else {
      deniedService = true;
    }

    if (deniedService == true) {
      res.status(400).json({
          success: false,
          msg: "The user has not permissions to carry out this action" });
    } else if (result.length > 0) {
      res.status(200).json({ success: true, msg: "FOUND_USER",
          quantity: result.length,
          data: result });
    } else {
      // 500 NOT_FOUND
      res.status(500).json({ success: false, msg: "NOT_FOUND_USER" });
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: `${error.message}` });
  }
});


router.get("/users", auth.authAdmin, async (req, res) => {
  try {
    const result = await actions.Select("SELECT * FROM usuarios", {});
    if (result.length>0){
      res.status(200)
        .json({ success: true, msg: "FOUND_USER", quantity: result.length, data: result });
    } else {
      res.status(500)
      .json({ success: false, msg: "NOT_FOUND_USER" });
    }
  } catch (error) {
    res.status(404).json({ success: false, msg: error.message });
  }
});

// Verifica si datos únicos ya están registrados
router.post(
  "/user",
  auth.validateFormat,
  auth.validateUser,
  async (req, res) => {
    //
    const user = req.body;
    console.log("req.body: ", user);
    user.idRole = 2;
    let result;
    user.nombreUsuario = user.nombreUsuario.toLowerCase();
    try {
      result = await actions.Insert(
        `INSERT INTO usuarios (nombreUsuario, nombreCompleto, email, telefono, direccion, contrasena, idRole) 
            VALUES (:nombreUsuario, :nombreCompleto, :email, :telefono, :direccion, :contrasena, :idRole)`,
        user
      );
      if (result.error) {
        // 404 GENERAL_ERROR
        es.status(404).json({success: false, msg: result.message});
      } else {
        res.status(200).json({success: true, msg: "CREATED_USER"});
        }
    } catch (error) {
      res.status(404).json({ success: false, msg: error.message });
    }
  }
);

// PATCH | Actualiza cualquier parámetro
router.patch("/user/:id", auth.validateToken, auth.validateFormatUpdate, async (req, res) => {
  const user = req.body;
  const Id = req.params.id;
  const exists = await actions.Select("SELECT * FROM usuarios WHERE id = :id", {
    id: req.params.id,
  });
  if (exists.length === 0) {
    res.status(500).json({ success: false, message: "NOT_FOUND_USER" });
  } else {
    try {
      console.log("token data:", req.body.ids)
      const userEmail = user.email ? user.email : exists[0].email;
      const userNombre = user.nombreCompleto
        ? user.nombreCompleto
        : exists[0].nombreCompleto;
      const userTelefono = user.telefono ? user.telefono : exists[0].telefono;
      const userDireccion = user.direccion
        ? user.direccion
        : exists[0].direccion;
      const userContrasena = user.contrasena
        ? user.contrasena
        : exists[0].contrasena;
      console.log(userEmail);

      const userUpdateData =           {
        email: userEmail,
        nombreCompleto: userNombre,
        telefono: userTelefono,
        direccion: userDireccion,
        contrasena: userContrasena
      }

      if(user.idRole!=undefined){
        userUpdateData.idRole = user.idRole;
      } else {
        userUpdateData.idRole = exists[0].idRole;
      }

      var update;
      var deniedService = false;
      if(req.body.ids.idRole==1){
        console.log("Admin service update!!!")
        update = await actions.Update(
          `UPDATE usuarios SET  email = :email, nombreCompleto = :nombreCompleto, idRole=:idRole, 
          telefono = :telefono, direccion  = :direccion, contrasena = :contrasena WHERE id = ${Id}`,
          userUpdateData
        );
      } else if(userUpdateData.idRole!=undefined){
        console.log("ERROR: Denied service update, due to not permisions to update idRole!");
        deniedService = true;
      } else if (req.body.ids.id == req.params.id){
        console.log("User service update!!!")
        update = await actions.Update(
          `UPDATE usuarios SET  email = :email, nombreCompleto = :nombreCompleto, telefono = :telefono, direccion  = :direccion, contrasena = :contrasena WHERE id = ${Id}`,
          userUpdateData
        );
      } else {
        console.log("ERROR: Denied service update, not has permisions to change values from others users!!!")
        deniedService = true;
      }

      console.log("update result:", update);
      if (deniedService == true) {
        res.status(400).json({
            success: false,
            msg: "The user has not permissions to carry out this action" });
      } else if (update.length > 0) {
        res.status(200).json({ success: true, msg: "UPDATED_USER" });
      } else {
        // 500 NOT_FOUND
        res.status(500).json({ success: false, msg: "NOT_FOUND_USER" });
      }

    } catch (error) {
      res.status(404).json({ success: false, msg: `${error.message}`,
      });
    }
  }
});

// PUT | Se usa para modificar todos los valores del usuario excepto el [id]
router.put("/user/:id", auth.authAdmin, auth.validateFormat, auth.validateUser, async (req, res) => {
    const user = req.body;
    const exists = await actions.Select(
      "SELECT * FROM usuarios WHERE id = :id",
      {
        id: req.params.id,
      }
    );
    console.log(exists);
    const Id = req.params.id;
    if (exists.length === 0) {
      res.status(500).json({ success: false, msg: "NOT_FOUND_USER" });
    } else {
      try {
        const result = await actions.Update(
          `UPDATE usuarios SET nombreUsuario=:nombreUsuario, email = :email, nombreCompleto = :nombreCompleto,  
          telefono = :telefono, direccion = :direccion, contrasena = :contrasena, idRole = :idRole WHERE id = ${Id}`,
          user
        );
        res.status(200).json({ success: true, msg: "UPDATED_USER" });
      } catch (error) {
        res.status(404).json({ success: false, msg: `${error.message}` });
      }
    }
  }
);

async function deleteOrdersOfUser(IdUser) {
  // deleted = COUNT(*)[] | deleted[0].count = n
  data = { IdUser: IdUser };
  const toDelete = await actions.Select(
    "SELECT id as idOrden FROM ordenes WHERE IdUser=:IdUser",
    data
  );
  console.log("count orders of user:", toDelete);

  if (toDelete.length > 0) {
    const UNSET_FK = await actions.query("SET FOREIGN_KEY_CHECKS = 0");
    for (let index = 0; index < toDelete.length; index++) {
      const res_DO = await actions.Delete(
        `DELETE FROM detallesordenes WHERE idOrden=:idOrden`,
        { idOrden: toDelete[index].idOrden }
      );
    }
    const res_O = await actions.Delete(
      `DELETE FROM ordenes WHERE IdUser=:IdUser`,
      data
    );
    const SET_FK = await actions.query("SET FOREIGN_KEY_CHECKS = 1");

    return {
      success: true,
      msg: "ORDERS_AND_DETAILSORDERS_DELETED",
      ordersDeleted: toDelete.length,
      details: toDelete,
    };
  } else {
    return { success: false, msg: "NOT_FOUND_ORDER" };
  }
}

router.delete("/user/:id", auth.authAdmin, async (req, res) => {
  const exists = await actions.Select("SELECT * FROM usuarios WHERE id = :id", {
    id: req.params.id,
  });
  if (exists.length === 0) {
    res.status(500).json({ success: false, message: "NOT_FOUND_USER" });
  } else {
    try {
      const resultDeleteOrders = await deleteOrdersOfUser(req.params.id);
      console.log(
        "RESULT OF DELETE ORDERS AND DETAILSORDERS:",
        resultDeleteOrders
      );

      const result = await actions.Delete(
        "DELETE FROM usuarios WHERE id = :id",
        { id: req.params.id }
      );
      res
        .status(200)
        .json({
          success: true,
          message: "DELETED_USER",
          data: result,
        });
    } catch (error) {
      res.status(404).json({ success: false, msg: error.message });
    }
  }
});
module.exports = router;