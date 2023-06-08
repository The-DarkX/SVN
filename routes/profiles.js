const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isUser } = require('../middleware')
const profiles = require('../controllers/profileController.js')

// const multer = require('multer')
// const { storage } = require('../cloudinary')
// const upload = multer({ storage })


// router.route('/')
//     .get(catchAsync(locations.index))
//     .post(isLoggedIn, upload.array('image'), validateLocation, catchAsync(locations.createLocation))

// router.get('/new', isLoggedIn, locations.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, isUser, catchAsync(profiles.showProfile))
    .put(isLoggedIn, isUser, catchAsync(profiles.updateProfile))
    .delete(isLoggedIn, isUser, catchAsync(profiles.deleteProfile))

// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm))



module.exports = router