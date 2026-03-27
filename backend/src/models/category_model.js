const mongoose = require('mongoose')

const categaryschema = new mongoose.Schema({

    name:{ type : String , required : true },

    discription:String,
    image: { type: String },
    crearedat:{ type : Date , default : Date.now }

})

module.exports = mongoose.model('categorys',categaryschema)