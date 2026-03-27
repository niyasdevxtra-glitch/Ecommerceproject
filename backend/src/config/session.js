const MongoStore = require('connect-mongo')
const session = require('express-session')

function createsession(){
  return session({
      name:"user_session",
      secret:process.env.SESSION_SECRET || "this is the superkey for the session",
      resave:false,
      saveUninitialized:false,
      store:MongoStore.create({
          mongoUrl:process.env.MONGOURL,
          collectionName:"session"
      })
  })
}
module.exports = createsession