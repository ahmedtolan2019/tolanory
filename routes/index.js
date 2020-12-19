const express = require('express')
const router = express.Router()

//fn to check auth
const authCheck = (req, res, next)=>{
    if(!req.user){
        res.redirect('/')
    }else{
        next();
    }
}

router.get('/', async(req, res)=>{
 try {
     await res.render('login',{
         layout: "layouts/loginLayout",
     })
 } catch (error) {
     console.log(error)
 }
})

router.get('/dashboard', authCheck, async(req, res)=>{
 try {
     await res.render('dashboard',{
         user: req.user
     })
 } catch (error) {
     console.log(error)
 }
})

module.exports = router