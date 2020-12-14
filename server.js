// .env load if only in development environment

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

//requiered packages
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')

//requiered routes
const indexRouter = require('./routes/index')

//set
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')

//use
app.use(expressLayout)
app.use(express.static('public'))

//use routes
app.use('/', indexRouter)

//db connect
mongoose.connect(process.env.DATABASE_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open',()=>console.log('connected to db'))

//listen
app.listen(process.env.PORT || 3000)