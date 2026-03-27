const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    name:{ type : String , required : true, index: true },
    description : String,
    price:{ type : Number , required : true },
    category : { type: String, index: true },
    stock:{ type : Number , default : 0 },
    image : String,
    createdat : { type : Date , default : Date.now }
})

module.exports = mongoose.model("products",productschema)