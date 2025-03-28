const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateLocation } = require('../middleware')
const locations = require('../controllers/locationsController')

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(locations.index))
    .post(isLoggedIn, upload.array('image'), validateLocation, catchAsync(locations.createLocation))

router.get('/new', isLoggedIn, locations.renderNewForm)

router.route('/:id')
    .get(catchAsync(locations.showLocation))
    .put(validateLocation, isAuthor, catchAsync(locations.updateLocation))
    .delete(isLoggedIn, isAuthor, catchAsync(locations.deleteLocation))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(locations.renderEditForm))



module.exports = router