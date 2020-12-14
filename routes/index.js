const express = require('express')
const router = express.Router()


router.get('/', async(req, res)=>{
 try {
     await res.render('index')
 } catch (error) {
     console.log(error)
 }
})

module.exports = router