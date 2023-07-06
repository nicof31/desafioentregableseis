import { Router } from "express";
import UserModel from "../dao/models/users.model.js";
import UserManager from "../dao/managers/UserManager.js";

const routerSession = Router();
const userManager = new UserManager();



//--------RUTA ALTA USUARIO ---------------
routerSession.post("/register", async (req, res) => {
  try {
    let respuesta = await userManager.register(req.body);
  respuesta?.error
    //? res.status(400).send({ error: respuesta.error })
    ? res.render("user/registererror", { error: respuesta.error  })
    : res.redirect('/login');
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    return res.render("user/registererror", { error: 'Ocurrió un error en el registro de usuario' });
  }
});
 
//--------RUTA INICIO DE SESION----------------
routerSession.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.render("user/loginerror", { error: 'Credenciales inválidas' });
       //return res.status(400).send({ error: "Credenciales inválidas" });
    }

    req.session.name = `${user.first_name} ${user.last_name}`;
    req.session.email = req.body.email;
    req.session.rol = user.profile_type;

    res.redirect("/products");
  } catch (error) {
    console.error("Error en la autenticación:", error);
    return res.render("user/loginerror", { error: 'Ocurrió un error en la autenticación' });
    //res.status(500).send({ error: "Ocurrió un error en la autenticación" });
  }
});


//--------LOG OUT----------------
routerSession.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (!err) res.redirect("/login");
      else {
        res.render("user/profile", {
          title: "Registro",
          style: "home",
          user: null,
          logued: false,
          error: { message: err, status: true },
        });
      }
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send({ error: "Ocurrió un error al cerrar sesión" });
  }
});

export default routerSession;