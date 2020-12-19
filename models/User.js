const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')



//userSchema

const userSchema = new mongoose.Schema({
    googleId:{
        type: String,
        required: true
    },
    displayName:{
        type: String,
        required: true
    },
    firstName:{
        type: String,
        requiered: true
    },
    lastName:{
        type: String,
        requiered: true
        
    },
    image:{
        type: String
        
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
})

userSchema.plugin(findOrCreate)
module.exports = mongoose.model('User', userSchema)