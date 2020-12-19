const express = require('express')
const router = express.Router()
const passport = require('passport')

//login
// router.get('/login', (req, res)=>{
//   res.render('login',{
//     layout: "layouts/loginLayout"
//   })
// })

//auth with google
router.get('/google', passport.authenticate('google',{
  scope: ['profile']
}))

//callback route
router.get('/google/callback',passport.authenticate('google'), (req,res)=>{
  res.redirect('/dashboard')
  
})

//logout
router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
})
module.exports = router