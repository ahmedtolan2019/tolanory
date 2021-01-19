const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Story = require('../models/Story')
const User = require('../models/User')

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
const editableStoryCheck = (req, res, next)=>{
    const story= Story.findById(req.params.id).then(story=>{
        if(story.user != req.user.id){
            res.redirect('/stories')
        }else{
            next()
        }
    })
    
    
}



//get all my stories
router.get('/', async (req, res) => {
    const AdminFlowStatus= AdminFlow(req);
            
    try {
      
        await Story.find({user:req.user.id}).exec((err, stories) => {
            
            res.render('dashboard/dashboard', {
                stories: stories,
                AdminFlowStatus:AdminFlowStatus
            })

        })


    } catch (error) {
        console.log(error)
    }

})

//create new story
router.get('/create', (req, res) => {
    const AdminFlowStatus= AdminFlow(req);
   
    res.render('dashboard/create',{
        AdminFlowStatus:AdminFlowStatus
    })
})

router.post('/', async (req, res) => {

    const story = new Story({
        title: req.body.title,
        status: req.body.status,
        user: req.user.id,
        body: req.body.body

    })

    try {
        const newStory = await story.save()
        res.redirect('dashboard')
    } catch (error) {
        res.render('dashboard/create', {
            story: story,
            errorMessage: "Couldn't create a story"

        })
        console.log(error)
    }
})



router.get('/edit/:id',editableStoryCheck, async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
           
    try {
        const story = await Story.findById(req.params.id).populate('user')
        const storiesByUser = await Story.find({user:req.user.id}).populate('user').limit(6)
        res.render('dashboard/edit',{
            story: story,
            storiesByUser: storiesByUser,
            user: req.user,
            AdminFlowStatus:AdminFlowStatus
        })
    } catch (error) {
        res.redirect('/')
    }
    
})
router.put('/:id', async (req, res) => {  
   
    try {
      let story =await Story.findById(req.params.id);
      story.title = req.body.title;
      story.status = req.body.status;
      story.body = req.body.body;
     await story.save();
        
        res.redirect(`/stories/${story.id}`)
    } catch (error) {
       
        console.log(error)
    }
})

router.delete('/:id', async(req, res)=>{
    const AdminFlowStatus= AdminFlow(req);
try {
   const story =  await Story.findById(req.params.id)
   await story.remove()
   if(AdminFlowStatus){
    res.redirect('/stories')
   }else{
    res.redirect('/')
   }
} catch (error) {
    res.redirect('/dashboard')
}
})








module.exports = router