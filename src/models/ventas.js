const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    },
    cantidad: {
      type: Number,
      required: true
    },
    precioU: {
      type: Number,
      required: true
    }
  }, { _id: false });
  
  const ventaSchema = new mongoose.Schema({
    fecha: {
      type: Date,
      required: true
    },
    email_id:{
      type:String,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    productos: [productoSchema]
  }, { versionKey: false });
  
  // Resto del código...
  


module.exports = mongoose.model('Venta', ventaSchema);
