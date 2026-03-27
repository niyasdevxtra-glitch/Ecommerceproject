const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    username:{ type : String ,required: true},
    email:{ type : String ,required: true},
    password:{ type : String ,required: true},
    role:{ type : String ,default:'user'},
    status:{ type : String ,default:'active'}
})  
module.exports = mongoose.model('users',userschema)