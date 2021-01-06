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



const privateStoryCheck = (req, res, next)=>{
    const story= Story.findById(req.params.id).then(story=>{
        if(story.user != req.user.id && story.status !== 'public'){
            res.redirect('/stories')
        }else{
            next()
        }
    })
    
    
}
const editableStoryCheck = (req, res, next)=>{
    const story= Story.findById(req.params.id).then(story=>{
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            next()
        }
    })
    
    
}



//get all my useres
router.get('/', async (req, res) => {
    const AdminFlowStatus= AdminFlow(req);
    try {
        await User.find().exec((err, users) => {
           
            res.render('users/users', {
                users: users,
                AdminFlowStatus:AdminFlowStatus
            })

        })


    } catch (error) {
        console.log(error)
    }

})




router.delete('/:id', async(req, res)=>{
try {
   const user =  await User.findById(req.params.id)
   await user.remove()
   res.redirect('/users')
} catch (error) {
    res.redirect('/')
}
})








module.exports = router