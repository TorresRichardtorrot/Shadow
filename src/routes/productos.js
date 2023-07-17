const express = require("express");
const productSchema = require("../models/productos");
const routerP = express.Router();

//crear productos
routerP.post('/productos', (req, res) => {
  const nombreProducto = req.body.name;
  const email = req.body.email_id
//  console.log(nombreProducto)
  productSchema.findOne({ name: nombreProducto, email_id:email })
    .then((existingProduct) => {

      if (existingProduct) {
        return res.json({ message: 'El producto ya existe' });
      } else {
        const producto = productSchema(req.body);
        producto.save()
        .then((data) => res.status(200).json({ message: 'Guardado', data }))
          .catch((error) => res.status(400).json({ message: error }));
      }
    })
    .catch((error) => res.status(500).json({ message: 'Error al verificar el producto', error }));
});


//Obtener todos los productos

routerP.get('/productos',(req,res) =>{
    productSchema
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
 }); 

// obtener los productos con el email_id

routerP.get('/productos/:email_id', (req, res) => {
    const { email_id } = req.params;
    productSchema
      .find({ email_id }) 
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });
   

  //obtener un producto por su nombre para editar

  routerP.put('/productosEdit/:id', (req, res) => {
    const { id: idParams } = req.params;
    const { name, precio, descripción } = req.body;
    productSchema
      .updateOne({ _id: idParams }, { $set: { name, precio, descripción }})
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

//eliminar un producto con el nombre
routerP.delete('/productosName/:name', (req, res) => {
    const { name } = req.params;
    productSchema
      .deleteOne({ name: name }) 
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
});

//eliminar producto por el _id
routerP.delete('/productosID/:id', (req, res) => {
  const { id } = req.params;
  productSchema
    .deleteOne({ _id: id }) 
    .then(() => res.send({ message: 'Producto eliminado' }))
    .catch((error) => res.send({ message: error }));
});




   


module.exports = routerP