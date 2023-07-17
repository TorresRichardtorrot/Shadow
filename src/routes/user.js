const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const nodemailer = require('nodemailer');
const userSchema = require("../models/user");
const saltRounds = 9;
const router = express.Router();

// crear usuario
router.post("/users", async (req, res) => {
  try {
    // console.log(req.body)
    const { name, email, clave, confirmaClave, activo, modo,pago } = req.body;
    const Token = null;
    const expira = null;
    const usuarioExistente = await userSchema.findOne({ email });

    if (usuarioExistente) {
      return res.json({ isOk: false, msj: "El usuario ya existe" });
    }

    if (clave === confirmaClave) {
      // Encriptar la contraseña
      const hashed = await bcrypt.hash(clave, saltRounds);

      // Guardar el usuario en la base de datos
      const nuevoUsuario = userSchema({
        name,
        email,
        clave: hashed,
        activo,
        modo,
        pago,
        Token,
        expira
      });

      await nuevoUsuario.save();
      res.json({ isOk: true, msj: "Usuario almacenado correctamente" });
    } else {
      res.json({ isOk: false, msj: "Las contraseñas no coinciden" });
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.json({ isOk: false, msj: "Error al crear el usuario" });
  }
});

// ver todos los usuarios
router.get("/users", (req, res) => {
  userSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// ver un usuario por medio de parametros
router.get("/users/:email/:clave", async (req, res) => {
  
  const { email, clave } = req.params;
  // console.log(email, clave)
  try {
    const usuario = await userSchema.findOne({ email,});
      // console.log(usuario)
    if (!usuario) {
      return res.json({ isOk: false, msj: "El usuario no existe" });
    }

    const claveValida = await bcrypt.compare(clave, usuario.clave);

    if (claveValida) {
      return res.json({ isOk: true, msj: "La contraseña es válida" });
    } else {
      return res.json({ isOk: false, msj: "La contraseña es incorrecta" });
    }
  } catch (error) {
    console.error("Error al buscar el usuario:", error);
    return res.json({ isOk: false, msj: "Error al buscar el usuario" });
  }
});


// validar el activo
router.get('/usersActivo/:email', (req, res) => {
  const { email } = req.params;
  userSchema
    .findOne({ email: email })
    .then((user) => {
      
      if (user) {
        const activo = user.activo;
        if (activo === true) {
          res.json({ message: true });
        } else if (activo === false) {
          res.json({ message:false});
        }
      } else {
        res.json({ message:`No se encontró ${email}`});
      }
    })
    .catch((error) => res.json({ message: error }));
});

// eliminar usuario
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userSchema
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// editar usuario
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  userSchema
    .updateOne({ _id: id }, { $set: { name,email } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

router.put('/usersID/:email', (req, res) => {
  const { email: emailParam } = req.params;
  const { activo } = req.body;
  userSchema
    .updateOne({ email: emailParam }, { $set: { activo }}) 
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// lo que nesesito para el modo

// autenticar modo
router.get('/usersModo/:email', (req, res) => {
  const { email } = req.params;
  userSchema
    .findOne({ email: email })
    .then((user) => {
      
      if (user) {
        const activo = user.modo;
        if (activo === true) {
          res.json({ message: true });
        } else if (activo === false) {
          res.json({ message:false});
        }
      } else {
        res.json({ message:`No se encontró ${email}`});
      }
    })
    .catch((error) => res.json({ message: error }));
});

router.put('/usersModoID/:email', (req, res) => {
  const { email: emailParam } = req.params;
  const { modo } = req.body;
  // console.log(modo)
  userSchema
    .updateOne({ email: emailParam }, { $set: { modo }}) 
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});


router.post('/recuperarP', async (req,res) => {
 
  const { email } = req.body;
  // console.log(email)

  const usuario = await userSchema.findOne({email})
  

  
  if(!usuario){
    res.json({ isOk: false, msj: "El usuario no existe" });
    return res.redirect('/shadowsell')
  }

  //aqui genero un token 

  usuario.Token = crypto.randomBytes(20).toString('hex');
  usuario.expira = Date.now()+36000000

  usuario.save()

  const resetURL = `/shadowsell/restablecer/${usuario.Token}`
  const Token = usuario.Token
  // console.log(resetURL)


  //Enviar la url al correo 

  // Realizar la solicitud POST a la ruta /user/enviar
  try {
    await fetch(`/shadowsell/user/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resetURL,email,Token })
    });
    // console.log("hola")
    res.status(200).json({ isOk: true, msj: "Solicitud enviada correctamente" });
  } catch (error) {
    res.status(500).json({ isOk: false, msj: "Error al enviar la solicitud" });
  }
  
})

router.post('/user/enviar', async (req, res) => {
  const { resetURL } = req.body;
  const { email } = req.body;
  const { Token } = req.body;
  try {
    // Crear el transporte con la cuenta de prueba
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "torresdrichar@gmail.com",
          pass:"gtyueellicrdqslx"
        }
      });

    // Configurar el mensaje de correo electrónico
    const mensaje = {
      from: '"Restablecer contraseña 👻" <torresdrichar@gmail.com>',
      to: email ,
      subject: "Hola ✔",
      html:`<b>Enlace para restablecer contraseña</b><br>
        <h4>Token: ${Token}</h4>
       <a href="${resetURL}">Restablecer contraseña</a>`
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mensaje)
    // console.log("enviado")
    return res.status(201).json({
         msg: "El correo electrónico ha sido enviado correctamente"});
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    return res.status(500).json({ error: "Error al enviar el correo electrónico" });
  }
});


router.get('/restablecer/:Token', async ( req , res )=>{
 const Token = req.params.Token;
 const usuario = userSchema.findOne({ Token });

 if(!usuario){
  res.redirect('/shadowsell')
 }
res.redirect('/login/restablecerP.html')

})

router.post('/actualizarP', async (req, res) => {
  const confirmaClave = req.body.passwordC;
  const clave = req.body.password;
  const Token = req.body.Token;

  // Encontrar el usuario correspondiente al Token
  const usuario = await userSchema.findOne({ 
    Token,
    expira: { $gt: Date.now() }
  });

  if (!usuario) {
    res.json({ isOk: false, msj: "El usuario no existe" });
    return res.redirect('/shadowsell');
  }
 
  if (clave === confirmaClave) {
    try {
      // Encriptar la contraseña
      const hashed = await bcrypt.hash(clave, saltRounds);

      // Actualizar los campos del usuario
      usuario.Token = null;
      usuario.expira = null;
      usuario.clave = hashed;

      // Guardar los cambios en la base de datos
      await usuario.save();

      res.json({ isOk: true, msj: "La contraseña se ha actualizado correctamente" });
    } catch (error) {
      res.json({ isOk: false, msj: "Error al actualizar la contraseña" });
    }
  } else {
    res.json({ isOk: false, msj: "La confirmación de contraseña no coincide" });
  }
});





module.exports = router;
