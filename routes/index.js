const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Story = require('../models/Story')
const User = require('../models/User')

const AdminFlow =(req)=>{
    if(req.user.id !== `${process.env.ADMIN_ID}`){
        return false
    }else{
        return true
    }
}

//fn to check auth
const authCheck = (req, res, next)=>{
    if(!req.user){
        res.redirect('/')
    }else{
        next();
    }
}
const guestCheck = (req, res, next)=>{
    if(req.isAuthenticated()){
        res.redirect('/dashboard')
    }else{
        next();
    }
}

router.get('/', guestCheck, async(req, res)=>{
 try {
     await res.render('login',{
         layout: "layouts/loginLayout",
     })
 } catch (error) {
     console.log(error)
 }
})

router.get('/dashboard', authCheck, async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
 try {
    await Story.find({user:req.user.id}).sort({createdAt: -1}).exec((err,stories)=>{
    
        res.render('dashboard/dashboard',{
            stories: stories,
            user: req.user,
            AdminFlowStatus:AdminFlowStatus
        })
        
    })
    //  await res.render('dashboard/dashboard',{
    //      user: req.user
    //  })
 } catch (error) {
     console.log(error)
 }
})

module.exports = router