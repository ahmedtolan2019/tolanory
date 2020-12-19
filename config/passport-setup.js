const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User')
//serlizeUser
passport.serializeUser((user, done) => {
  done(null, user.id)
})

//deserlizeUser
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
  
})
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK_URL}`
  }, (accessToken, refreshToken, profile, done) => {
    //handle cb function
   
    User.findOne({
      googleId: profile.id
    }).then((currentUser) => {
      //if there is the user in database i.e googleid = profile.id
      //then call done method to convert to cookie
      if (currentUser) {
       
        
        done(null, currentUser)
      } else {
      //if  there is not the user in database i.e googleid = profile.id => create new user
      //then call done methodto convert to cookie
      
        new User({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value

        }).save().then((newUser) => {
         
          done(null, newUser)

        })
        
      }
    })

  }

));