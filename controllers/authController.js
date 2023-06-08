const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const query = require('url').parse(req.url, true).query

        const { email, username, password } = req.body
        let user = new User({ email, username, accountType: 'none', bio: '', picture: 'https://res.cloudinary.com/djb8ahbbl/image/upload/v1682928985/VBook/no-profile-pic_qwcycu.png' })

        if (query.t === 'stu') {
            user.accountType = 'Student'
        } else if (query.t === 'org') {
            user.accountType = 'Organization'
        }

        const registeredUser = await User.register(user, password)

        req.login(registeredUser, err => {
            if (err) return next(err)

            req.flash('success', 'Welocme to SVN!')
            res.redirect('/locations')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}




module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/locations'
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err)

        req.flash('success', 'Goodbye!')
        res.redirect('/')
    })
}