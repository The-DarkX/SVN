const { locationSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Location = require('./models/location')
const Review = require('./models/review')
const User = require('./models/user')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateLocation = (req, res, next) => {
    const { error } = locationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const location = await Location.findById(id)
    if (!location.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/locations/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/locations/${id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    // console.log(user)

    // if (!user._id === res.currentUser._id) {
    //     req.flash('error', 'You do not have permission to do that!')
    //     return res.redirect(`/`)
    // }
    next()
}

// module.exports.validateUser = (req, res, next) => {
//     const { error } = userSchema.validate(req.body)
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next()
//     }
// }