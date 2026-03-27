const mongoose = require('mongoose')

const cart =  new mongoose.Schema({

    user:{type:mongoose.Schema.Types.ObjectId,

        ref:'users',

        required:true
    },

    items:[{

        product:{type:mongoose.Schema.Types.ObjectId,

            ref:'products',

            requierd:true

        },
        quantity:{

            type:Number,

            default:1,

            min:1
        },
        shippingMethod:{
            type:String,
            default:'Standard'
        }
    }],

    Total: { type: Number, default: 0 },

    updatedat:{type:Date,
        
        default:Date.now
    
    }

})

module.exports = mongoose.model('carts',cart)