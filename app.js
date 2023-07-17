const express = require('express');
const app = express();
const path = require('path');

//Rutas del front
//modelo:app.use('/<NOMBRE DE LA RUTA>', express.static(path.resolve('<NOMBRE DE LA CARPETA QUE VAMOS A ACEDER>', 'NOMBRE')));

// Rutas view
app.use('/', express.static(path.resolve('view','home')));
app.use('/login', express.static(path.resolve('view','login')));
app.use('/register', express.static(path.resolve('view','register')));
app.use('/Cpts', express.static(path.resolve('view','components')));
app.use('/app', express.static(path.resolve('view','app')));
app.use('/admin', express.static(path.resolve('view','admin')));
app.use('/adminRoot', express.static(path.resolve('view','adminroot')));
app.use('/contactos', express.static(path.resolve('view','contactos')));


module.exports = app;


