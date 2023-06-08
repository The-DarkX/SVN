const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const auth = require('../controllers/authController')

router.route('/register')
    .get(auth.renderRegisterForm)
    .post(catchAsync(auth.register))

router.route('/login')
    .get(auth.renderLoginForm)
    .post(passport.authenticate(
        'local', {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true
    }), auth.login)

router.get('/logout', auth.logout)

module.exports = router