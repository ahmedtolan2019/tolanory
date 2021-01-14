const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')

const Story = require('../models/Story')
const User = require('../models/User')

const AdminFlow = (req) => {
    if (req.user.googleId !== `${process.env.ADMIN_ID}`) {
        return false
    } else {
        return true
    }
}



const privateStoryCheck = (req, res, next) => {
    const story = Story.findById(req.params.id).then(story => {
        if (story.user != req.user.id && story.status !== 'public') {
            res.redirect('/stories')
        } else {
            next()
        }
    })


}
const editableStoryCheck = (req, res, next) => {
    const story = Story.findById(req.params.id).then(story => {
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            next()
        }
    })


}



//get all my useres
router.get('/', async (req, res) => {
    const AdminFlowStatus = AdminFlow(req);
    try {
        await User.find().exec((err, users) => {

            res.render('users/users', {
                users: users,
                AdminFlowStatus: AdminFlowStatus
            })

        })


    } catch (error) {
        console.log(error)
    }

})




router.delete('/:id', async (req, res) => {
    const adminUser = await User.findOne({
        googleId: process.env.ADMIN_ID
    })

    const storiesByTheUser = await Story.find({user: req.params.id})


    if (req.params.id !== adminUser.id) {
        try {
            const user = await User.findById(req.params.id)
            storiesByTheUser.forEach(story => {
                story.remove()
                console.log("story removed!")
                
            });
            await user.remove()
            console.log("user removed!")
            res.redirect('/users')
        } catch (error) {
            res.redirect('/')
        }
    } else {
        res.redirect('/users')
        

    }
})








module.exports = router