const express = require("express");
const  mensageSchema = require("../models/mensajes");
const routerM = express.Router();


routerM.post('/mensajes',(req,res) =>{

    const mensage = mensageSchema(req.body);
    mensage.save()
    .then((data) => res.json(data))
    .catch((error) => res.json({message: error}));
 }); 

 routerM.get("/mensajes", (req, res) => {
    mensageSchema
      .find()
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  });

module.exports = routerM




