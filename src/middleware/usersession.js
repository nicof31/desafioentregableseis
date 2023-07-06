export function sessionExist(req, res, next) {
  try {
    if (req.session?.email) return res.redirect("/products");
    else next();
  } catch (error) {
    console.error("Error al verificar la existencia de sesión:", error);
    res.status(500).send({ error: "Ocurrió un error al verificar la existencia de sesión" });
  }
}

export function auth(req, resp, next) {
  try {
    if (req.session?.email) next();
    else return resp.redirect("/login");
  } catch (error) {
    console.error("Error al verificar la autenticación de sesión:", error);
    res.status(500).send({ error: "Ocurrió un error al verificar la autenticación de sesión" });
  }
}