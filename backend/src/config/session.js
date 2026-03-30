const MongoStore = require('connect-mongo')
const session = require('express-session')

function createsession(){
  return session({
      name: "user_session",
      secret: process.env.SESSION_SECRET || "this is the superkey for the session",
      resave: false,
      saveUninitialized: false,
      proxy: true, // Required because Render/Vercel use a proxy
      store: MongoStore.create({
          mongoUrl: process.env.MONGOURL,
          collectionName: "session"
      }),
      cookie: {
          secure: true,      
          sameSite: 'none', 
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
  })
}
module.exports = createsession