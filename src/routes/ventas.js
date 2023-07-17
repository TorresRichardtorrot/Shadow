const express = require("express");
const  ventaSchema = require("../models/ventas");

const routerV = express.Router();

routerV.post('/ventas',(req,res) =>{

    const venta = ventaSchema(req.body);
    venta.save()
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
 }); 


 routerV.get('/ventas/:email_id', (req, res) => {
    const { email_id } = req.params;
    ventaSchema
      .find({ email_id }) 
      .then((data) => {

        const fechas = data.map((venta) => venta.fecha);

        // Envía las fechas en la respuesta JSON
        res.json(fechas);
      }
       
      )
      .catch((error) => res.json({ message: error }));
  });

  routerV.get('/ventasF/:email_id', (req, res) => {
    const { email_id } = req.params;
    ventaSchema
      .find({ email_id }) 
      .then((data) => {
        res.json(data);
      }
       
      )
      .catch((error) => res.json({ message: error }));
  });


module.exports = routerV




