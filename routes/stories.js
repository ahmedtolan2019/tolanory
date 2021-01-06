const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Story = require('../models/Story')
const User = require('../models/User')

// User.find().then(users=>{
//     console.log(users[4].image)
// })

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



router.get('/', async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
    try {
        
        await Story.find({status:'public'}).populate('user').sort({createdAt: -1}).then((stories)=>{
            
            
            res.render('stories/stories',{
                stories: stories,
                user: req.user,
                AdminFlowStatus:AdminFlowStatus
            })
        })
    } catch (error) {
        res.redirect('dashboard')
    }
    
})

router.get('/:id',privateStoryCheck, async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
    try {
        const story = await Story.findById(req.params.id).populate('user')
        const storiesByUser = await Story.find({user:req.user.id}).populate('user').limit(6)
        res.render('stories/storyView',{
            story: story,
            storiesByUser: storiesByUser,
            user: req.user,
            AdminFlowStatus:AdminFlowStatus
        })
    } catch (error) {
        res.redirect('stories')
    }
    
})










module.exports = router