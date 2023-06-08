const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
const Location = require('./location')
const Review = require('./review')


const userSchema = new Schema({
    accountType: {
        type: String,
        enum: ['Student', 'Organization', 'none'],
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        required: false
    }
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
})

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })

        await Location.deleteMany({
            _id: {
                $in: doc.locations
            }
        })
    }
})

module.exports = mongoose.model('User', userSchema)