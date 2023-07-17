const mongoose =require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    
    descripción:{
        type:String,
    },
    email_id:{
        type:String,
        required:true
    },
    

},{ versionKey: false } ) 

module.exports = mongoose.model('Producto',productSchema)