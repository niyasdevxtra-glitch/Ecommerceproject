const mongoose = require('mongoose')


async function dbconnect(){
    try{
        await mongoose.connect(process.env.MONGOURL)
        console.log('database connected !!! ')
    }catch(err){
        console.error('mongodb error :',err)
    }
}

module.exports = dbconnect