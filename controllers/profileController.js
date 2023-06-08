const User = require('../models/user')

module.exports.showProfile = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.render('users/show', { user })
}

module.exports.updateProfile = async (req, res) => {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(id, { ...req.body.user })


    if (req.body.user.password_old !== '') {
        if (req.body.user.password_new === req.body.user.password_new_conf) {
            // User.changePassword(req.body.user.password_old, req.body.user.password_new)
            // console.log('successful')

            await user.changePassword(req.body.user.password_old, req.body.user.password_new, function (err) {
                if (err) {
                    if (err.name === 'IncorrectPasswordError') {
                        req.flash('error', 'Successfully Incorrect password')
                    } else {
                        req.flash('error', 'Something went wrong!! Please try again')
                    }
                } else {
                    req.flash('success', 'Successfully Updated Password')
                }
            })
        } else {
            req.flash('error', 'The Passwords do not match!')
        }
    }
    await user.save()

    req.flash('success', 'Successfully Updated Profile')
    res.redirect(`/users/${user._id}/`)
}

module.exports.deleteProfile = async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    req.flash('success', 'Account Deleted')
    res.redirect('/')
}