// .env load if only in development environment

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const AdminCheck = (req, res, next)=>{
    if(req.user.id !== `${process.env.ADMIN_ID}`){
        
        res.redirect('/dashboard')
    }else{
    
        next();
    }
}

//requiered packages
const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser= require('body-parser')
const methodOverride = require('method-override')



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
const storiesRouter = require('./routes/stories')
const dashboardRouter = require('./routes/dashboard')
const usersRouter = require('./routes/users')
const { urlencoded } = require('express')

//set
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
mongoose.set('useFindAndModify', false);

//use


app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:false
}))
app.use(methodOverride('_method'))

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




//use routes
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/stories',authCheck, storiesRouter)
app.use('/dashboard', authCheck, dashboardRouter)
app.use('/users', authCheck, AdminCheck, usersRouter)

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

