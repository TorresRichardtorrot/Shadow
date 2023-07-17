const express = require("express");

const app =require ('../app.js')
const cors = require('cors');
const mongoose = require("mongoose");
require("dotenv").config();
const userRoute = require("./routes/user");
const productRoute = require("./routes/productos");
const ventasRoute = require("./routes/ventas");
const mensajeRoute = require("./routes/mensajes");
const routerPaypal = require('./routes/paypal')


// Configuraciones

//  Middlewares
app.use(express.json());

const port = process.env.PORT || 3000;
const TR = process.env.TR





// Configuración de CORS para permitir solo peticiones desde una dirección específica 
// *** Cambiar al subir a un hostin ***



const origen = [
  "http://localhost:3000",
  "http://192.168.0.109:3000",
  "https://api-m.sandbox.paypal.com",
  "http://localhost:9000"
];

app.use(cors(origen));
// app.use(cors({
//   origin: function (origin, callback) {
//     if (origen.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback("** Torres Richard te dice: Acceso denegado (✌ﾟ∀ﾟ)☞ **\n" + TR);
//     }
//   }
// }));


//rutas
app.use("/shadowsell", userRoute);
app.use("/shadowsell", productRoute);
app.use("/shadowsell", ventasRoute);
app.use("/shadowsell", mensajeRoute);
app.use("/shadowsell", routerPaypal);

app.get("/api", (req, res) => {
  res.send("API DE SHADOWSELL");
});

// Conexión a la Base de Datos no Relacional MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(()=> console.log("** Conexion con mongoldb **"))
  .catch((error) => console.error(error));

// Activar el servidor

// app.listen(port, () => console.log("** Sevidor activo **", port));
