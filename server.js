// .env load if only in development environment

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


//requiered packages
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')


//models require
const User = require('./models/User')



//passport require
const cookieSession = require('cookie-session')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')

//cookie session
app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys:[`${process.env.COOKIE_KEY}`]
}))
//paasport initialaize
app.use(passport.initialize())
app.use(passport.session())





//requiered routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth-routes')

//set
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')

//use


app.use(expressLayout)
app.use(express.static('public'))


//use routes
app.use('/', indexRouter)
app.use('/auth', authRouter)

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