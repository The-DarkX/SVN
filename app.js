if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')

const session = require('express-session')
const flash = require('connect-flash')

const methodOverride = require('method-override')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const locationRoutes = require('./routes/locations')
const locationReviewRoutes = require('./routes/locationReviews')
const profileRoutes = require('./routes/profiles')

mongoose.set('strictQuery', true)
mongoose.set('strictPopulate', false)


mongoose.connect('mongodb://127.0.0.1:27017/vbook')

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'smthinsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    if (!['/login', '/register', '/', '/favicon.ico'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user
    res.locals.currentPage = ''
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

/*

/users/:id/timesheet
/users/:id/profile
/users/:id/delete
/users/login
/users/logout
/users/register

/users/:id/log --> logs user activity (only open for school admins)

/locations --> get, volunteer map
/locations --> post, create
/locations/:id/edit --> put, update location
/locations/:id --> delete, delete location
/locations/:id --> get, show page

/locations/:id/reviews --> post, add review
/locations/:id/reviews --> put, update review

/ --> home page
/about


*/

app.use('/', userRoutes)
app.use('/users', profileRoutes)
app.use('/locations', locationRoutes)
app.use('/locations/:id/reviews', locationReviewRoutes)





// // View user profile
// app.get('/users/:id', async (req, res) => {
//     const user = await User.findById(req.params.id)
//     res.render('users/profile', { user })
// })

// // Edit user profile
// app.get('/users/:id/edit', async (req, res) => {
//     const user = await User.findById(req.params.id)
//     res.render('users/editProfile', { user })
// })

// // Update user profile
// app.put('/users/:id', async (req, res) => {
//     const { id } = req.params
//     const user = await User.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
//     res.redirect(`/users/${user._id}`)
// })

// // Delete user profile
// app.delete('/users/:id', async (req, res) => {
//     const { id } = req.params
//     await User.findByIdAndDelete(id)
//     req.logout()
//     res.redirect('/')
// })




app.get('/', (req, res) => {
    res.render('main/home_v2')
})

app.get('/about', (req, res) => {
    res.render('main/about')
})

app.get('/under-construction', (req, res) => {
    res.render('errors/503')
})

app.all('*', (req, res, next) => {
    //next(new ExpressError('Page Not Found', 404))
    res.render('errors/404')
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message)
        err.message = 'Oh No, Something Went Wrong!'

    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


/* 
Fix:
-Home page image container size
-home page container x padding
-avatar fix text centering
-fix map not showing
-profile controller to update profile or delete

*/