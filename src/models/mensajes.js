const mongoose =require("mongoose");

const mensajeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    
    mensaje:{
        type:String,
        required:true
    }
    

},{ versionKey: false  }) 

module.exports = mongoose.model('mensaje',mensajeSchema)