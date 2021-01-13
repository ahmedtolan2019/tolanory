const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Story = require('../models/Story')
const User = require('../models/User')

// const test = async()=>{
//     const stories = await Story.find({status:'public'}).populate('user').where('title').ne('Title').sort({createdAt: -1}).exec()
//     stories.forEach(story => {
        
//         console.log("user:")
//         console.log(story.title)
//     });
// }
// test()

// User.find().then(users=>{
//     console.log(users[0].googleId)
// })

const AdminFlow =(req)=>{
    if(req.user.googleId !== `${process.env.ADMIN_ID}`){
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
    const AdminFlowStatus= AdminFlow(req)
    const stories = await Story.find({status:'public'}).populate('user').where('title').ne('Title').sort({createdAt: -1}).exec()
   
    try {
        
     
            
            res.render('stories/stories',{
                stories: stories,
                user: req.user,
                AdminFlowStatus:AdminFlowStatus
            })
        
    } catch (error) {
        res.redirect('dashboard')
    }
    
})

router.get('/:id',privateStoryCheck, async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
    try {
        const story = await Story.findById(req.params.id).populate('user')
        const storiesByUser = await Story.find({user:story.user}).populate('user').where('_id').ne(req.params.id).limit(4).exec()
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

//all stories by the user

router.get('/storiesByTheUser/:userId', async(req, res)=>{
    
    const AdminFlowStatus= AdminFlow(req);
    const user  = await User.findById(req.params.userId)
    try {
        
        await Story.find({status:'public', user:req.params.userId}).populate('user').sort({createdAt: -1}).then((storiesByTheUser)=>{
            
            
            res.render('stories/storiesByTheUser',{
                stories: storiesByTheUser,
                user: req.user,
                AdminFlowStatus:AdminFlowStatus,
                storyUser:user
            })
        })
    } catch (error) {
        res.redirect('dashboard')
    }
    
})








module.exports = router