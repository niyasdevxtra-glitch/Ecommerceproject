const mongoose = require('mongoose')

const order = new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        require:true,
        index: true
    },

    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products",
                require:true
            },

            quantity:{
                type:Number,
                require:true
            }
        }
    ],

    shippingaddress:{
        type:String,
        require:true
    },

    totalamount:{
        type:Number,
        require:true
    },

    orderdate:{
        type:Date,
        default:Date.now
    },

    orderstatus:{
        type:String,
        default:"pending"
    },
    shippedAt:{
        type:Date
    },
    carrierService:{
        type:String,
        default:"Standard"
    }
})

module.exports = mongoose.model("orders",order)
