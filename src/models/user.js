const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  clave: {
    type: String,
  },
  activo:{
    type:Boolean,
  },
  modo:{
    type:Boolean
  },
  pago:{
    type:Boolean
  },
  Token:{
    type:String
  },
  expira:{
    type:String
  }
 
},{ versionKey: false });

module.exports = mongoose.model('User', userSchema);